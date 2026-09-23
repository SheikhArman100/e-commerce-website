/**
 * Category filter chips for the shop.
 *
 * Presentational: the page that renders this row fetches the categories from
 * the PUBLIC storefront feed (GET /category/public) and hands them down, so the
 * chips list ACTIVE categories in the admin's display order — an inactive
 * category can't be shopped, so it doesn't belong in the filter.
 */
const CategoriesList = ({
  categories = [],
  activeCategory,
  onCategoryChange,
}) => {

  const allCategories = [{ id: 'all', name: 'All' }, ...categories];

  return (
    <div className="w-full flex flex-wrap justify-center gap-3 py-6">
      {allCategories.map((category) => {
        // `activeCategory` comes from the URL (always a string) while real ids
        // are numbers, so compare as strings or the active chip never lights up.
        const isActive = String(activeCategory) === String(category.id);
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-6 py-2 rounded-full border transition-all duration-300 text-sm font-medium tracking-wide
              ${isActive 
                ? "bg-accentColor border-accentColor text-bgColor shadow-lg shadow-accentColor/20" 
                : "border-accentColor/30 text-accentColor/60 hover:border-accentColor hover:text-accentColor"
              }
            `}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoriesList;
