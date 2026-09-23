"use client";
import { Check, SlidersHorizontal, Star, X } from "lucide-react";
import { useEffect, useState } from 'react';

import PriceSlider from './PriceSlider';

// Slider bounds. The URL will always carry minPrice/maxPrice so the link
// is shareable end-to-end.
const SLIDER_MIN = 0;
const SLIDER_MAX = 500;

// `flavors` / `sizes` arrive server-side from the page as props (display-safe
// GET /flavor/public + GET /size/public), so this drawer needs no fetching.
const FilterMobile = ({ isOpen, onClose, filters, flavors = [], sizes = [], onFilterChange, onClearFilters }) => {

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

  // Keep the draft in sync with the parent (e.g. URL changes, etc.)
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        inStock: filters.inStock ?? null,
        minPrice: filters.minPrice != null ? Number(filters.minPrice) : SLIDER_MIN,
        maxPrice: filters.maxPrice != null ? Number(filters.maxPrice) : SLIDER_MAX,
        flavorName: filters.flavorName || '',
        sizeName: filters.sizeName || '',
      });
    }
  }, [filters.inStock, filters.minPrice, filters.maxPrice, filters.flavorName, filters.sizeName, isOpen]);

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bgColor/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-bgColor border-l border-accentColor/20 shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-accentColor/10 flex items-center justify-between bg-bgColor">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accentColor" />
            <span className="text-textColor text-sm uppercase tracking-widest font-bold">Refine Results</span>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-accentColor transition-colors text-textColor">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* Availability */}
          <div className="space-y-6">
            <h3 className="text-sm text-accentColor font-medium flex items-center gap-2">
              <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
              Product Status
            </h3>
            <div className="pl-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.inStock === 'true'}
                  onChange={handleInStockToggle}
                  className="w-5 h-5 rounded-sm border-accentColor/40 bg-transparent text-accentColor focus:ring-accentColor/20"
                />
                <span className="text-stone-500 text-base">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-6">
            <h3 className="text-sm text-accentColor font-medium flex items-center gap-2">
              <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
              Price Range
            </h3>
            <div className="pl-5 pr-2">
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

          {/* Flavor */}
          <div className="space-y-6">
            <h3 className="text-sm text-accentColor font-medium flex items-center gap-2">
              <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
              Flavor
            </h3>
            <div className="pl-5 flex flex-wrap gap-2">
              {flavors.map((flavor) => (
                <button
                  key={flavor.id}
                  onClick={() => handleSelectFilter('flavorName', flavor.name)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    localFilters.flavorName === flavor.name
                      ? 'bg-accentColor text-bgColor border-accentColor'
                      : 'bg-accentColor/5 text-stone-500 border-accentColor/20'
                  }`}
                >
                  {flavor.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-6">
            <h3 className="text-sm text-accentColor font-medium flex items-center gap-2">
              <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
              Size
            </h3>
            <div className="pl-5 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSelectFilter('sizeName', size.name)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    localFilters.sizeName === size.name
                      ? 'bg-accentColor text-bgColor border-accentColor'
                      : 'bg-accentColor/5 text-stone-500 border-accentColor/20'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions: only Apply + Clear All */}
        <div className="p-6 bg-bgColor/50 border-t border-accentColor/10 grid grid-cols-2 gap-4">
          <button 
            onClick={onClearFilters}
            className="h-12 border border-accentColor/30 text-accentColor/60 uppercase tracking-widest text-[0.7rem] font-bold hover:bg-accentColor/5 hover:text-accentColor transition-all"
          >
            Clear All
          </button>
          <button 
            onClick={handleApply}
            disabled={!hasChanges}
            className={`h-12 uppercase tracking-widest text-[0.7rem] font-bold transition-all font2 flex items-center justify-center gap-2 ${
              hasChanges
                ? 'bg-accentColor text-bgColor hover:shadow-lg hover:shadow-accentColor/20'
                : 'bg-accentColor/10 text-accentColor/40 cursor-not-allowed'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterMobile;
