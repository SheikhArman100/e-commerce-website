"use client";

import Button from "@/Components/Button.js";
import {
  CartListSkeleton,
  OrderSummarySkeleton,
} from "@/Components/Skeleton.js";
import useCarts from "@/hooks/useCarts.js";
import { cartItemCount, cartSubtotal } from "@/libs/orderTotals.js";
import { AlertTriangle, Heart, RotateCcw, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import CartItem from "./CartItem.js";
import CartSummary from "./CartSummary.js";

/** Same two-column frame in every state, so nothing jumps when data lands. */
const CartFrame = ({ list, rail }) => (
  <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
    <div className="lg:col-span-8">{list}</div>
    <aside className="relative lg:col-span-4">{rail}</aside>
  </div>
);

const CartLoadingState = () => (
  <CartFrame
    list={
      <div className="rounded-sm border border-textColor/10 bg-white/50 p-6 shadow-lg backdrop-blur-[20px] md:p-8">
        <CartListSkeleton />
      </div>
    }
    rail={<OrderSummarySkeleton />}
  />
);

const CartErrorState = ({ onRetry }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-sm border border-textColor/10 bg-white/50 px-6 py-20 text-center shadow-lg backdrop-blur-[20px]">
    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-red-200 bg-red-50">
      <AlertTriangle size={30} className="stroke-red-400" />
    </div>
    <h3 className="mb-4 text-2xl font-medium tracking-tight text-textColor md:text-3xl">
      We could not open your selection
    </h3>
    <p className="mb-10 max-w-md font-light leading-relaxed text-stone-500">
      Something interrupted this request. Nothing was lost — please try again.
    </p>
    <Button
      onClick={onRetry}
      className="group h-14 min-w-[12rem] rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90"
    >
      <Button.Border1 className="z-[1] border-accentColor2/30" />
      <Button.Border2 className="z-[2] border-accentColor2/30" />
      <Button.Title className="flex items-center gap-x-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor">
        <RotateCcw size={14} className="stroke-bgColor" />
        Try Again
      </Button.Title>
    </Button>
  </div>
);

const CartEmptyState = () => (
  <div className="flex w-full flex-col items-center justify-center py-24 text-center">
    <div className="relative mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-textColor/10 bg-textColor/5">
      <ShoppingBag size={40} className="stroke-accentColor/30" />
      <div className="absolute right-0 top-0 h-4 w-4 rounded-full bg-accentColor2 opacity-50 blur-sm" />
    </div>
    <h3 className="mb-4 text-2xl font-medium tracking-tight text-textColor md:text-3xl">
      Your Selection is Empty
    </h3>
    <p className="mx-auto mb-10 max-w-sm font-light leading-relaxed text-stone-500">
      Nothing is waiting in your selection yet. Explore the boutique and let a
      tray of artisanal treats travel to your door.
    </p>

    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Button
        href="/products"
        className="group h-14 min-w-[14rem] rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90"
      >
        <Button.Border1 className="z-[1] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
        <Button.Border2 className="z-[2] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
        <Button.Title className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor">
          Start Shopping
        </Button.Title>
      </Button>

      <Button
        href="/wishlist"
        className="group h-14 min-w-[12rem] rounded-sm border border-textColor/15 transition-all duration-300 hover:bg-textColor/5"
      >
        <Button.Title className="flex items-center gap-x-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-stone-500">
          <Heart size={14} className="stroke-accentColor/60" />
          Your Library
        </Button.Title>
      </Button>
    </div>

    <div className="mt-16 flex items-center gap-x-4 opacity-20">
      <div className="h-px w-8 bg-textColor" />
      <span className="text-[0.5rem] font-black uppercase tracking-[0.5em]">
        Baking Tales
      </span>
      <div className="h-px w-8 bg-textColor" />
    </div>
  </div>
);

/**
 * The selection itself: every row the API returned, a live count of what is in
 * it, and the boutique's own loading / error / empty states.
 *
 * `GET /cart/user` is the single source — items, campaign-aware prices, stock
 * and totals all come from that one response — and every write (quantity,
 * removal) invalidates `["cart"]`, so the rows and the rail can never disagree.
 */
const CartContainer = () => {
  const { data, isPending, isError, isFetching, refetch } = useCarts();

  const items = data?.data?.items ?? [];
  const rows = items.length;
  const pieces = data?.data?.totals?.totalItems ?? cartItemCount(items);
  const subtotal = data?.data?.totals?.totalAmount ?? cartSubtotal(items);

  if (isPending) return <CartLoadingState />;
  if (isError) return <CartErrorState onRetry={refetch} />;
  if (rows === 0) return <CartEmptyState />;

  return (
    <CartFrame
      list={
        <section className="flex w-full flex-col">
          <div className="mb-8 flex w-full items-center gap-x-6">
            <span className="whitespace-nowrap text-[0.6rem] font-black uppercase tracking-[0.4em] text-stone-500">
              {pieces} {pieces === 1 ? "Piece" : "Pieces"} Selected
            </span>
            <div className="h-[1px] flex-1 bg-textColor/10" />
            {isFetching && (
              <span className="whitespace-nowrap text-[0.55rem] font-black uppercase tracking-[0.3em] text-stone-400">
                Refreshing…
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full rounded-sm border border-textColor/10 bg-white/50 px-6 shadow-lg backdrop-blur-[20px] md:px-8"
          >
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </motion.div>

          <p className="mt-10 text-center text-[0.55rem] uppercase leading-loose tracking-[0.2em] text-stone-400">
            Prices reflect the boutique&apos;s live campaigns. Quantity is
            limited by the stock on hand, so nothing sells out between your
            selection and your order.
          </p>
        </section>
      }
      rail={<CartSummary rows={rows} pieces={pieces} subtotal={subtotal} />}
    />
  );
};

export default CartContainer;

