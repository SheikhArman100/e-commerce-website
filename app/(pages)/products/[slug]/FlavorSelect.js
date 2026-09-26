"use client";
import { cn } from "@/libs/utils";
import { Controller, useFormContext } from "react-hook-form";
import { Check } from "lucide-react";

const FlavorSelect = ({ flavors = [], onChange, selectedIndex = 0 }) => {
  const { control } = useFormContext();
  const currentFlavor = flavors[selectedIndex]?.flavor;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-stone-500">
            Flavor:
          </span>
          <span className="text-xs sm:text-sm font-bold text-accentColor font2">
            {currentFlavor?.name || "Original"}
          </span>
        </div>
        <span className="text-[0.65rem] text-textColor/40 uppercase tracking-widest">
          {flavors.length} {flavors.length === 1 ? "Option" : "Options"}
        </span>
      </div>

      <Controller
        control={control}
        name="flavorId"
        render={({ field }) => (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {flavors.map((f, index) => {
              const item = f.flavor;
              if (!item) return null;
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={item.id ?? index}
                  type="button"
                  onClick={() => {
                    field.onChange(item.id.toString());
                    onChange(index);
                  }}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-3 py-2 rounded-full border transition-all duration-300 text-left",
                    isSelected
                      ? "bg-white border-accentColor/60 shadow-sm ring-1 ring-accentColor/40"
                      : "bg-white/50 border-textColor/10 hover:border-accentColor/30 hover:bg-white"
                  )}
                >
                  {/* Swatch Circle */}
                  <span
                    className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: item.color || "#8B5A2B" }}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] stroke-[3]" />
                    )}
                  </span>

                  {/* Flavor Name */}
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wide transition-colors",
                      isSelected
                        ? "text-accentColor font-bold"
                        : "text-textColor/75 group-hover:text-textColor"
                    )}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default FlavorSelect;
