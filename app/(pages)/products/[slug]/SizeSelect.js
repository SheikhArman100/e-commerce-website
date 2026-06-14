import { cn } from "@/libs/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const SizeSelect = ({ sizes }) => {
  const { control } = useFormContext();
  return (
    <div className="w-full">
      <div className="flex items-center gap-x-3 mb-6">
         <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500">Selection of Sizes</span>
         <div className="h-[1px] flex-1 bg-textColor/10" />
      </div>

      <Controller
        control={control}
        name="sizeId"
        render={({ field }) => (
          <div className="flex flex-wrap gap-4">
            {sizes.map((s, index) => {
              const item = s.size;
              const isSelected = field.value === item.id.toString();
              const isOutOfStock = s.stock === 0;

              return (
                <div key={index} className="relative group">
                  <input
                    type="radio"
                    name="sizeId"
                    value={item.id.toString()}
                    id={`size-${item.id}`}
                    className="peer hidden"
                    onChange={(e) => field.onChange(e.target.value)}
                    checked={isSelected}
                    disabled={isOutOfStock}
                  />

                  <label
                    htmlFor={`size-${item.id}`}
                    className={cn(
                      "flex items-center justify-center px-8 py-3 rounded-md border text-[0.65rem] font-bold uppercase tracking-[0.2em] cursor-pointer transition-all duration-500",
                      isSelected 
                        ? "bg-accentColor text-bgColor border-accentColor shadow-[0_0_20px_rgba(155,34,66,0.3)]" 
                        : "bg-transparent text-stone-500 border-textColor/10 hover:border-accentColor/30 hover:text-accentColor",
                      isOutOfStock && "opacity-20 cursor-not-allowed grayscale pointer-events-none"
                    )}
                  >
                    {item.name}
                  </label>
                  
                  {isOutOfStock && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-full h-[1px] bg-red-500/40 rotate-12" />
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default SizeSelect;