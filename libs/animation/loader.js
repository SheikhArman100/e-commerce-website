export const LoadingBar={
    initial:{
        scaleX:0,
        scaleY:0.003,

    },
    animate:{
        scaleX:1,
        scaleY:1,
        transition:{
           scaleX:{
             type:"tween",
            ease:"linear",
            duration:2
           },
           scaleY:{
             type:"tween",
             ease:"linear",
             delay:2,
             duration:1
           }
        }
    }
}