
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import ServiceUnavailable from "@/Components/ServiceUnavailable";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";
const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

/**
 * Storefront product detail — GET /product/slug/:slug (no auth).
 * Uses ISR (revalidate: 60) for sub-second TTFB and crawl efficiency.
 */
async function getProduct(slug) {
  try {
    const res = await fetch(`${backendURL}/product/slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) {
      return { status: "missing", product: null };
    }

    const result = await res.json();

    if (!res.ok || result?.success === false || !result?.data) {
      return { status: "unavailable", product: null };
    }

    return { status: "ok", product: result.data };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return { status: "unavailable", product: null };
  }
}

/**
 * "Similar Specialties" rail — GET /product/public (no auth)
 */
async function getSimilarProducts(categoryId, productId) {
  try {
    if (!categoryId) return [];
    const res = await fetch(
      `${backendURL}/product/public?categoryId=${categoryId}&limit=5`,
      { next: { revalidate: 300 } }
    );
    const result = await res.json();
    return result.data?.filter((p) => p.id !== productId).slice(0, 4) || [];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

/**
 * Per-product SEO — OpenGraph, Twitter Cards, Canonical URL.
 */
export async function generateMetadata({ params }) {
  const { status, product } = await getProduct(params.slug);

  if (status !== "ok" || !product) {
    return status === "missing"
      ? {
          title: "Delicacy Not Found | Baking Tales",
          description: "The delicacy you're looking for seems to have vanished.",
        }
      : {
          title: "Temporarily Unavailable | Baking Tales",
          description:
            "Our kitchen servers are momentarily unreachable. Please try again shortly.",
          robots: { index: false, follow: false },
        };
  }

  const imagePath = product.flavors?.flatMap((f) => f.images || [])[0]?.path;
  const imageUrl =
    imagePath && fileBase
      ? `${fileBase}/${imagePath}`
      : `${siteUrl}/assets/aboutUsImage.jpg`;
  const productUrl = `${siteUrl}/products/${params.slug}`;
  const description =
    product.description?.slice(0, 160) ||
    `Order ${product.title} online — freshly handcrafted with love by Baking Tales.`;

  return {
    title: `${product.title} | Baking Tales`,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.title} | Baking Tales`,
      description,
      url: productUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Baking Tales`,
      description,
      images: [imageUrl],
    },
  };
}

const ProductPage = async ({ params }) => {
  const { slug } = params;
  const { status, product } = await getProduct(slug);

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

  const similarProducts = await getSimilarProducts(
    product.category?.id,
    product.id
  );

  // Compute pricing bounds and images for JSON-LD schema
  const allSizes = product.flavors?.flatMap((f) => f.sizes || []) || [];
  const prices = allSizes
    .map((s) => Number(s.salesPrice ?? s.price ?? 0))
    .filter((p) => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const totalStock = allSizes.reduce((sum, s) => sum + (s.stock || 0), 0);

  const images = (product.flavors?.flatMap((f) => f.images || []) || [])
    .map((img) => (img?.path && fileBase ? `${fileBase}/${img.path}` : null))
    .filter(Boolean);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description || `Freshly baked ${product.title} from Baking Tales.`,
    image: images.length > 0 ? images : [`${siteUrl}/assets/aboutUsImage.jpg`],
    category: product.category?.name || "Bakery",
    brand: {
      "@type": "Brand",
      name: "Baking Tales",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BDT",
      lowPrice: minPrice,
      highPrice: maxPrice || minPrice,
      offerCount: allSizes.length || 1,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Baking Tales",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${siteUrl}/products`,
      },
      ...(product.category?.name
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category.name,
              item: `${siteUrl}/products?category=${product.category.slug || ""}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.title,
              item: `${siteUrl}/products/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: product.title,
              item: `${siteUrl}/products/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} similarProducts={similarProducts} />
    </>
  );
};

export default ProductPage;

