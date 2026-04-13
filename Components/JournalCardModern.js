"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const JournalCardModern = ({ image, title, date }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="flex flex-col gap-4 group cursor-pointer"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white border border-textColor/10 shadow-lg shadow-black/5">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="px-2">
        {date && (
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ruby font-bold mb-2 group-hover:text-chocolate transition-colors">
            {date}
          </p>
        )}
        <h3 className="text-xl font-bold leading-tight text-textColor group-hover:text-ruby transition-colors">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export default JournalCardModern;
