"use client"
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingBar } from "@/libs/animation/loader.js";

const Loader = ({setIsLoading}) => {
  const [counter, setCounter] = useState(0);

  //counter value change
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) =>
        prevCounter < 100 ? prevCounter + 1 : prevCounter
      );
    }, 20);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black ">
      {/* couter */}
      <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold absolute top-[45%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        {counter}%
      </p>

      {/* LoadingBar */}
      <motion.div
        variants={LoadingBar}
        initial="initial"
        animate="animate"
        className="h-full w-full bg-bgColor"
        onAnimationComplete={() =>setIsLoading(false) }
      />
    </div>
  );
};

export default Loader;
