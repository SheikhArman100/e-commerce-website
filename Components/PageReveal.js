"use client";
import {
  PageRevealAnimation,
  PageRevealStaggered,
} from "@/libs/animation/pagereveal.animation";
import { motion } from "framer-motion";

const PageReveal = ({ children }) => {
  return (
    <div className="w-full min-h-screen  relative flex flex-col bg-black ">
      <motion.div
        variants={PageRevealAnimation}
        initial="initial"
        animate="animate"
        className="w-full min-h-screen bg-bgColor origin-top"
      >
        <motion.div variants={PageRevealStaggered}>{children}</motion.div>
      </motion.div>
    </div>
  );
};

export default PageReveal;
