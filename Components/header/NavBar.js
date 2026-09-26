"use client"
import { Heart, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AccountDropdown from "./AccountDropdown";
import AnimatedLink from "./AnimatedLink";
import CartButton from "./CartButton";
import Logo from "./Logo";
import useUserDetails from "@/hooks/useUserDetails.js";
import { useAuthStore } from "@/libs/zustand/authStore.js";
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
  // },
];

const NavBar = () => {
  const { data: user, isPending } = useUserDetails();
  const storedToken = useAuthStore((state) => state.accessToken);
  // The server never has localStorage, so it always renders the guest block.
  // The first client render has to match that HTML exactly or React throws a
  // hydration error (#418) and replaces the whole tree — so the session check
  // only starts influencing the render after mount, once hydration is done.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // No stored session => anonymous visitor: show Sign in instantly (SSR too).
  // Stored session + pending check => reserve space to avoid header jump.
  const checkingSession = hydrated && isPending && !!storedToken;

  return (
    <div className="hidden  md:grid w-full max-w-[1600px] mx-auto grid-cols-3 py-2 px-8 md:px-12">
      <ul className="flex items-center justify-start  text-sm gap-x-6">
        {navItems.map((item, index) => {
          return (
            <li key={index}>
              <AnimatedLink title={item.name} href={item.href} />
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-center ">
        <Logo />
      </div>
      <div className="flex items-center justify-end gap-x-6 text-textColor mr-2">
        
        {/* Unauthenticated State: Sign-in button (shows instantly for guests) */}
        {!user && !checkingSession && (
          <div className="flex items-center gap-x-3">
            <CartButton />
            <Link
              href="/auth/signin"
              className="flex items-center gap-x-2 rounded-sm bg-accentColor px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-bgColor shadow-md transition-all duration-300 hover:bg-accentColor/90"
            >
              <User className="h-4 w-4" />
              Sign in
            </Link>
          </div>
        )}

        {/* Stored session revalidating: reserve the space so the header doesn't jump */}
        {checkingSession && (
          <div className="flex items-center gap-x-3" aria-hidden="true">
            <div className="h-10 w-10 animate-pulse rounded-full bg-textColor/10" />
            <div className="h-9 w-28 animate-pulse rounded-sm bg-textColor/10" />
          </div>
        )}

        {/* Authenticated State: wishlist + cart + profile dropdown */}
        {user && (
          <div className="flex items-center gap-x-2">
            <Link
              href="/wishlist"
              title="Wishlist"
              className="relative p-2 cursor-pointer group"
            >
              <Heart className="h-6 w-6 text-accentColor" />
            </Link>
            <CartButton isSignedIn />
            <AccountDropdown user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
