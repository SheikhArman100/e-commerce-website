"use client";
import { navbarItem } from "@/libs/animation/navbar.animation.js";
import useCarts from "@/hooks/useCarts.js";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

/**
 * The header's cart link, now carrying the real count.
 *
 * `GET /cart/user` is auth-scoped, so the query is only enabled once the caller
 * knows a session exists (`isSignedIn` comes from NavBar, which already holds
 * the user query) — a guest never fires a needless request. The API's own
 * `totals.totalItems` is what the badge shows, so it counts pieces, not rows,
 * and every cart mutation invalidates `["cart"]`, keeping the badge in step.
 */
const CartButton = ({ isSignedIn = false, compact = false }) => {
  const { data } = useCarts({ enabled: isSignedIn });
  const count = data?.data?.totals?.totalItems ?? 0;
  const showCount = isSignedIn && count > 0;

  return (
    <Link
      href="/cart"
      title="Cart"
      className={`relative ${
        compact ? "p-1.5" : "p-2"
      } cursor-pointer group shrink-0`}
    >
      <motion.div variants={navbarItem} initial="initial" animate="animate">
        <ShoppingCart
          className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-accentColor`}
        />
      </motion.div>
      <span
        aria-label={`${count} ${count === 1 ? "piece" : "pieces"} in cart`}
        className={`absolute ${
          compact
            ? "-top-1 -right-1 h-4 w-4 text-[9px]"
            : "-top-2 -right-2 h-5 w-5 text-xs"
        } rounded-full bg-accentColor text-bgColor text-center flex items-center justify-center font-bold origin-center transition-all ${
          showCount ? "scale-100" : "scale-0 group-hover:scale-100"
        }`}
      >
        {showCount ? count : "!"}
      </span>
    </Link>
  );
};

export default CartButton;
