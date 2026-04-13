"use client"
import React, { useState } from 'react'
import { motion } from "framer-motion";
import { letterAnimation, letterAnimationTwo, titleAnimation } from '@/libs/animation/navbar.animation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';


const AnimatedLink = ({title,href}) => {
    const [isHovered, setHovered] = useState(false);
    const currentRoute = usePathname();

  return (
    <Link href={href} className={`${currentRoute===href?" text-accentColor border-b border-accentColor ":"text-textColor"} text-base font-bold`}>
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden cursor-pointer"
    >
      <AnimatedWord title={title} animation={letterAnimation} isHovered={isHovered} />
      <div className="absolute top-0">
        <AnimatedWord title={title} animation={letterAnimationTwo} isHovered={isHovered} className="text-accentColor2" />
      </div>
    </motion.div>
    </Link>
  )
}

const AnimatedWord = ({ title, animation,isHovered ,className}) => {
  return (
    <motion.span
      variants={titleAnimation}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      className="whitespace-nowrap relative"
    >
      {title
        .split("")
        .map((character, i) =>
          character === " " ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <AnimatedLetter key={i} character={character} animation={animation} className={className}/>
          )
        )}
    </motion.span>
  );
};



const AnimatedLetter = ({ character, animation,className }) => {
  return (
    <motion.span
      variants={animation}
      className={twMerge("relative inline-block whitespace-nowrap" ,className) }
    >
      {character}
    </motion.span>
  );
};



export default AnimatedLink