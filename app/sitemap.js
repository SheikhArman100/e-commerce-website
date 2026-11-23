const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";

/**
 * Standard Next.js 14 App Router sitemap.xml generator.
 * Indexes core storefront landing pages, taxonomy, and every active product.
 */
export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // Core static routes
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/journals`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic product routes from backend feed
  let productRoutes = [];
  try {
    if (backendURL) {
      const res = await fetch(`${backendURL}/product/public?limit=1000`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success && Array.isArray(json?.data)) {
          productRoutes = json.data.map((product) => ({
            url: `${siteUrl}/products/${product.slug}`,
            lastModified: product.updatedAt
              ? new Date(product.updatedAt).toISOString()
              : currentDate,
            changeFrequency: "daily",
            priority: 0.8,
          }));
        }
      }
    }
  } catch (error) {
    console.error("Error generating product sitemap entries:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
