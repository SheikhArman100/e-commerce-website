"use client";
import { cn } from "@/libs/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const SizeSelect = ({ sizes = [] }) => {
  const { control } = useFormContext();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-stone-500">
          Portion & Size:
        </span>
        <span className="text-[0.65rem] text-textColor/40 uppercase tracking-widest">
          {sizes.length} {sizes.length === 1 ? "Option" : "Options"}
        </span>
      </div>

      <Controller
        control={control}
        name="sizeId"
        render={({ field }) => (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sizes.map((s, index) => {
              const item = s.size;
              if (!item) return null;
              const isSelected = field.value === item.id.toString();
              const isOutOfStock = s.stock === 0;

              // Rounded for display — the API's exact campaign price can be a
              // fraction, but the storefront quotes whole taka.
              const originalPrice = Math.round(
                Number(s.originalPrice ?? s.price ?? 0)
              );
              const salesPrice = Math.round(
                Number(s.salesPrice ?? originalPrice)
              );
              const hasDiscount = salesPrice < originalPrice;

              return (
                <button
                  key={item.id ?? index}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => field.onChange(item.id.toString())}
                  className={cn(
                    "relative flex flex-col items-start p-3 sm:p-3.5 rounded-md border text-left transition-all duration-200",
                    isSelected
                      ? "bg-accentColor text-bgColor border-accentColor shadow-md"
                      : "bg-white/70 text-textColor border-textColor/10 hover:border-accentColor/40 hover:bg-white",
                    isOutOfStock &&
                      "opacity-40 cursor-not-allowed bg-stone-100 hover:border-textColor/10 hover:bg-stone-100"
                  )}
                >
                  <div className="w-full flex items-center justify-between gap-1 mb-1">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-bold tracking-tight",
                        isSelected ? "text-bgColor" : "text-textColor"
                      )}
                    >
                      {item.name}
                    </span>
                    {isOutOfStock && (
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        Sold out
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isSelected ? "text-bgColor/90" : "text-accentColor"
                      )}
                    >
                      ৳{salesPrice}
                    </span>
                    {hasDiscount && (
                      <span
                        className={cn(
                          "text-[10px] line-through",
                          isSelected ? "text-bgColor/60" : "text-stone-400"
                        )}
                      >
                        ৳{originalPrice}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default SizeSelect;
