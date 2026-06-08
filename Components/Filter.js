"use client";
import useFlavors from "@/hooks/useFlavors";
import useSizes from "@/hooks/useSizes";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import PriceSlider from "./PriceSlider";

// Slider bounds. The URL will always carry minPrice/maxPrice so the link
// is shareable end-to-end.
const SLIDER_MIN = 0;
const SLIDER_MAX = 500;

const Filter = ({ filters, onFilterChange, onClearFilters }) => {
  const { data: flavorsData } = useFlavors();
  const { data: sizesData } = useSizes();

  // Local draft state — only pushed to the parent when the user clicks "Apply"
  // We always keep numeric minPrice/maxPrice (never collapse to null) so the
  // URL contains a complete, shareable record of the user's selection.
  const [localFilters, setLocalFilters] = useState(() => ({
    inStock: filters.inStock ?? null,
    minPrice: filters.minPrice != null ? Number(filters.minPrice) : SLIDER_MIN,
    maxPrice: filters.maxPrice != null ? Number(filters.maxPrice) : SLIDER_MAX,
    flavorName: filters.flavorName || '',
    sizeName: filters.sizeName || '',
  }));

  // Keep the draft in sync with the parent (e.g. URL back/forward, etc.)
  useEffect(() => {
    setLocalFilters({
      inStock: filters.inStock ?? null,
      minPrice: filters.minPrice != null ? Number(filters.minPrice) : SLIDER_MIN,
      maxPrice: filters.maxPrice != null ? Number(filters.maxPrice) : SLIDER_MAX,
      flavorName: filters.flavorName || '',
      sizeName: filters.sizeName || '',
    });
  }, [filters.inStock, filters.minPrice, filters.maxPrice, filters.flavorName, filters.sizeName]);

  // Detect if the draft differs from the currently applied filters
  const hasChanges =
    (localFilters.inStock ?? null) !== (filters.inStock ?? null) ||
    Number(localFilters.minPrice) !== (filters.minPrice != null ? Number(filters.minPrice) : SLIDER_MIN) ||
    Number(localFilters.maxPrice) !== (filters.maxPrice != null ? Number(filters.maxPrice) : SLIDER_MAX) ||
    (localFilters.flavorName || '') !== (filters.flavorName || '') ||
    (localFilters.sizeName || '') !== (filters.sizeName || '');

  const handleInStockToggle = () => {
    setLocalFilters((prev) => ({
      ...prev,
      inStock: prev.inStock === 'true' ? null : 'true',
    }));
  };

  const handleSliderChange = ({ min, max }) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  const handleSelectFilter = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value ? '' : value,
    }));
  };

  const handleApply = () => {
    onFilterChange({
      inStock: localFilters.inStock,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
      flavorName: localFilters.flavorName,
      sizeName: localFilters.sizeName,
    });
  };

  return (
    <div className='hidden lg:flex flex-col gap-y-10 w-64 pr-12 text-sm'>
      {/* Availability Section */}
      <div className="space-y-6">
        <h3 className="text-textColor text-xs uppercase tracking-[0.3em] font-bold border-b border-accentColor/20 pb-4">
          Status
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={localFilters.inStock === 'true'}
            onChange={handleInStockToggle}
            className="w-4 h-4 rounded-sm border-accentColor/40 bg-transparent text-accentColor focus:ring-accentColor/20"
          />
          <span className="text-stone-500 group-hover:text-accentColor transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Price Section */}
      <div className="space-y-6">
        <h3 className="text-textColor text-xs uppercase tracking-[0.3em] font-bold border-b border-accentColor/20 pb-4">
          Price Range
        </h3>
        <div className="px-2">
          <PriceSlider 
            min={SLIDER_MIN} 
            max={SLIDER_MAX}
            value={{
              min: localFilters.minPrice,
              max: localFilters.maxPrice,
            }}
            onChange={handleSliderChange}
          />
        </div>
      </div>

      {/* Flavor Section */}
      <div className="space-y-6">
        <h3 className="text-textColor text-xs uppercase tracking-[0.3em] font-bold border-b border-accentColor/20 pb-4">
          Flavor
        </h3>
        <div className="flex flex-wrap gap-2">
          {flavorsData?.data?.map((flavor) => (
            <button
              key={flavor.id}
              onClick={() => handleSelectFilter('flavorName', flavor.name)}
              className={`px-3 py-1.5 rounded-full border text-[0.65rem] uppercase tracking-wider transition-all ${
                localFilters.flavorName === flavor.name
                  ? 'bg-accentColor text-bgColor border-accentColor'
                  : 'bg-accentColor/5 text-stone-500 border-accentColor/20 hover:border-accentColor/50'
              }`}
            >
              {flavor.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Section */}
      <div className="space-y-6">
        <h3 className="text-textColor text-xs uppercase tracking-[0.3em] font-bold border-b border-accentColor/20 pb-4">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizesData?.data?.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSelectFilter('sizeName', size.name)}
              className={`px-3 py-1.5 rounded-full border text-[0.65rem] uppercase tracking-wider transition-all ${
                localFilters.sizeName === size.name
                  ? 'bg-accentColor text-bgColor border-accentColor'
                  : 'bg-accentColor/5 text-stone-500 border-accentColor/20 hover:border-accentColor/50'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Action Buttons: only Apply + Clear All */}
      <div className="flex flex-col gap-4 pt-4 border-t border-accentColor/10">
        <button 
          onClick={handleApply}
          disabled={!hasChanges}
          className={`h-11 w-full px-4 flex items-center justify-center gap-2 uppercase tracking-widest text-[0.7rem] font-bold transition-all font2 ${
            hasChanges
              ? 'bg-accentColor text-bgColor hover:shadow-lg hover:shadow-accentColor/20'
              : 'bg-accentColor/10 text-accentColor/40 cursor-not-allowed'
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          Apply Filters
        </button>
        <button 
          onClick={onClearFilters}
          className="h-11 px-4 border border-accentColor/30 text-accentColor/60 uppercase tracking-widest text-[0.7rem] font-bold hover:bg-accentColor/5 hover:text-accentColor transition-all self-stretch"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
