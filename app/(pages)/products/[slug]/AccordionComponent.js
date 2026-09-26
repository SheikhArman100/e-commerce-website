"use client";
import React, { useState } from "react";
import { cn } from "@/libs/utils";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AccordionComponent = ({ items = [] }) => {
  const [openId, setOpenId] = useState(items[0]?.id || null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full divide-y divide-textColor/10 border-y border-textColor/10">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const Icon = item.icon;

        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left group py-1 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon className="w-4 h-4 text-accentColor stroke-[1.75]" />
                )}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-colors",
                    isOpen
                      ? "text-accentColor font-bold"
                      : "text-textColor/80 group-hover:text-accentColor"
                  )}
                >
                  {item.title}
                </span>
              </div>
              <div
                className={cn(
                  "p-1 rounded-full text-textColor/50 transition-transform duration-300",
                  isOpen ? "rotate-180 text-accentColor" : "group-hover:text-textColor"
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pb-2 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionComponent;
