const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";

/**
 * Standard Next.js 14 App Router robots.txt generator.
 * Guides crawlers to index public pages while keeping private user routes out of index.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/", "/about", "/journals"],
        disallow: [
          "/auth/",
          "/cart",
          "/checkout/",
          "/order",
          "/wishlist",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
