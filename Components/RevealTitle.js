"use client";
import {
  revealContainer,
  revealTitleAnimation,
} from "@/libs/animation/pagereveal.animation";

import { motion } from "framer-motion";

const RevealTitle = ({ phrases, containerStyle, phraseStyle }) => {
  return (
    <motion.div className={containerStyle} variants={revealContainer}>
      {phrases.map((phrase, index) => {
        return (
          <div key={index} className="overflow-hidden">
            <motion.h2
              className={`m-0 ${phraseStyle}`}
              variants={revealTitleAnimation}
            >
              {phrase}
            </motion.h2>
          </div>
        );
      })}
    </motion.div>
  );
};

export default RevealTitle;
