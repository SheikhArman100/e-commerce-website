"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Minus, Plus } from "lucide-react";

const Quantity = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-stone-500">
        Quantity
      </span>
      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <div className="inline-flex items-center justify-between bg-white/80 border border-textColor/15 rounded-md p-1 h-14 w-[140px] shadow-sm">
            <button
              type="button"
              className="w-10 h-full flex items-center justify-center text-textColor/60 hover:text-accentColor hover:bg-accentColor/5 transition-colors rounded disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => field.onChange(Math.max(1, field.value - 1))}
              disabled={field.value <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>

            <span className="flex-1 text-center text-base font-bold text-textColor font2 tabular-nums">
              {field.value}
            </span>

            <button
              type="button"
              className="w-10 h-full flex items-center justify-center text-textColor/60 hover:text-accentColor hover:bg-accentColor/5 transition-colors rounded disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => field.onChange(Math.min(10, field.value + 1))}
              disabled={field.value >= 10}
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default Quantity;
