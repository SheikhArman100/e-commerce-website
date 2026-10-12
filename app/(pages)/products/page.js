import Shop from "./Shop";

/**
 * Static SEO for the shop route (the old "use client" page could export no
 * metadata at all, so this tab title used to fall back to "Create Next App").
 */
export const metadata = {
  title: "Shop All | Baking Tales",
  description:
    "Browse the full Baking Tales collection — handcrafted cakes, cupcakes, pastries and artisanal delicacies, filterable by category, flavour, size and price.",
  keywords: "bakery, cakes, cupcakes, shop, pastries, artisanal, ecommerce",
};

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// searchParams values can repeat (?a=1&a=2) — take the first, which is what
// the old useSearchParams().get() did.
const first = (value) => (Array.isArray(value) ? value[0] : value);

/**
 * Shop grid — GET /product/public (no auth): ACTIVE products, display-safe
 * fields, campaign-aware prices. Always `no-store`: campaign pricing and
 * stock change at any moment, so this fetch runs on every request.
 */
async function getProducts({ page, categorySlug, filters }) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (categorySlug && categorySlug !== "all") params.set("categorySlug", categorySlug);
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.inStock) params.set("inStock", String(filters.inStock));
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.flavorName) params.set("flavorName", filters.flavorName);
    if (filters.sizeName) params.set("sizeName", filters.sizeName);

    const res = await fetch(`${backendURL}/product/public?${params.toString()}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      return { data: [], meta: null, error: true };
    }
    return { data: json?.data ?? [], meta: json?.meta ?? null, error: false };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], meta: null, error: true };
  }
}

/**
 * Static-ish taxonomy (category chips + flavor/size filter pills) from the
 * public feeds, cached for 5 minutes — these feeds rarely change, so filter
 * navigations don't re-hit the API for them.
 */
async function getPublicList(path) {
  try {
    const res = await fetch(`${backendURL}/${path}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) return [];
    return json?.data ?? [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

/**
 * Server component: parses `searchParams` (the App Router replacement for the
 * `useSearchParams()` this file used to call) and fetches every feed the shop
 * renders, so the SSR HTML contains the heading, chips, filter pills and all
 * product links — the old client page deopted the whole route into client
 * rendering and shipped an empty document to crawlers. Only the interactive
 * shell (Shop.js) stays on the client.
 */
const ShopPage = async ({ searchParams }) => {
  const sp = searchParams ?? {};

  const activeCategorySlug = first(sp.category) || "all";
  const page = parseInt(first(sp.page)) || 1;
  const filters = {
    inStock: first(sp.inStock) ?? null,
    minPrice: first(sp.minPrice) ?? null,
    maxPrice: first(sp.maxPrice) ?? null,
    searchTerm: first(sp.search) || "",
    flavorName: first(sp.flavor) || "",
    sizeName: first(sp.size) || "",
  };

  const [productsResult, categories, flavors, sizes] = await Promise.all([
    getProducts({ page, categorySlug: activeCategorySlug, filters }),
    getPublicList("category/public?limit=0"),
    getPublicList("flavor/public?limit=0"),
    getPublicList("size/public?limit=0"),
  ]);

  return (
    <Shop
      filters={filters}
      activeCategorySlug={activeCategorySlug}
      page={page}
      products={productsResult.data}
      productsMeta={productsResult.meta}
      productsError={productsResult.error}
      categories={categories}
      flavors={flavors}
      sizes={sizes}
    />
  );
};

export default ShopPage;
