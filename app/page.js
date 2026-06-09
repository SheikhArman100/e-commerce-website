import Categories from "@/app/components/Categories";
import Header from "@/Components/header/Header.js";
import AboutUs from "./components/AboutUs";
import FeaturedItem from "./components/FeaturedItem";
import Footer from "./components/Footer.js";
import HomeContainer from "./components/HomeContainer";
import HomeSection from "./components/HomeSection.js";
import Journal from "./components/Journal";
import Services from "./components/Services";

export const metadata = {
  title: "Baking Tales | Delicious Handcrafted Cakes & Cupcakes",
  description: "Experience the finest handcrafted cakes, cupcakes, and baked goods at Baking Tales. Freshly made with love and delivered to your doorstep.",
  keywords: "bakery, cakes, cupcakes, home made, dessert, ecommerce",
};

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getAllProducts() {
  try {
    const response = await fetch(`${backendURL}/product`, { cache: 'no-store' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return { data: [] };
  }
}

async function getFeaturedProducts() {
  try {
    const response = await fetch(`${backendURL}/product?limit=6`, { cache: 'no-store' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return { data: [] };
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
    const response = await fetch(`${backendURL}/campaigns/active`, { cache: 'no-store' });
    const data = await response.json();
    // The backend's sendResponse wrapper: { success, statusCode, message, data }
    return data?.data ?? null;
  } catch (error) {
    console.error("Error fetching active campaign:", error);
    return null;
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${backendURL}/category?limit=3`, { cache: 'no-store' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] };
  }
}

export default async function Home() {
  const [featuredData, categoriesData, activeCampaign] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getActiveCampaign(),
  ]);

  // The /campaigns/active response already includes the products array
  // with campaign pricing applied, so no second round-trip is needed.
  const campaignProducts = activeCampaign?.products ?? [];
  const featuredProducts = featuredData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <main className="">
      <HomeSection>
        <Header />
        <HomeContainer>
          <FeaturedItem
            products={featuredProducts}
            campaign={activeCampaign}
            campaignProducts={campaignProducts}
          />
          <AboutUs />
          <Categories categories={categories} />
          <Journal />
        </HomeContainer>
          <Services />
          <Footer />
      </HomeSection>

    </main>
  );
}
