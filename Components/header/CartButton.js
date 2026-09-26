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
const CartButton = ({ isSignedIn = false }) => {
  const { data } = useCarts({ enabled: isSignedIn });
  const count = data?.data?.totals?.totalItems ?? 0;
  const showCount = isSignedIn && count > 0;

  return (
    <Link href="/cart" title="Cart" className="relative p-2 cursor-pointer group">
      <motion.div variants={navbarItem} initial="initial" animate="animate">
        <ShoppingCart className="h-6 w-6 text-accentColor" />
      </motion.div>
      <span
        aria-label={`${count} ${count === 1 ? "piece" : "pieces"} in cart`}
        className={`absolute -top-2 -right-2 rounded-full bg-accentColor text-bgColor text-center h-5 w-5 flex items-center justify-center text-xs font-semibold origin-center transition-all ${
          showCount ? "scale-100" : "scale-0 group-hover:scale-100"
        }`}
      >
        {showCount ? count : "!"}
      </span>
    </Link>
  );
};

export default CartButton;
