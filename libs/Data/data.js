import product1_bgRemove from "@/public/assets/product1-removebg.png";
import product1 from "@/public/assets/product1.jpg";
import product2_bgRemove from "@/public/assets/product2-removebg.png";
import product2 from "@/public/assets/product2.jpg";
import product3_bgRemove from "@/public/assets/product3-removebg.png";
import product3 from "@/public/assets/product3.jpg";
import product4_bgRemove from "@/public/assets/product4-removebg.png";
import product4 from "@/public/assets/product4.jpg";
import product5_bgRemove from "@/public/assets/product5-removebg.png";
import product5 from "@/public/assets/product5.jpg";
import product6_bgRemove from "@/public/assets/product6-removebg.png";
import product6 from "@/public/assets/product6.jpg";
import { iconAnimation } from "../animation/services.animation";

export const serviceList = [
  {
    id: 1,
    title: "Home",
    description: "Everything in the cake is hand crafted by us",
    icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cake h-14 w-14 lg:h-20 lg:w-20 stroke-yellow-500"><path variants={iconAnimation} initial="initial" whileInView="whileInView" d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8 M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1 M2 21h20 M7 8v2 M12 8v2 M17 8v2 M7 4h.01 M12 4h.01 M17 4h.01"/></svg>
  },
  {
    id: 2,
    title: "Home Delivery",
    description: "We ensure quick and reasonable home delivery",
    icon:  <svg
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-truck h-14 w-14 lg:h-20 lg:w-20 stroke-yellow-500"
    >
     <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11 M14 9h4l4 4v4c0 .6-.4 1-1 1h-2 M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M15 18H9 M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
    </svg>,
   
  },
  {
    id: 3,
    title: "Gift",
    description: "We decorate your product with letter, box and chocolate",
    icon:  <svg
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-gift h-14 w-14 lg:h-20 lg:w-20 stroke-yellow-500"
    >
      <path
        d="M20 12L20 22L4 22L4 12 M2 7h20v5H2Z M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
      />
    </svg>,
  },
];
export const products=[
  {
    id: 1,
    title: "Love Cake",
    desc: "a sweet, baked, breadlike food, made with or without shortening, and usually containing flour, sugar, baking powder or soda, eggs, and liquid flavoring",
    img: product1,
    bgRemove: product1_bgRemove,
    categories: "Cake",
    price: 800,
    inStock: 17
  },
  {
    id: 2,
    title: "Angel cake",
    desc: "Sponge cake, cream, food coloring",
    img: product2,
    bgRemove: product2_bgRemove,
    categories: "Cake",
    price: 1200,
    inStock: 12
  },
  {
    id: 3,
    title: "Angel food cake",
    desc: "Egg whites, vanilla, and cream of tartar",
    img: product3,
    bgRemove: product3_bgRemove,
    categories: "Cake",
    price: 700,
    inStock: 15
  },
  {
    id: 4,
    title: "Fairy's Favorite",
    desc: "a sweet, baked, breadlike food, made with or without shortening, and usually containing flour, sugar, baking powder or soda, eggs, and liquid flavoring",
    img: product4,
    bgRemove: product4_bgRemove,
    categories: "Cupcake",
    price: 190,
    inStock: 32
  },
  {
    id: 5,
    title: "Aqua Cake",
    desc: "a sweet, baked, breadlike food, made with or without shortening, and usually containing flour, sugar, baking powder or soda, eggs, and liquid flavoring",
    img: product5,
    bgRemove: product5_bgRemove,
    categories: "Chocolate bar",
    price: "200",
    inStock: "29"
  },
  {
    id: 6,
    title: "Thumbelina",
    desc: "a sweet, baked, breadlike food, made with or without shortening, and usually containing flour, sugar, baking powder or soda, eggs, and liquid flavoring",
    img: product6,
    bgRemove: product6_bgRemove,
    categories: "JarCake",
    price: 90,
    inStock: 23
  },
 
];



export const categories=[
  "All","Cupcake","Cake",,"JarCake","Chocolate Bar"
]

export const sizes=[0.5,1,1.5,2,2.5,3]
export const flavors=["chocolate","vanilla", "red velvet"]