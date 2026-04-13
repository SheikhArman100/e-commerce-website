export const PageRevealAnimation = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      ease: "linear",
      duration: 0.8,
      delayChildren: 0.8,
    },
  },
};
export const PageRevealStaggered = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren:0.3
    },
  },
};

export const revealContainer = {
  initial: {},
  animate: {
    transition: {
      delayChildren:0.3,
      staggerChildren: 0.2,
    },
  },
};
export const revealTitleAnimation = {
  initial: { y: "100%" },
  animate: {
    y: "0",
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};
export const revealParagraphContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};
export const revealParagraphAnimation = {
  initial: {
    opacity: 0.3,
  },
  animate: {
    opacity: 1,
    transition: {
      ease: "linear",
    },
  },
};
