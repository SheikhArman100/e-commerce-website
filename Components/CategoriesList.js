import useCategories from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

const CategoriesList = ({ activeCategory, onCategoryChange }) => {
  const { data, isPending } = useCategories();

  if (isPending) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-accentColor" />
      </div>
    );
  }

  const allCategories = [{ id: 'all', name: 'All' }, ...(data?.data || [])];

  return (
    <div className="w-full flex flex-wrap justify-center gap-3 py-6">
      {allCategories.map((category) => {
        const isActive = activeCategory === category.id;
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
