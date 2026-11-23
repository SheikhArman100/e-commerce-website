import CampaignSection from "./components/CampaignSection";
import Categories from "@/app/components/Categories";
import Header from "@/Components/header/Header.js";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer.js";
import HomeContainer from "./components/HomeContainer";
import HomeSection from "./components/HomeSection.js";
import Journal from "./components/Journal";
import ProductSection from "./components/ProductSection";
import Services from "./components/Services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bakingtales.com";

export const metadata = {
  title: "Baking Tales | Delicious Handcrafted Cakes & Cupcakes",
  description:
    "Experience the finest handcrafted cakes, cupcakes, and baked goods at Baking Tales. Freshly made with love and delivered to your doorstep.",
  keywords: "bakery, cakes, cupcakes, home made, dessert, ecommerce, pastries",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Baking Tales | Delicious Handcrafted Cakes & Cupcakes",
    description:
      "Experience the finest handcrafted cakes, cupcakes, and artisanal confections made fresh daily.",
    url: siteUrl,
    type: "website",
  },
};

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Public feed of products flagged `isFeatured` (and still active).
 * Revalidated every 60s for high-speed SEO caching (ISR).
 */
async function getFeaturedProducts() {
  try {
    const response = await fetch(`${backendURL}/product/featured?limit=6`, {
      next: { revalidate: 60 },
    });
    const data = await response.json();
    return data?.data ?? [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetches the currently-running campaign. Revalidated every 60s.
 */
async function getActiveCampaign() {
  try {
    const response = await fetch(`${backendURL}/campaign/active`, {
      next: { revalidate: 60 },
    });
    const data = await response.json();
    return data?.data ?? null;
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return null;
  }
}

/**
 * Public storefront category feed — GET /category/public (no auth).
 * Revalidated every 60s for instant crawl responses.
 */
async function getPublicCategories() {
  try {
    const response = await fetch(`${backendURL}/category/public?limit=3`, {
      next: { revalidate: 60 },
    });
    const data = await response.json();
    return data?.data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const [featuredProducts, categories, activeCampaign] = await Promise.all([
    getFeaturedProducts(),
    getPublicCategories(),
    getActiveCampaign(),
  ]);

  // GET /campaign/active already returns the campaign's products with campaign
  // pricing applied, so no second round-trip is needed.
  const campaignProducts = activeCampaign?.products ?? [];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Baking Tales",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeSection>
        <Header />
        <HomeContainer activeCampaign={activeCampaign}>
          {/* Section 1 — products flagged `isFeatured` (GET /product/featured) */}
          <ProductSection
            eyebrow="Artisanal Selection"
            title="Featured"
            products={featuredProducts}
            href="/products"
          />

          {/* Section 2 — the brand story, sitting between the curated
              products above and the category browser below. */}
          <AboutUs />

          {/* Section 3 — category browser. Fetched server-side above with the
              preview products inlined by the API, so the section needs no
              client-side request at all (server rendering = SEO). */}
          <Categories categories={categories} />

          {/* Section 4 — the products of the currently running campaign
              (GET /campaign/active), rendered by its own dedicated section:
              campaign banner, discount, live countdown + the priced grid.
              Hidden entirely when no campaign is live. */}
          {campaignProducts.length > 0 && (
            <CampaignSection campaign={activeCampaign} />
          )}

          {/* Section 5 — editorial journal teasers */}
          {/* <Journal /> */}
        </HomeContainer>
          <Services />
          <Footer />
      </HomeSection>

    </main>
  );
}
