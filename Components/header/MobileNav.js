"use client";
import {
  linkContainerSlide,
  linkSlide,
  mobileNav,
  navbarItem,
} from "@/libs/animation/navbar.animation.js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Facebook, Heart, Instagram, Menu, Twitter, X, User } from "lucide-react";
import Link from "next/link.js";
import { useEffect, useState } from "react";
import useUserDetails from "@/hooks/useUserDetails.js";
import { useAuthStore } from "@/libs/zustand/authStore.js";
import CartButton from "./CartButton.js";
import AccountDropdown from "./AccountDropdown.js";
import Logo from "./Logo.js";
import IconCircleBorder from "./IconCircleBorder.js";
const navItems = [
   {
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
  const storedToken = useAuthStore((state) => state.accessToken);
  // Hydration-safe: the server renders the guest block (no localStorage there),
  // so the session check may only reshape the header after mount — otherwise
  // React sees different HTML on the client and bails out of hydrating it.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // Same guest-first logic as NavBar: instant Sign in, skeleton only when a
  // stored session is actually being revalidated.
  const checkingSession = hydrated && isPending && !!storedToken;

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
        <div className="flex items-center justify-center gap-x-2">
          {/* Unauthenticated State: Sign-in button (shows instantly for guests) */}
          {!user && !checkingSession && (
            <div className="flex items-center gap-x-2">
              <CartButton />
              <Link
                href="/auth/signin"
                className="flex items-center gap-x-1.5 rounded-sm bg-accentColor px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-bgColor shadow-md transition-all duration-300 hover:bg-accentColor/90"
              >
                <User className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          )}

          {/* Stored session revalidating: reserve the space so the header doesn't jump */}
          {checkingSession && (
            <div className="flex items-center gap-x-2" aria-hidden="true">
              <div className="h-8 w-8 animate-pulse rounded-full bg-textColor/10" />
              <div className="h-8 w-20 animate-pulse rounded-sm bg-textColor/10" />
            </div>
          )}

          {/* Authenticated State: wishlist + cart + profile dropdown */}
          {user && (
            <div className="flex items-center gap-x-1">
              <Link
                href="/wishlist"
                title="Wishlist"
                className="relative p-2 cursor-pointer"
              >
                <Heart className="h-5 w-5 text-accentColor" />
              </Link>
              <CartButton isSignedIn />
              <AccountDropdown user={user} compact />
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
