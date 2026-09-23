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

export const metadata = {
  title: "Baking Tales | Delicious Handcrafted Cakes & Cupcakes",
  description: "Experience the finest handcrafted cakes, cupcakes, and baked goods at Baking Tales. Freshly made with love and delivered to your doorstep.",
  keywords: "bakery, cakes, cupcakes, home made, dessert, ecommerce",
};

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Public feed of products flagged `isFeatured` (and still active).
 * GET /product/featured reuses the /product payload, so every size already
 * carries campaign-aware `originalPrice` / `salesPrice`.
 */
async function getFeaturedProducts() {
  try {
    const response = await fetch(`${backendURL}/product/featured?limit=6`, { cache: 'no-store' });
    const data = await response.json();
    // The backend's sendResponse wrapper: { success, statusCode, message, meta, data }
    return data?.data ?? [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetches the single currently-running campaign (isActive=true AND inside its
 * date window) along with its products already hydrated and priced.
 *
 * Returns the campaign object or `null` if there is no active campaign right now.
 */
async function getActiveCampaign() {
  try {
    const response = await fetch(`${backendURL}/campaign/active`, { cache: 'no-store' });
    const data = await response.json();
    // The backend's sendResponse wrapper: { success, statusCode, message, data }
    return data?.data ?? null;
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return null;
  }
}

/**
 * Public storefront category feed — GET /category/public (no auth).
 *
 * Locked server-side to ACTIVE categories in the admin's display order, and
 * every category arrives with ONE `previewProduct` (flavors, images and
 * campaign-aware prices already applied). That makes this the section's only
 * request: the names, the active-product counts and the default preview card
 * all render inside the HTML for crawlers, and switching category later costs
 * no network round trip.
 *
 * The payload is also display-safe: no audit columns and no creator/updater
 * user rows inside this page's HTML.
 */
async function getPublicCategories() {
  try {
    const response = await fetch(`${backendURL}/category/public?limit=3`, { cache: 'no-store' });
    const data = await response.json();
    // The backend's sendResponse wrapper: { success, statusCode, message, meta, data }
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

  return (
    <main className="">
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
