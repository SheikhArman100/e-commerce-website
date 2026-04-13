import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import cakeIcon from "../public/assets/cakeIcon.svg"
import cupcakeIcon from "../public/assets/cupcakeIcon.svg"
import jarcakeIcon from "../public/assets/jarcakeIcon.svg"
import { Star } from 'lucide-react'

const Card = ({className,children}) => {
  return (
    <div className={twMerge("relative h-64 w-[10.5rem] sm:h-72 sm:w-60 md:w-64 md:h-80  p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm border border-textColor/10 bg-white",className)}>
        {children}
    </div>
  )
}
const CardContainer=({className,children})=>{
    return(
        <div className={twMerge("relative w-full h-full flex flex-col items-center justify-between py-3 group/card",className)}>
            <div className="h-[96%] w-full border-[0.5px] border-textColor/10 absolute top-[50%] left-0 -translate-y-[50%] transition-all " />
            <div className="w-[94%] h-full border-[0.5px] border-textColor/10 absolute top-0 left-[50%] -translate-x-[50%] transition-all  " />
            {children}
        </div>
    )
}
const CategoryIcon=({className,category, categoryImage})=>{
    return(
        <div className={twMerge("sm:h-10 sm:w-10 h-8 w-8 border p-2 border-textColor/20 border-dotted rounded-full flex items-center justify-center transition-all overflow-hidden bg-bgColor",className)}>
            {categoryImage ? (
                <Image src={categoryImage} alt="category image" width={40} height={40} className="h-full w-full object-contain" />
            ) : (
                category==="cupcake"?<Image src={cupcakeIcon} alt="cupcake category icon" className="h-full w-full"/>:category==="jarcake"?<Image src={jarcakeIcon} alt="category icon" className="h-full w-full" />:<Image src={cakeIcon} alt="category icon" className="h-full w-full" />
            )}
        </div>
    )

}
const FlavorColors = ({ className, colors }) => {
  return (
    <div className={twMerge("flex gap-x-1 transition-all", className)}>
      {colors?.map((color, i) => (
        <div
          key={i}
          className="sm:w-3 sm:h-3 w-2 h-2 rounded-full border border-textColor/20"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};
const CardInfo = ({ className, title, price, salesPrice, discountPercentage, href }) => {
  return (
    <div className={twMerge("flex text-textColor flex-col items-center font-semibold transition-all", className)}>
      {href ? (
        <Link href={href} className="hover:text-accentColor transition-colors duration-300 relative z-10">
          <h4 className='text-sm lg:text-base text-center px-2 font2 tracking-tight'>{title}</h4>
        </Link>
      ) : (
        <h4 className='text-sm lg:text-base text-center px-2 font2 tracking-tight'>{title}</h4>
      )}
      <div className="flex items-center gap-x-2 mt-1">
        {salesPrice ? (
          <>
            <span className='text-xs lg:text-sm font-bold text-accentColor'>৳{salesPrice}</span>
            <span className='text-[10px] lg:text-xs font-normal text-stone-400 line-through decoration-stone-300'>৳{price}</span>
          </>
        ) : (
          <span className='text-xs lg:text-sm font-bold text-accentColor shadow-sm px-1 rounded-sm'>৳{price}</span>
        )}
      </div>
    </div>
  );
};

const Badge = ({ className, children }) => {
    return (
        <div className={twMerge("absolute top-4 left-2 sm:left-4 z-10 bg-accentColor text-bgColor text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm flex items-center gap-1 group-hover/card:scale-110 transition-transform", className)}>
            <Star fill="currentColor" stroke="none" className="h-2 w-2 hidden sm:block" />
            {children}
        </div>
    )
}
const BgRemoveImage=({className,bgRemoveImage})=>{
    return(
        <div className={twMerge("relative h-28 w-28  md:h-40 md:w-44  transition-all flex items-center justify-center bg-accentColor/5 rounded-2xl",className)}>
        {bgRemoveImage ? (
            <Image
                src={bgRemoveImage}
                alt="card image bg remove"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-fit object-center w-full h-full p-2 scale-110 transition-transform "
            />
        ) : (
            <span className="text-xs text-textColor/30 font-medium italic">Gallery Pending</span>
        )}
    </div>
    )
}
const CardImage=({className,cardImage})=>{
    return (
      <div
        className={twMerge(
          "w-full h-full absolute top-0 left-0 opacity-0 group-hover/card:opacity-100 transition-all duration-[0.4s] flex items-center justify-center bg-bgColor",
          className
        )}
      >
        {cardImage ? (
            <Image
                src={cardImage}
                alt="card image hover"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        ) : (
            <span className="text-xs text-textColor/30 font-medium">No View</span>
        )}
      </div>
    );

}
const CardButtonWrapper=({className,children})=>{
    return(
        <div className={twMerge("absolute top-[60%] left-1/2 -translate-x-1/2 scale-0 group-hover/card:scale-100 transition-all delay-200",className)}>
          {children}
        </div>
    )
}
Card.CardContainer=CardContainer
Card.CategoryIcon=CategoryIcon
Card.FlavorColors=FlavorColors
Card.CardInfo=CardInfo
Card.Badge=Badge
Card.BgRemoveImage=BgRemoveImage
Card.CardImage=CardImage
Card.CardButtonWrapper=CardButtonWrapper

export default Card