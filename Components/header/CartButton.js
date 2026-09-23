"use client";
import { navbarItem } from "@/libs/animation/navbar.animation.js";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const CartButton = () => {
  return (
    <Link href="/cart" title="Cart" className="relative p-2   cursor-pointer group ">
      <motion.div variants={navbarItem} initial="initial" animate="animate">
        <ShoppingCart className=" h-6 w-6 text-accentColor  " />
      </motion.div>
      <p className="absolute -top-2 -right-2 rounded-full bg-accentColor text-bgColor text-center h-5 w-5 flex items-center justify-center  text-xs font-semibold origin-center transition-all scale-0 group-hover:scale-100  ">
        !
      </p>
    </Link>
  );
};

export default CartButton;
