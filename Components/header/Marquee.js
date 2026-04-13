"use client"
import { motion } from "framer-motion";
import {marqueeAD, marqueeContainer, marqueeText} from "@/libs/animation/marquee.js"
import { Star } from "lucide-react";
import React from 'react'

const Marquee = () => {
  return (
    <motion.section variants={marqueeContainer} initial="initial" animate="animate" className="origin-left h-8 bg-accentColor2 overflow-hidden uppercase flex items-center">
      <motion.div variants={marqueeAD} initial="initial" animate="animate" className="flex items-center w-fit flex-auto">
        {[...Array(20).keys()].map((i) => (
          <motion.div variants={marqueeText}  animate="animate" key={i} className="flex items-center gap-x-2 flex-shrink-0 px-2 lg:px-4">
            <p className="text-[0.65rem] font-black tracking-widest text-accentColor">10% Off Your First Order</p>
            <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default Marquee