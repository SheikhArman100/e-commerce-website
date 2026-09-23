"use client";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import CategoriesList from "@/Components/CategoriesList";
import Filter from "@/Components/Filter";
import FilterMobile from "@/Components/FilterMobile";
import Pagination from "@/Components/Pagination";
import { ProductGridSkeleton, Skeleton } from "@/Components/Skeleton";
import { Search, SearchX, SlidersHorizontal, Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

/**
 * The interactive half of the shop page. All data is fetched server-side (see
 * ../page.js): `searchParams` are parsed there and handed down as props, so
 * this file never calls `useSearchParams()` — which would deopt the entire
 * route into client-side rendering and empty the SSR HTML crawlers see.
 *
 * Filter changes still go through the URL: `router.push` re-runs the server
 * page with the new searchParams and this shell re-renders with fresh props.
 * `useTransition` marks that round trip as pending, so the grid skeleton (and
 * the mobile result-count pill) show while the new page streams in.
 */
const Shop = ({
  filters,
  activeCategory,
  page,
  products = [],
  productsMeta = null,
  productsError = false,
  categories = [],
  flavors = [],
  sizes = [],
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, startTransition] = useTransition();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pending = a filter/search/pagination navigation in flight. First paint
  // already contains the server-fetched data, so nothing pends there.
  const isPending = isNavigating;
  const error = productsError;

  // Local state for the search input to keep it responsive (debounced to URL)
  const [localSearch, setLocalSearch] = useState(filters.searchTerm);

  // Sync local search when URL changes (e.g. back button or clear filters)
  useEffect(() => {
    setLocalSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  const updateQueryString = useCallback(
    (updates) => {
      // Without `useSearchParams()` (it would deopt this route into client
      // rendering), the current URL state is rebuilt from the filters the
      // server parsed — the shop's query keys are a closed set — then merged
      // with this change. Empty values are stripped; 0, false and 'all' are
      // kept so every selected filter stays shareable in the URL.
      const current = {
        category: activeCategory,
        page,
        inStock: filters.inStock,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: filters.searchTerm,
        flavor: filters.flavorName,
        size: filters.sizeName,
        ...updates,
      };

      const params = new URLSearchParams();
      Object.entries(current).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        params.set(key, String(value));
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [activeCategory, page, filters, pathname, router, startTransition]
  );

  // Debounced search term to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.searchTerm) {
        updateQueryString({ search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.searchTerm, updateQueryString]);

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  const handleCategoryChange = (newCategory) => {
    updateQueryString({ category: newCategory, page: 1 });
  };

  const handleFilterChange = (newFilters) => {
    const updates = {
      inStock: newFilters.inStock,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      flavor: newFilters.flavorName,
      size: newFilters.sizeName,
      search: newFilters.searchTerm,
      page: 1
    };
    updateQueryString(updates);
  };

  const handleSearchChange = (value) => {
    setLocalSearch(value);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  return (
    <div className="relative w-full min-h-screen bg-bgColor text-textColor flex flex-col  pt-24 md:pt-36 lg:pt-40 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Cinematic Atmosphere */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-accentColor/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[600px] h-[600px] bg-accentColor2/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      {/* Boutique Header Section */}
      <div className="relative z-10 flex flex-col items-center mb-12">
        <div className="inline-flex items-center gap-x-2 px-4 py-1.5 rounded-full border border-accentColor/30 mb-8 backdrop-blur-sm">
          <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
          <span className="text-accentColor text-[0.7rem] uppercase tracking-[0.3em] font-bold">Boutique Library</span>
          <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-7xl text-textColor font2 text-center tracking-tight mb-8">
          Shop All
        </h2>

        {/* Global Search Bar */}
        <div className="w-full max-w-lg relative group mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accentColor/40 group-focus-within:text-accentColor transition-colors" />
          <input
            type="text"
            placeholder="Search our artisanal collection..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-accentColor/5 border border-accentColor/20 rounded-full py-4 pl-12 pr-6 text-sm text-textColor placeholder:text-stone-500 focus:border-accentColor/50 focus:ring-4 focus:ring-accentColor/5 transition-all outline-none backdrop-blur-md"
          />
        </div>
        
        <p className="text-stone-500 text-center max-w-2xl font-light text-lg italic leading-relaxed">
          Our curated collection of artisanal delicacies and handcrafted treasures, meticulously designed to add a touch of magic to your everyday rituals.
        </p>
      </div>

      <CategoriesList 
        categories={categories}
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      <div className="flex lg:hidden justify-between items-center py-6 mb-4 border-y border-accentColor/10 px-2 mt-4">
         {isPending ? (
           <Skeleton className="h-3 w-28 rounded-full" />
         ) : (
           <p className="text-stone-500 text-xs uppercase tracking-widest font-bold">
            {productsMeta?.count || 0} Delicacies Found
           </p>
         )}
         <button 
           onClick={() => setIsMobileFilterOpen(true)}
           className="flex items-center gap-2 text-accentColor text-xs uppercase tracking-widest font-bold border border-accentColor/30 px-4 py-2 rounded-sm"
         >
           <SlidersHorizontal className="h-3.5 w-3.5" />
           Refine
         </button>
      </div>

      <div className="flex flex-col md:flex-row gap-x-12 mt-8">
        <Filter 
          filters={filters} 
          flavors={flavors}
          sizes={sizes}
          onFilterChange={handleFilterChange} 
          onClearFilters={clearAllFilters}
        />

        <FilterMobile 
          isOpen={isMobileFilterOpen} 
          onClose={() => setIsMobileFilterOpen(false)} 
          filters={filters}
          flavors={flavors}
          sizes={sizes}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
        />

        <div className="flex-1">
          {isPending ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <div className="flex items-center justify-center p-20">
              <p className="text-3xl text-textColor font2">Something went wrong while curating your library.</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4 opacity-40">
              <SearchX className="h-20 w-20 stroke-[1px]" />
              <p className="text-xl font-light italic">No delicacies found in this collection.</p>
              <button 
                onClick={clearAllFilters}
                className="text-xs uppercase tracking-widest underline decoration-accentColor/40 hover:text-accentColor"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-6 sm:gap-8 md:gap-12 w-full max-w-6xl  place-items-center mx-auto  ">
                {products.map((product, index) => {
                  const allFlavorImages = product.flavors?.flatMap(f => f.images) || [];
                  const flavorEntries = [
                    ...new Map(
                      (product.flavors || [])
                        .map((f) => [f.flavor?.color, f.flavor?.name])
                        .filter(([color]) => Boolean(color))
                    ).entries(),
                  ].map(([color, name]) => ({ color, name }));
                 
                   const mainImagePath =allFlavorImages[0]?.path;
                   const allPrices = product.flavors?.flatMap(f => f.sizes?.map(s => ({
                     original: s.originalPrice,
                     sales: s.salesPrice,
                     discount: s.discountPercentage
                   }))).filter(p => p.original !== undefined) || [];
                   
                   const minPriceVariant = allPrices.reduce((min, curr) => 
                     (curr.sales < min.sales) ? curr : min, 
                     allPrices[0] || { original: "0", sales: "0", discount: 0 }
                   );
                   
                   const hasDiscount = minPriceVariant.discount > 0;
                   const categoryImagePath = product.category?.image?.path;

                   return (
                     <Card key={index} className="">
                       {hasDiscount && (
                         <Card.Badge>
                           {minPriceVariant.discount}% OFF
                         </Card.Badge>
                       )}
                       <Card.CardContainer>
                         <Card.CategoryIcon
                           category={product.category?.name?.toLowerCase()}
                          categoryLabel={product.category?.name}
                           categoryImage={categoryImagePath ? `${fileBase}/${categoryImagePath}` : null}
                         />
                         <Card.FlavorColors colors={flavorEntries} />
                         <Card.BgRemoveImage
                           bgRemoveImage={mainImagePath ? `${fileBase}/${mainImagePath}` : null}
                         />
                         <Card.CardInfo
                           title={product.title}
                           price={minPriceVariant.original}
                           salesPrice={hasDiscount ? minPriceVariant.sales : null}
                           discountPercentage={minPriceVariant.discount}
                           href={`/products/${product.slug}`}
                         />
                       </Card.CardContainer>
                     </Card>
                  );
                })}
              </div>

              <Pagination 
                currentPage={page} 
                totalPages={Math.ceil((productsMeta?.count || 0) / (productsMeta?.limit || 12)) || 1} 
                onPageChange={(newPage) => updateQueryString({ page: newPage })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
