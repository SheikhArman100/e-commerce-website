"use client";

import Button from "@/Components/Button.js";
import {
  DELIVERY_CHARGE,
  formatTaka,
  summariseOrder,
} from "@/libs/orderTotals.js";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

/**
 * The selection's till rail: what the API currently says the cart is worth.
 *
 * `subtotal` is the API's own `totals.totalAmount` (campaign-aware unit prices ×
 * quantities), and delivery is the same constant the order endpoint charges, so
 * the figure here is what the check-out rail will open with. Rewards are the one
 * thing that can still move it — coupons are validated against the signed-in
 * customer on the check-out page — so the total is labelled as an estimate.
 */
const CartSummary = ({ rows = 0, pieces = 0, subtotal = 0 }) => {
  const { delivery, payable } = summariseOrder({ subtotal });

  return (
    <div className="sticky top-32 rounded-sm border border-textColor/10 bg-white/50 p-10 shadow-2xl backdrop-blur-[20px]">
      <div className="mb-10 flex items-center gap-x-3">
        <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-stone-500">
          Order Summary
        </span>
      </div>

      <dl className="flex flex-col gap-6 border-b border-textColor/10 pb-10">
        <div className="flex items-center justify-between">
          <dt className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">
            {pieces} {pieces === 1 ? "Piece" : "Pieces"} · {rows}{" "}
            {rows === 1 ? "Creation" : "Creations"}
          </dt>
          <dd className="text-[0.8rem] font-medium tracking-widest text-textColor/80">
            {formatTaka(subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-x-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">
            <Truck size={13} className="stroke-stone-400" />
            Boutique Delivery
          </dt>
          <dd className="text-[0.8rem] font-medium tracking-widest text-textColor/80">
            {formatTaka(delivery)}
          </dd>
        </div>
      </dl>

      <div className="flex items-end justify-between pt-10">
        <div>
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-stone-500">
            Estimated Total
          </p>
          <p className="mt-2 text-[0.5rem] font-medium uppercase tracking-[0.2em] text-stone-400">
            Rewards applied at check-out
          </p>
        </div>
        <span className="text-2xl font-light tracking-tighter text-textColor">
          {formatTaka(payable)}
        </span>
      </div>

      <Button
        href="/checkout"
        className="group mt-12 h-16 w-full rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90"
      >
        <Button.Border1 className="z-[1] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
        <Button.Border2 className="z-[2] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
        <Button.Title className="text-[0.75rem] font-black uppercase tracking-[0.3em] text-bgColor">
          Proceed to Check-Out
        </Button.Title>
        <Button.Icon>
          <ArrowRight
            size={18}
            className="stroke-bgColor transition-transform duration-500 group-hover:translate-x-1"
          />
        </Button.Icon>
      </Button>

      <div className="mt-8 flex flex-col items-center gap-y-3">
        <p className="flex items-center gap-x-2 text-[0.55rem] uppercase tracking-[0.2em] text-stone-500">
          <ShieldCheck size={13} className="stroke-accentColor/60" />
          Secure boutique payment processing
        </p>
        <p className="text-center text-[0.5rem] uppercase leading-loose tracking-[0.2em] text-stone-400">
          Delivery within {formatTaka(DELIVERY_CHARGE)} across Bangladesh.
          <br />
          Every status change is emailed to you as it happens.
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
