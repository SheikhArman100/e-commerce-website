"use client";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Minus, Plus } from "lucide-react"; // Assuming lucide-react for icons

const Quantity = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-y-4">
      <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500">Amount</span>
      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <div className="inline-flex items-center bg-textColor/5 border border-textColor/10 rounded-full p-1 h-14 w-[160px]">
            <button
              type="button"
              className="w-12 h-full flex items-center justify-center text-stone-500 hover:text-accentColor transition-colors duration-300"
              onClick={() => field.onChange(Math.max(1, field.value - 1))}
              disabled={field.value <= 1}
            >
              <Minus size={14} />
            </button>

            <span className="flex-1 text-center text-base font-black text-textColor tabular-nums">
              {field.value}
            </span>

            <button
              type="button"
              className="w-12 h-full flex items-center justify-center text-stone-500 hover:text-accentColor transition-colors duration-300"
              onClick={() => field.onChange(Math.min(10, field.value + 1))}
              disabled={field.value >= 10}
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default Quantity;
