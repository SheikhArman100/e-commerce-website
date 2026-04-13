export const iconAnimation = {
  initial: {
    opacity:0,
    pathLength: 0,
  },
  whileInView: {
    opacity:1,
    pathLength: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};