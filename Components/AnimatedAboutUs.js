"use client"
import React, { useRef } from "react";
import { easeInOut, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { letterAnimation } from "@/libs/animation/aboutus.animation";


const AnimatedAboutUs = ({paragraph,className}) => {
 
  return (
      <motion.h1
      className="relative flex flex-wrap  "
     
    >
      {[...paragraph].map((letter, index) => (
        <motion.p
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={className}
          variants={letterAnimation}
          initial="initial"
          whileInView="whileInView"
          viewport={{
            once:true
          }}
          custom={index}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.p>
      ))}
    </motion.h1>
  );
};

export default AnimatedAboutUs;


