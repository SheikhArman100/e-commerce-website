export const marqueeContainer = {
  initial: {
    scaleX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      scaleX: {
        type: "tween",
        ease: "linear",
        duration: 0.4,
      },
    },
  },
};
export const marqueeAD={
  initial:{
    y:-100,
  },
  animate: {
    y:0,
    transition: {
      y: {
        type: 'tween',
        delay:0.4,
        duration: 0.3,
        ease: "linear",
      },
    },
  },

}
// NOTE: the per-item "marqueeText" variant was removed. Animating each item by
// -100% of its OWN width only scrolls seamlessly when every item has identical
// text/width; with different-length coupon messages the longer items slid
// faster and overlapped the shorter ones. The row is now animated as a whole
// inside Components/header/Marquee.js.




