export const navbarItem = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      ease: "linear",
    },
  },
};
export const logoText = {
  initial: {
    fill: "none",
  },
  animate: {
    fill: "#9B2242",
    transition: {
      delay: 1.2,
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const logoTextBorder = {
  initial: {
    pathLength: 0,
  },
  animate: {
    pathLength: 1,
    transition: {
      delay: 0.7,
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export const menuBorder = {
  initial: {
    pathLength: 0,
  },
  hover: {
    pathLength: 1,
    transition: {
      duration: 0.4,
      ease: "linear",
    },
  },
};

export const mobileNav = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      duration: 0.32,
      ease: [0.7, 0, 0.84, 0],
      when: "afterChildren",
    },
  },
};

export const drawerContentVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const menuClose = {
  initial:{
    scale:0
  },
  animate:{
    scale:1,
    transition:{
      duration:0.3,
      ease:"easeInOut"
    }
  },
  exit:{
    scale:0,
    transition:{
      delay:1.1,
      duration:0.3,
      ease:"easeInOut"
    }
  }
}

export const linkContainerSlide = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};
export const linkSlide = {
  initial: { y: 12, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    y: -6,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

//nav-left
export const titleAnimation = {
  rest: {
    transition: {
      staggerChildren: 0.01,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.01,
    },
  },
};

export const letterAnimation = {
  rest: {
    y: 0,
  },
  hover: {
    y: -30,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: "tween",
    },
  },
};

export const letterAnimationTwo = {
  rest: {
    y: 30,
  },
  hover: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: "tween",
    },
  },
};