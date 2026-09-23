"use client";
import {
  linkContainerSlide,
  linkSlide,
  mobileNav,
  navbarItem,
} from "@/libs/animation/navbar.animation.js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Facebook, Heart, Instagram, Menu, Twitter, X, User, LogOut, ShoppingCart, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link.js";
import { useState, useRef, useEffect } from "react";
import useUserDetails from "@/hooks/useUserDetails.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation.js";
import { toast } from "react-toastify";
import { useAuthStore } from "@/libs/zustand/authStore.js";
import Image from "next/image";
import FramerMagnetic from "../FramerMagnetic.js";
import SectionTitle from "../SectionTitle.js";
import CartButton from "./CartButton.js";
import IconCircleBorder from "./IconCircleBorder.js";
import Logo from "./Logo.js";

const navItems = [
   {
    name: "Home",
    href: "/",
  },
  {
    name: "About us",
    href: "/about",
  },
  {
    name: "Products",
    href: "/products",
  },
  // {
  //   name: "Journals",
  //   href: "/journals",
  // }
]

const MobileNav = () => {
  const [isActive, setIsActive] = useState(false);
  
  const { data: user, isPending } = useUserDetails();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const signoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post('/auth/signout');
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(null);
      queryClient.removeQueries();
      router.push('/auth/signin');
      setDropdownOpen(false);
      toast.success(data.message || "Signed out successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Sign out failed');
    },
  });

  const handleSignOut = () => {
    signoutMutation.mutate();
  };

  return (
    <section className="w-full mt-2 md:hidden">
      <div className="grid grid-cols-3 items-center">
        <div className="flex items-center justify-center">
          <motion.button
            onClick={() => setIsActive(!isActive)}
            title={isActive ? "Close menu" : "Menu"}
            className="z-50"
            variants={navbarItem}
            initial="initial"
            animate="animate"
          >
            <IconCircleBorder className={isActive ? "border-textColor/20" : ""}>
             {isActive ? <X className="text-textColor" /> : <Menu className="text-accentColor h-6 w-6" />}
            </IconCircleBorder>
          </motion.button>
        </div>
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex items-center justify-center gap-x-2 relative" ref={dropdownRef}>
          {/* Unauthenticated State: Show Icons */}
          {!user && !isPending && (
            <>
              <Link href="/wishlist" title="Wishlist">
                <IconCircleBorder className="h-8 w-8">
                  <Heart className="h-4 w-4 stroke-textColor/70" />
                </IconCircleBorder>
              </Link>
              <CartButton />
            </>
          )}

          {/* Authenticated State: Show Avatar Dropdown */}
          {user && !isPending && (
            <div className="relative">
               <div className="flex items-center gap-x-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-medium text-textColor line-clamp-1 max-w-[100px]">{user.name}</span>
                  </div>
                  <button 
                    title="Account"
                    className="h-8 w-8 rounded-full border border-accentColor/30 overflow-hidden flex items-center justify-center bg-bgColor hover:border-accentColor transition-all z-50 relative"
                  >
                    {user?.detail?.image?.path ? (
                      <Image 
                        src={`${fileBase}/${user?.detail?.image?.path}`} 
                        alt={user.name || "User Avatar"} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-accentColor" />
                    )}
                  </button>
                </div>

                {/* Dropdown Menu */}
                <div className={`absolute top-12 -right-4 w-56 bg-bgColor border border-textColor/10 shadow-2xl rounded-sm p-2 flex flex-col gap-y-1 transform transition-all duration-300 origin-top-right z-50 ${dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                  
                  <div className="px-3 py-2 border-b border-textColor/5 mb-1">
                    <p className="text-sm font-medium text-textColor line-clamp-1">{user.name}</p>
                    <p className="text-xs text-stone-500 line-clamp-1">{user.email}</p>
                  </div>

                  <Link 
                    href="/wishlist" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-x-3 px-3 py-2 text-sm text-stone-600 hover:text-accentColor hover:bg-accentColor/5 rounded-sm transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                  
                  <Link 
                    href="/order" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-x-3 px-3 py-2 text-sm text-stone-600 hover:text-accentColor hover:bg-accentColor/5 rounded-sm transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Order History
                  </Link>
 
                  <Link 
                    href="/cart" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-x-3 px-3 py-2 text-sm text-stone-600 hover:text-accentColor hover:bg-black/5 rounded-sm transition-colors"
                  >
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="absolute -top-1.5 -right-2 h-3 w-3 bg-accentColor rounded-full flex items-center justify-center text-[8px] text-bgColor font-bold">!</span>
                    </div>
                    Shopping Cart
                  </Link>

                  <div className="h-px w-full bg-textColor/5 my-1" />

                  <button 
                    onClick={handleSignOut}
                    disabled={signoutMutation.isPending}
                    className="flex items-center gap-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-sm transition-colors w-full text-left"
                  >
                    {signoutMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </>
                    )}
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            variants={mobileNav}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 bg-bgColor origin-top flex flex-col pt-24 pb-8 px-6 overflow-y-auto"
          >
            {/* Background decorative element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accentColor/5 rounded-full blur-[80px] -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accentColor/5 rounded-full blur-[80px] -ml-24 -mb-24" />

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
              <motion.ul 
                variants={linkContainerSlide}
                className="space-y-4"
              >
                {navItems.map((item, index) => (
                  <motion.li 
                    key={index}
                    variants={linkSlide}
                    className="overflow-hidden"
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setIsActive(false)}
                      className="group flex items-center gap-x-3"
                    >
                      <span className="text-accentColor/40 text-[10px] font-bold font-mono">0{index + 1}</span>
                      <h2 className="text-textColor text-3xl font-black tracking-tight group-hover:text-accentColor transition-colors duration-300">
                        {item.name}
                      </h2>
                      <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accentColor" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            {/* Bottom Content / Social */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 pt-6 border-t border-textColor/5 max-w-sm mx-auto w-full"
            >
              <div className="flex flex-col items-center text-center gap-y-5">
                <div>
                  <SectionTitle title="Follow Our Story" className="!mb-3 scale-75 origin-center" />
                  <p className="text-textColor/50 text-xs max-w-[240px] leading-relaxed italic mx-auto">
                    Discover the art of baking through our daily updates.
                  </p>
                </div>

                <div className="flex justify-center gap-x-4">
                  {[
                    { Icon: Facebook, link: "#", name: "Facebook" },
                    { Icon: Instagram, link: "#", name: "Instagram" },
                    { Icon: Twitter, link: "#", name: "Twitter" },
                  ].map((social, idx) => (
                    <FramerMagnetic key={idx}>
                      <a
                        href={social.link}
                        title={social.name}
                        className="w-9 h-9 flex items-center justify-center border border-textColor/5 bg-textColor/5 hover:border-accentColor hover:bg-accentColor transition-all duration-500 text-textColor/70 hover:text-bgColor group"
                      >
                        <social.Icon
                          size={16}
                          strokeWidth={1.5}
                          className="group-hover:scale-110 transition-transform duration-500"
                        />
                      </a>
                    </FramerMagnetic>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MobileNav;
