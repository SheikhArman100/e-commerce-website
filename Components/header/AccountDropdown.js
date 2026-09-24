"use client";
import { Heart, Loader2, Lock, LogOut, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useAuthStore } from "@/libs/zustand/authStore.js";

/**
 * Signed-in account menu used by both headers (NavBar desktop + MobileNav):
 * avatar/profile button with a chevron, opening My Profile / Change Password
 * / Orders / Wishlist / Sign out. Closes on outside click, Escape, and route
 * change (link click). Compact mode fits the mobile bar.
 */
const AccountDropdown = ({ user, compact = false }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  const itemClass =
    "flex items-center gap-x-3 px-4 py-2.5 text-sm text-stone-600 hover:text-accentColor hover:bg-accentColor/5 rounded-sm transition-colors";

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const signoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosPrivate.post("/auth/signout");
      return res.data;
    },
    onSuccess: async (data) => {
      setOpen(false);
      // Stop whatever is still in flight first, so a response that was started
      // while signed in can't repopulate the caches we drop right after.
      await queryClient.cancelQueries();
      setAccessToken(null);
      // Drop every cached resource (user, cart, wishlist, orders …). The header
      // then re-checks /auth/user against the (now cleared) cookie and falls
      // back to the signed-out UI.
      queryClient.removeQueries();
      router.push("/auth/signin");
      toast.success(data?.message || "Signed out successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Sign out failed");
    },
  });
  const avatarSrc = user?.detail?.image?.path
    ? `${fileBase}/${user.detail.image.path}`
    : user?.detail?.profileImage || null;
  const displayName = user?.name || "My Account";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={displayName}
        className={`flex items-center ${
          compact ? "gap-x-1" : "gap-x-1.5"
        } rounded-full border border-accentColor/30 bg-bgColor py-1 ${
          compact ? "pl-1 pr-1.5" : "pl-1 pr-2"
        } hover:border-accentColor transition-all`}
      >
        <span
          className={`relative ${
            compact ? "h-7 w-7" : "h-8 w-8"
          } rounded-full overflow-hidden flex items-center justify-center bg-accentColor/5`}
        >
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={displayName}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <User
              className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-accentColor`}
            />
          )}
        </span>
        <svg
          viewBox="0 0 12 12"
          className={`${
            compact ? "h-3 w-3" : "h-3.5 w-3.5"
          } text-stone-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        role="menu"
        className={`absolute ${
          compact ? "top-11 right-0 w-60" : "top-12 right-0 w-64"
        } bg-bgColor border border-textColor/10 shadow-2xl rounded-sm p-2 flex flex-col gap-y-1 transform transition-all duration-300 origin-top-right z-50 ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 border-b border-textColor/5 mb-1">
          <p className="text-sm font-medium text-textColor line-clamp-1">
            {user?.name || "My Account"}
          </p>
          <p className="text-xs text-stone-500 line-clamp-1">{user?.email}</p>
        </div>
        <Link
          href="/auth/profile"
          role="menuitem"
          onClick={() => setOpen(false)}
          className={itemClass}
        >
          <User className="h-4 w-4" />
          My Profile
        </Link>
        <Link
          href="/auth/change-password"
          role="menuitem"
          onClick={() => setOpen(false)}
          className={itemClass}
        >
          <Lock className="h-4 w-4" />
          Change Password
        </Link>
        <Link
          href="/order"
          role="menuitem"
          onClick={() => setOpen(false)}
          className={itemClass}
        >
          <ShoppingBag className="h-4 w-4" />
          Orders
        </Link>
        {/* <Link
          href="/wishlist"
          role="menuitem"
          onClick={() => setOpen(false)}
          className={itemClass}
        >
          <Heart className="h-4 w-4" />
          Wishlist
        </Link> */}
        <div className="h-px w-full bg-textColor/5 my-1" />
        <button
          type="button"
          role="menuitem"
          onClick={() => signoutMutation.mutate()}
          disabled={signoutMutation.isPending}
          className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-sm transition-colors w-full text-left disabled:opacity-60"
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
  );
};

export default AccountDropdown;
