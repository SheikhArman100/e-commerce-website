import useFlavors from '@/hooks/useFlavors';
import useSizes from '@/hooks/useSizes';
import { SlidersHorizontal, Star, X } from "lucide-react";

import PriceSlider from './PriceSlider';

const FilterMobile = ({ isOpen, onClose, filters, onFilterChange, onClearFilters }) => {
  const { data: flavorsData } = useFlavors();
  const { data: sizesData } = useSizes();

  if (!isOpen) return null;

  const handleInStockToggle = () => {
    onFilterChange({ ...filters, inStock: filters.inStock === 'true' ? null : 'true' });
  };

  const handleSliderChange = ({ min, max }) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleSelectFilter = (field, value) => {
    onFilterChange({ ...filters, [field]: filters[field] === value ? '' : value });
  };

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
                  checked={filters.inStock === 'true'}
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
                min={0} 
                max={500} 
                value={{ min: Number(filters.minPrice) || 0, max: Number(filters.maxPrice) || 500 }}
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
              {flavorsData?.data?.map((flavor) => (
                <button
                  key={flavor.id}
                  onClick={() => handleSelectFilter('flavorName', flavor.name)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    filters.flavorName === flavor.name
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
              {sizesData?.data?.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSelectFilter('sizeName', size.name)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    filters.sizeName === size.name
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

        {/* Footer Actions */}
        <div className="p-6 bg-bgColor/50 border-t border-accentColor/10 grid grid-cols-2 gap-4">
          <button 
            onClick={onClearFilters}
            className="h-12 border border-accentColor/30 text-accentColor/60 uppercase tracking-widest text-[0.7rem] font-bold hover:bg-accentColor/5 transition-all"
          >
            Clear All
          </button>
          <button 
            onClick={onClose}
            className="h-12 bg-accentColor text-bgColor uppercase tracking-widest text-[0.7rem] font-bold hover:shadow-lg hover:shadow-accentColor/20 transition-all font2"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterMobile;
