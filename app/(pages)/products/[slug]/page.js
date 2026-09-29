
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import ServiceUnavailable from "@/Components/ServiceUnavailable";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Storefront product detail — GET /product/slug/:slug (no auth): ACTIVE
 * products only, display-safe fields, campaign-aware per-size prices.
 * Always `no-store`: campaign pricing and stock change at any moment, so
 * this fetch runs on every request.
 *
 * A hidden (isActive=false) slug 404s by design — no soft "Item Not Found"
 * render, so anonymous visitors can never open (or index) hidden products.
 *
 * Returns a DISCRIMINATED result, not a bare product. A single `null` for both
 * "no such product" and "the API is down" is what previously made a server
 * outage render the 404 page — telling customers and crawlers a real product
 * had vanished when it had not. A hidden product must still 404, so that is
 * keyed off an explicit 404; anything else (connection refused, timeout, 5xx,
 * unparseable body) is `unavailable` and gets a retryable page instead.
 */
async function getProduct(slug) {
  try {
    const res = await fetch(`${backendURL}/product/slug/${slug}`, {
      cache: "no-store",
    });

    // 404 specifically = the product genuinely is not there. Checked before
    // parsing so an error body (or an HTML error page) cannot be mistaken for
    // a product payload.
    if (res.status === 404) {
      return { status: "missing", product: null };
    }

    const result = await res.json();

    if (!res.ok || result?.success === false || !result?.data) {
      return { status: "unavailable", product: null };
    }

    return { status: "ok", product: result.data };
  } catch (error) {
    // Network-level failure: the server is down, unreachable, or timed out.
    console.error("Error fetching product by slug:", error);
    return { status: "unavailable", product: null };
  }
}

/**
 * "Similar Specialties" rail — GET /product/public (no auth): same
 * category, current product filtered out client-side, top 4 kept. The
 * legacy GET /product call this used leaked `creator.email` into the page
 * payload, so it is intentionally never used here.
 */
async function getSimilarProducts(categoryId, productId) {
  try {
    if (!categoryId) return [];
    const res = await fetch(
      `${backendURL}/product/public?categoryId=${categoryId}&limit=5`,
      { cache: "no-store" }
    );
    const result = await res.json();
    // Filter out the current product
    return result.data?.filter((p) => p.id !== productId).slice(0, 4) || [];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

/**
 * Per-product SEO — crawlers get a real title/description (and social
 * image when the product has one) instead of the layout fallback.
 */
export async function generateMetadata({ params }) {
  const { status, product } = await getProduct(params.slug);

  if (status !== "ok" || !product) {
    // A real 404 keeps the "not found" wording; an unreachable server must not
    // claim the product is missing, so it gets neutral, index-blocking copy.
    return status === "missing"
      ? {
          title: "Delicacy Not Found | Baking Tales",
          description: "The delicacy you're looking for seems to have vanished.",
        }
      : {
          title: "Temporarily Unavailable | Baking Tales",
          description: "Our kitchen servers are momentarily unreachable. Please try again shortly.",
          // Never let a transient outage get indexed as a real page.
          robots: { index: false, follow: false },
        };
  }
  const imagePath = product.flavors?.flatMap((f) => f.images || [])[0]?.path;
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  return {
    title: `${product.title} | Baking Tales`,
    description:
      product.description?.slice(0, 160) ||
      `Order ${product.title} online — handcrafted by Baking Tales.`,
    ...(imagePath && fileBase
      ? { openGraph: { images: [`${fileBase}/${imagePath}`] } }
      : {}),
  };
}

const ProductPage = async ({ params }) => {
  const { slug } = params;
  const { status, product } = await getProduct(slug);

  // Only a genuine 404 is a 404. The server being down must not claim a real
  // product has vanished, so it renders a retryable page in the same design
  // language rather than the "Item Not Found" screen.
  if (status === "missing") {
    notFound();
  }

  if (status !== "ok" || !product) {
    return (
      <ServiceUnavailable
        title="This delicacy is taking a short pause"
        message="We can't reach our kitchen servers at the moment, so this page can't load just yet. The delicacy is very much still here — please try again in a moment."
      />
    );
  }

  const similarProducts = await getSimilarProducts(product.category?.id, product.id);

  return (
    <ProductClient product={product} similarProducts={similarProducts} />
  );
};

export default ProductPage;

