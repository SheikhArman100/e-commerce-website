"use client"
import { motion } from "framer-motion";
import {marqueeAD, marqueeContainer} from "@/libs/animation/marquee.js"
import { Star } from "lucide-react";
import React from 'react'

// Time it takes the belt to travel one message-width (seconds) — lower value =
// faster scroll. Kept constant no matter how many messages there are, so the
// belt never speeds up or slows down when coupons are added/removed.
const SECONDS_PER_MESSAGE = 2.5;

/**
 * The coupon strings are fetched on the server (see Header.js) and handed down
 * as props, so the belt is already populated in the first paint — there is no
 * empty frame, and this component never renders before the data exists.
 */
const Marquee = ({ messages = [] }) => {
  // No featured coupons — render nothing at all
  if (!messages.length) return null;

  // Seamless belt: repeat the message set an EVEN number of times and slide
  // the whole row from 0% to -50% (exactly half the belt = whole sets), so
  // the loop point looks identical to the start.
  //
  // NOTE: the previous version animated every item by -100% of its OWN width,
  // which only worked when all items had the same text (equal widths). With
  // different-length coupon messages the longer items slid faster and covered
  // the shorter ones, so only one message appeared on screen.
  const setRepeats = Math.max(2, Math.ceil(10 / messages.length) * 2);
  const beltItems = Array.from(
    { length: setRepeats * messages.length },
    (_, i) => messages[i % messages.length]
  );
  // Half the belt holds beltItems.length / 2 adjacent messages, so scaling the
  // duration with the belt keeps the scroll speed constant (~one message-width
  // per SECONDS_PER_MESSAGE seconds) for any number of coupons.
  const beltDuration = (beltItems.length / 2) * SECONDS_PER_MESSAGE;

  return (
    <motion.section variants={marqueeContainer} initial="initial" animate="animate" className="origin-left h-8 bg-accentColor2 overflow-hidden uppercase flex items-center">
      <motion.div variants={marqueeAD} initial="initial" animate="animate" className="flex items-center w-full overflow-hidden">
        <motion.div
          className="flex items-center w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: beltDuration,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            },
          }}
        >
          {beltItems.map((message, i) => (
            <div key={i} className="flex items-center gap-x-2 flex-shrink-0 px-2 lg:px-4">
              <p className="text-[0.65rem] font-black tracking-widest text-accentColor">
                {message}
              </p>
              <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default Marquee