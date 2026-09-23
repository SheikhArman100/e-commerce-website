
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Storefront product detail — GET /product/slug/:slug (no auth): ACTIVE
 * products only, display-safe fields, campaign-aware per-size prices.
 * Always `no-store`: campaign pricing and stock change at any moment, so
 * this fetch runs on every request.
 *
 * A hidden (isActive=false) slug 404s by design — no soft "Item Not Found"
 * render, so anonymous visitors can never open (or index) hidden products.
 */
async function getProduct(slug) {
  try {
    const res = await fetch(`${backendURL}/product/slug/${slug}`, {
      cache: "no-store",
    });
    const result = await res.json();
    if (!res.ok || result?.success === false || !result?.data) {
      return null;
    }
    return result.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
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
  const product = await getProduct(params.slug);
  if (!product) {
    return {
      title: "Delicacy Not Found | Baking Tales",
      description: "The delicacy you're looking for seems to have vanished.",
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
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category?.id, product.id);

  return (
    <ProductClient product={product} similarProducts={similarProducts} />
  );
};

export default ProductPage;

