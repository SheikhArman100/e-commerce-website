"use client";

import {
  revealParagraphAnimation,
  revealParagraphContainer,
} from "@/libs/animation/pagereveal.animation";
import { motion } from "framer-motion";

const RevealParagraph = ({ phrases, containerStyle, phraseStyle }) => {
  return (
    <motion.div
      variants={revealParagraphContainer}
      className={` max-w-[40rem] flex flex-col ${containerStyle}}`}
    >
      {phrases.map((phrase, index) => {
        return (
          <div
            key={index}
            className="relative flex flex-wrap justify-center gap-x-1"
          >
            {phrase.split(" ").map((letter, i) => {
              return (
                <span key={i} className="overflow-hidden  ">
                  <motion.h2
                    className={`${phraseStyle}`}
                    variants={revealParagraphAnimation}
                  >
                    {letter}
                  </motion.h2>
                </span>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
};

export default RevealParagraph;
