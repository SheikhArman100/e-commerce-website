"use client"
import React from "react";
import { motion } from "framer-motion";
import { menuBorder, navbarItem } from "@/libs/animation/navbar.animation.js";
import { Menu, X } from "lucide-react";

const IconCircleBorder = ({ children }) => {
  return (
    <div className="relative  ">
      {/* //circle */}
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%]">
        <svg width="60" height="60" viewBox="0 0 80 80" className="">
          <motion.circle
            cx="40"
            cy="40"
            r="28"
            fill="transparent"
            stroke="white"
            strokeWidth="2"
            variants={menuBorder}
            initial="initial"
            whileHover="hover"
          >
            <motion.path
              d="M36 26.5 L46.5 36 L53 29.5 L40 16.5 L27 29.5 L33.5 36 Z"
              fill="#FF0000"
            />
          </motion.circle>
        </svg>
      </div>

      {children}
    </div>
  );
};

export default IconCircleBorder;
