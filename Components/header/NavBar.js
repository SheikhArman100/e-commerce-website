"use client"
import { Heart, ShoppingBag, User, LogOut, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import AnimatedLink from "./AnimatedLink";
import CartButton from "./CartButton";
import IconCircleBorder from "./IconCircleBorder";
import Logo from "./Logo";
import useUserDetails from "@/hooks/useUserDetails.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation.js";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
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
  {
    name: "Journals",
    href: "/journals",
  },
];

const NavBar = () => {
  const { data: user, isPending } = useUserDetails();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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
      <div className="flex items-center justify-end gap-x-6 text-textColor mr-2 relative" ref={dropdownRef}>
        
        {/* Unauthenticated State: Show Icons */}
        {!user && !isPending && (
          <>
            <Link href="/wishlist">
              <IconCircleBorder>
                <Heart className="h-[1.2rem] aspect-square" />
              </IconCircleBorder>
            </Link>
            <Link href="/order">
              <IconCircleBorder>
                <ShoppingBag className="h-[1.2rem] aspect-square" />
              </IconCircleBorder>
            </Link>
            <div className="w-[0.01rem] h-[1.2rem] bg-textColor/30" />
            <CartButton />
          </>
        )}

        {/* Authenticated State: Show Avatar Dropdown */}
        {user && !isPending && (
          <div className="relative">
            <div className="flex items-center gap-x-3 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-textColor line-clamp-1">{user.name}</span>
                <span className="text-xs text-stone-500 line-clamp-1">{user.email}</span>
              </div>
              <button 
                className="h-10 w-10 rounded-full border border-accentColor/30 overflow-hidden flex items-center justify-center bg-bgColor hover:border-accentColor transition-all z-50 relative"
              >
                {user?.detail?.image?.path ? (
                  <Image 
                    src={`${fileBase}/${user?.detail?.image?.path}`} 
                    alt={user.name || "User Avatar"} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-accentColor" />
                )}
              </button>
            </div>

            {/* Dropdown Menu */}
            <div className={`absolute top-14 right-0 w-64 bg-bgColor border border-textColor/10 shadow-2xl rounded-sm p-2 flex flex-col gap-y-1 transform transition-all duration-300 origin-top-right z-50 ${dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
              
              <div className="px-4 py-3 border-b border-textColor/5 mb-1">
                <p className="text-sm font-medium text-textColor line-clamp-1">{user.name}</p>
                <p className="text-xs text-stone-500 line-clamp-1">{user.email}</p>
              </div>

              <Link 
                href="/wishlist" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-stone-600 hover:text-accentColor hover:bg-accentColor/5 rounded-sm transition-colors"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              
              <Link 
                href="/order" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-stone-600 hover:text-accentColor hover:bg-accentColor/5 rounded-sm transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Order History
              </Link>

              <Link 
                href="/cart" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-stone-600 hover:text-accentColor hover:bg-black/5 rounded-sm transition-colors"
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
                className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-sm transition-colors w-full text-left"
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
  );
};

export default NavBar;
