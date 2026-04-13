import { easeInOut } from "framer-motion"

// export const paragraphAnimation={
//     whileInView:{
//         transition:{
//             delayChildren:1,
//             staggerChildren:0.3
//         }
//     }
// }
 export const letterAnimation={
    initial:{
        opacity:0.1,
        
    },
    whileInView:(index)=>({
        opacity:1 ,
        
        transition:{
            type:"tween",
            delay:0.015 * index,
            ease:"linear"

        } 
    }),
     exit:(index)=>({
        opacity:0 ,
        
        transition:{
            delay:0.015 * index,
            ease:"easeInOut"

        } 
    })
}