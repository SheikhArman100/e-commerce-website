import { cn } from "@/libs/utils";
import { Controller, useFormContext } from "react-hook-form";

const FlavorSelect = ({ flavors, onChange, selectedIndex }) => {
  const { control } = useFormContext();
  return (
    <div className="w-full">
      <div className="flex items-center gap-x-3 mb-6">
         <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500">Selection of Flavors</span>
         <div className="h-[1px] flex-1 bg-textColor/10" />
      </div>

      <Controller
        control={control}
        name="flavor"
        render={({ field }) => (
          <div className="flex flex-wrap items-center gap-8">
            {flavors.map((f, index) => {
              const item = f.flavor;
              const isSelected = selectedIndex === index;
              return (
                <div key={index} className="group relative flex items-center gap-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="flavorId"
                    value={item.id.toString()}
                    id={`flavor-${item.id}`}
                    className="peer hidden"
                    onChange={() => {
                      field.onChange(item.id.toString());
                      onChange(index);
                    }}
                    checked={isSelected}
                  />

                  {/* Artisanal Token Swatch */}
                  <label
                    htmlFor={`flavor-${item.id}`}
                    style={{ backgroundColor: item.color || '#000' }}
                    className={cn(
                      "block h-7 w-7 rounded-full cursor-pointer transition-all duration-500 border border-textColor/20 relative shadow-lg",
                      isSelected ? "scale-125 ring-[1px] ring-accentColor ring-offset-[3px] ring-offset-bgColor" : "hover:scale-110 opacity-60 hover:opacity-100"
                    )}
                  >
                    {isSelected && (
                       <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-[1px]" />
                    )}
                  </label>

                  <label
                    htmlFor={`flavor-${item.id}`}
                    className={cn(
                      "text-[0.65rem] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer",
                      isSelected ? "text-accentColor" : "text-stone-500 group-hover:text-stone-600"
                    )}
                  >
                    {item.name}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default FlavorSelect;
