"use client";

import {
  drawerContentVariants,
  linkContainerSlide,
  linkSlide,
  mobileNav,
  navbarItem,
} from "@/libs/animation/navbar.animation.js";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Facebook,
  Heart,
  Instagram,
  Menu,
  ShoppingBag,
  Sparkles,
  Twitter,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useUserDetails from "@/hooks/useUserDetails.js";
import useCarts from "@/hooks/useCarts.js";
import { useAuthStore } from "@/libs/zustand/authStore.js";
import CartButton from "./CartButton.js";
import AccountDropdown from "./AccountDropdown.js";
import Logo from "./Logo.js";

const navItems = [
  {
    name: "Home",
    href: "/",
    subtitle: "Artisanal bakery & handcrafted confections",
  },
  {
    name: "Products",
    href: "/products",
    subtitle: "Cakes, cupcakes, pastries & seasonal treats",
  },
  {
    name: "About us",
    href: "/about",
    subtitle: "Our heritage, philosophy & master pâtissiers",
  },
  {
    name: "Journals",
    href: "/journals",
    subtitle: "Culinary stories, recipes & bakery notes",
  },
];

const MobileNav = () => {
  const [isActive, setIsActive] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { data: user, isPending } = useUserDetails();
  const storedToken = useAuthStore((state) => state.accessToken);
  const { data: cartData } = useCarts({ enabled: !!user });
  const cartCount = cartData?.data?.totals?.totalItems ?? 0;

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => setAvatarError(false), [user]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  const checkingSession = hydrated && isPending && !!storedToken;
  const pathname = usePathname();

  const isNavActive = (href) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isCartActive = pathname === "/cart" || pathname?.startsWith("/cart/");
  const isWishlistActive =
    pathname === "/wishlist" || pathname?.startsWith("/wishlist/");
  const isOrderActive =
    pathname === "/order" || pathname?.startsWith("/order/");
  const isProfileActive =
    pathname === "/auth/profile" || pathname?.startsWith("/auth/profile/");
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const fallbackAvatar = "/assets/avatar.png";
  const rawUserImage = user?.detail?.image?.path || user?.detail?.profileImage;
  const userAvatarSrc = (() => {
    if (avatarError || !rawUserImage) return fallbackAvatar;
    if (
      rawUserImage.startsWith("http://") ||
      rawUserImage.startsWith("https://") ||
      rawUserImage.startsWith("/")
    ) {
      return rawUserImage;
    }
    return fileBase
      ? `${fileBase.replace(/\/$/, "")}/${rawUserImage.replace(/^\//, "")}`
      : fallbackAvatar;
  })();

  return (
    <section className="w-full mt-1.5 px-3 md:hidden">
      {/* 
        Symmetrical Mobile Header Bar:
        - Left: Hamburger Menu (☰) + Wishlist (♡) [w-24]
        - Center: Centered Logo [flex-1]
        - Right: Shopping Cart (🛒) + User Avatar / Sign In (👤) [w-24]
      */}
      <div className="flex items-center justify-between w-full">
        {/* Left Side: exactly 2 action items */}
        <div className="flex items-center gap-x-2 w-24 shrink-0 justify-start">
          <motion.button
            onClick={() => setIsActive(true)}
            title="Open menu"
            className="p-1 rounded-full text-accentColor hover:bg-accentColor/10 transition-colors shrink-0"
            variants={navbarItem}
            initial="initial"
            animate="animate"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-accentColor" />
          </motion.button>

          <Link
            href="/wishlist"
            title="Wishlist"
            className="p-1.5 text-accentColor hover:text-accentColor/80 transition-colors shrink-0"
          >
            <Heart className="h-5 w-5" />
          </Link>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex items-center justify-center flex-1">
          <Logo />
        </div>

        {/* Right Side: exactly 2 action items */}
        <div className="flex items-center gap-x-2 w-24 shrink-0 justify-end">
          <CartButton isSignedIn={!!user} compact />

          {/* User Profile dropdown if authenticated, or circular Sign In icon button if guest */}
          {user ? (
            <AccountDropdown user={user} compact />
          ) : checkingSession ? (
            <div className="h-7 w-7 animate-pulse rounded-full bg-accentColor/10 shrink-0" />
          ) : (
            <Link
              href="/auth/signin"
              title="Sign in"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-accentColor/30 text-accentColor hover:bg-accentColor hover:text-bgColor transition-all shadow-sm shrink-0"
            >
              <User className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Fullscreen Mobile Drawer Menu */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            variants={mobileNav}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 bg-[#FFFBF2] text-[#5D4037] flex flex-col pt-3 pb-6 px-4 sm:px-6 overflow-y-auto overflow-x-hidden origin-top"
          >
            {/* Atmospheric Background Ambient Radiance (clipped inside overflow-hidden) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#9B2242]/10 rounded-full blur-[90px]" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#F4C2C2]/30 rounded-full blur-[100px]" />
            </div>

            {/* Inner Content: Fades and slides in ONLY AFTER drawer is fully open; hides BEFORE drawer closes */}
            <motion.div
              variants={drawerContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative z-10 flex flex-col flex-1 max-w-sm mx-auto w-full justify-between"
            >
              <div>
                {/* Drawer Top Header with Close (✕) button and Logo */}
                <div className="flex items-center justify-between w-full pb-2.5 border-b border-[#9B2242]/10 mb-4">
                  <button
                    type="button"
                    onClick={() => setIsActive(false)}
                    title="Close menu"
                    aria-label="Close menu"
                    className="p-1.5 rounded-full text-[#9B2242] hover:bg-[#9B2242]/10 transition-colors shrink-0"
                  >
                    <X className="h-6 w-6 text-[#9B2242]" />
                  </button>
                  <div className="flex items-center justify-center">
                    <Logo />
                  </div>
                  <div className="w-9 shrink-0" />
                </div>

                {/* User Greeting & Status Card */}
                {user ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-[#9B2242]/15 shadow-sm backdrop-blur-md mb-4 w-full min-w-0">
                    <div className="flex items-center gap-x-2.5 min-w-0 flex-1">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#9B2242]/30 bg-[#9B2242]/5 shrink-0 shadow-inner">
                        <Image
                          src={userAvatarSrc}
                          alt={user.name || "User"}
                          fill
                          sizes="40px"
                          className="object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-sm font-bold text-[#5D4037] truncate">
                          {user.name || "Welcome Back"}
                        </p>
                        <p className="text-[11px] text-[#9B2242] font-medium break-all leading-snug mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/auth/profile"
                      onClick={() => setIsActive(false)}
                      className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                        isProfileActive
                          ? "bg-[#9B2242] text-[#FFFBF2] shadow-sm ring-2 ring-[#9B2242]/20"
                          : "text-[#9B2242] bg-[#9B2242]/10 hover:bg-[#9B2242] hover:text-[#FFFBF2]"
                      }`}
                    >
                      Profile
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#9B2242]/10 to-[#F4C2C2]/20 border border-[#9B2242]/15 shadow-sm mb-4 w-full min-w-0">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#9B2242] text-[10px] font-black uppercase tracking-wider mb-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Baking Tales</span>
                      </div>
                      <p className="text-xs font-bold text-[#5D4037]">
                        Handcrafted Delicacies
                      </p>
                    </div>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsActive(false)}
                      className="text-xs font-bold text-[#FFFBF2] bg-[#9B2242] hover:bg-[#9B2242]/90 px-4 py-2 rounded-full shadow-md transition-all shrink-0"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Primary Navigation Links */}
                <nav className="mb-4">
                  <motion.ul variants={linkContainerSlide} className="space-y-1.5">
                    {navItems.map((item, index) => {
                      const isSelected = isNavActive(item.href);
                      return (
                        <motion.li
                          key={item.name}
                          variants={linkSlide}
                          className="overflow-hidden"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsActive(false)}
                            className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 ${
                              isSelected
                                ? "bg-white border-2 border-[#9B2242] shadow-sm shadow-[#9B2242]/10"
                                : "bg-transparent hover:bg-white/80 border border-transparent hover:border-[#9B2242]/15"
                            }`}
                          >
                            <div className="flex items-center gap-x-3 min-w-0 flex-1">
                              <span
                                className={`text-[10px] font-bold font-mono w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                  isSelected
                                    ? "bg-[#9B2242] text-[#FFFBF2] shadow-sm ring-2 ring-[#9B2242]/20"
                                    : "text-[#9B2242] bg-[#9B2242]/10 border border-[#9B2242]/20 group-hover:bg-[#9B2242] group-hover:text-[#FFFBF2]"
                                }`}
                              >
                                0{index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h2
                                    className={`text-lg font-bold tracking-tight transition-colors duration-300 truncate ${
                                      isSelected
                                        ? "text-[#9B2242]"
                                        : "text-[#5D4037] group-hover:text-[#9B2242]"
                                    }`}
                                  >
                                    {item.name}
                                  </h2>
                                  {/* {isSelected && (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#9B2242] bg-[#9B2242]/10 px-2 py-0.5 rounded-full shrink-0">
                                      Selected
                                    </span>
                                  )} */}
                                </div>
                                <p
                                  className={`text-[11px] transition-colors truncate ${
                                    isSelected
                                      ? "text-[#9B2242]/80 font-medium"
                                      : "text-stone-500 group-hover:text-[#9B2242]/80 font-light"
                                  }`}
                                >
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>
                            <ArrowRight
                              size={16}
                              className={`text-[#9B2242] transition-all duration-300 shrink-0 ml-2 ${
                                isSelected
                                  ? "opacity-100 translate-x-0"
                                  : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                              }`}
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </nav>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-3 gap-2 pt-1 w-full">
                  <Link
                    href="/cart"
                    onClick={() => setIsActive(false)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all shadow-sm group min-w-0 ${
                      isCartActive
                        ? "bg-white border-2 border-[#9B2242] ring-1 ring-[#9B2242]/20"
                        : "bg-white/70 border border-[#5D4037]/10 hover:border-[#9B2242]/30 hover:bg-white"
                    }`}
                  >
                    <div className="relative mb-1">
                      <ShoppingBag className="w-4.5 h-4.5 text-[#9B2242] group-hover:scale-110 transition-transform" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 h-3.5 w-3.5 rounded-full bg-[#9B2242] text-[#FFFBF2] text-[8px] font-bold flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider truncate ${
                        isCartActive
                          ? "text-[#9B2242]"
                          : "text-[#5D4037] group-hover:text-[#9B2242]"
                      }`}
                    >
                      Cart
                    </span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsActive(false)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all shadow-sm group min-w-0 ${
                      isWishlistActive
                        ? "bg-white border-2 border-[#9B2242] ring-1 ring-[#9B2242]/20"
                        : "bg-white/70 border border-[#5D4037]/10 hover:border-[#9B2242]/30 hover:bg-white"
                    }`}
                  >
                    <Heart className="w-4.5 h-4.5 text-[#9B2242] mb-1 group-hover:scale-110 transition-transform" />
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider truncate ${
                        isWishlistActive
                          ? "text-[#9B2242]"
                          : "text-[#5D4037] group-hover:text-[#9B2242]"
                      }`}
                    >
                      Wishlist
                    </span>
                  </Link>

                  <Link
                    href="/order"
                    onClick={() => setIsActive(false)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all shadow-sm group min-w-0 ${
                      isOrderActive
                        ? "bg-white border-2 border-[#9B2242] ring-1 ring-[#9B2242]/20"
                        : "bg-white/70 border border-[#5D4037]/10 hover:border-[#9B2242]/30 hover:bg-white"
                    }`}
                  >
                    <Sparkles className="w-4.5 h-4.5 text-[#9B2242] mb-1 group-hover:scale-110 transition-transform" />
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider truncate ${
                        isOrderActive
                          ? "text-[#9B2242]"
                          : "text-[#5D4037] group-hover:text-[#9B2242]"
                      }`}
                    >
                      Orders
                    </span>
                  </Link>
                </div>
              </div>

              {/* Bottom Editorial Quote & Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-4 border-t border-[#5D4037]/10 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-[#9B2242] text-[10px] font-black uppercase tracking-[0.25em] mb-1.5">
                  <span>★</span>
                  <span>Follow Our Story</span>
                  <span>★</span>
                </div>
                <p className="text-[#5D4037]/70 text-[11px] italic font-light max-w-[260px] mx-auto leading-relaxed mb-3">
                  Handcrafted with passion, baked fresh daily with pure organic ingredients.
                </p>

                <div className="flex justify-center gap-x-2.5">
                  {[
                    { Icon: Facebook, link: "https://facebook.com", name: "Facebook" },
                    { Icon: Instagram, link: "https://instagram.com", name: "Instagram" },
                    { Icon: Twitter, link: "https://twitter.com", name: "Twitter" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-[#9B2242]/20 bg-white/70 text-[#9B2242] hover:bg-[#9B2242] hover:text-[#FFFBF2] hover:border-[#9B2242] transition-all duration-300 shadow-sm"
                    >
                      <social.Icon size={14} strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MobileNav;
