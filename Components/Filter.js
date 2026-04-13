import useFlavors from "@/hooks/useFlavors";
import useSizes from "@/hooks/useSizes";
import PriceSlider from "./PriceSlider";

const Filter = ({ filters, onFilterChange, onClearFilters }) => {
  const { data: flavorsData } = useFlavors();
  const { data: sizesData } = useSizes();

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
    <div className='hidden lg:flex flex-col gap-y-10 w-64 pr-12 text-sm'>
      {/* Availability Section */}
      <div className="space-y-6">
        <h3 className="text-textColor text-xs uppercase tracking-[0.3em] font-bold border-b border-accentColor/20 pb-4">
          Status
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
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
            min={0} 
            max={500} // Sensible default for bakery items
            value={{ min: Number(filters.minPrice) || 0, max: Number(filters.maxPrice) || 500 }}
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
                filters.flavorName === flavor.name
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
                filters.sizeName === size.name
                  ? 'bg-accentColor text-bgColor border-accentColor'
                  : 'bg-accentColor/5 text-stone-500 border-accentColor/20 hover:border-accentColor/50'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Reset Action */}
      <button 
        onClick={onClearFilters}
        className="text-[0.65rem] uppercase tracking-widest text-accentColor/40 hover:text-accentColor transition-colors self-start border-b border-accentColor/20 hover:border-accentColor"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default Filter;
