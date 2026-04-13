"use client";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import CategoriesList from "@/Components/CategoriesList";
import Filter from "@/Components/Filter";
import FilterMobile from "@/Components/FilterMobile";
import Pagination from "@/Components/Pagination";
import useProducts from "@/hooks/useProducts.js";
import { Loader2, Plus, Search, SearchX, SlidersHorizontal, Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Shop = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Derived filters from URL
  const activeCategory = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page')) || 1;
  const filters = {
    inStock: searchParams.get('inStock'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    searchTerm: searchParams.get('search') || '',
    flavorName: searchParams.get('flavor') || '',
    sizeName: searchParams.get('size') || ''
  };

  // Local state for the search input to keep it responsive (debounced to URL)
  const [localSearch, setLocalSearch] = useState(filters.searchTerm);

  // Sync local search when URL changes (e.g. back button or clear filters)
  useEffect(() => {
    setLocalSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  const updateQueryString = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Debounced search term to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.searchTerm) {
        updateQueryString({ search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.searchTerm, updateQueryString]);

  const { data, isPending, error } = useProducts({
    page,
    limit: 12,
    categoryId: activeCategory,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    inStock: filters.inStock,
    searchTerm: filters.searchTerm,
    flavorName: filters.flavorName,
    sizeName: filters.sizeName
  });

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
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="relative w-full min-h-screen bg-bgColor text-textColor flex flex-col  pt-24 md:pt-36 lg:pt-40 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Cinematic Atmosphere */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentColor/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accentColor2/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

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
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      <div className="flex lg:hidden justify-between items-center py-6 mb-4 border-y border-accentColor/10 px-2 mt-4">
         <p className="text-stone-500 text-xs uppercase tracking-widest font-bold">
            {data?.meta?.count || 0} Delicacies Found
         </p>
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
          onFilterChange={handleFilterChange} 
          onClearFilters={clearAllFilters}
        />

        <FilterMobile 
          isOpen={isMobileFilterOpen} 
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
        />

        <div className="flex-1">
          {isPending ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="h-12 w-12 animate-spin text-accentColor" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-20">
              <p className="text-3xl text-textColor font2">Something went wrong while curating your library.</p>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-6 sm:gap-8 md:gap-12 w-full  place-items-center mx-auto ">
                {data.data.map((product, index) => {
                  const allFlavorImages = product.flavors?.flatMap(f => f.images) || [];
                  const flavorColors = [...new Set(product.flavors?.map(f => f.flavor?.color).filter(Boolean))];
                 
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
                           categoryImage={categoryImagePath ? `${fileBase}/${categoryImagePath}` : null}
                         />
                         <Card.FlavorColors colors={flavorColors} />
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
                totalPages={Math.ceil((data?.meta?.count || 0) / (data?.meta?.limit || 12)) || 1} 
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
