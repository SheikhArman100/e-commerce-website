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
export const marqueeText = {
  animate: {
    x: "-100%",
    transition: {
      x: {
        type: 'tween',
        repeat: Infinity,
        repeatType: "loop",
        duration: 4,
        ease: "linear",
      },
    },
  },
};




