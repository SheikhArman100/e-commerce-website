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

export const mobileNav={
  initial:{
    scaleY:0
  },
  animate:{
    scaleY:1,
    transition:{
      duration:0.4,
      ease: [0.12, 0, 0.39, 0],
      delayChildren:0.3,
      
    }
  },
  exit:{
    scaleY:0,
    transition:{
      delay:1.4,
      duration:0.4,
      ease:"easeInOut",
      delayChildren:0.4
    }
  }
}

export const menuClose={
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
    initial: {x: 80,scale:0},
    animate: {x: 0,scale:1, transition: { ease: [0.76, 0, 0.24, 1], delayChildren: 0.1,staggerChildren:0.1 }},
    exit:  {x: 80,scale:0, transition: {  delay:1,duration:0.3, ease: [0.76, 0, 0.24, 1], delayChildren: 0.1,staggerChildren:0.1}}
}
export const linkSlide = {
    initial: {y: 80, opacity:0},
    animate: {y:0, opacity:1,transition:{duration:0.8,ease: [0.76, 0, 0.24, 1]}},
    exit:{y:80,opacity:0,transition:{duration:0.2,ease: [0.76, 0, 0.24, 1]}}
    
}

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