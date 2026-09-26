"use client";

import Button from "@/Components/Button.js";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Ban, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation.js";
import { useEffect } from "react";

/**
 * One look for all three gateway landings (`/checkout/success|fail|cancel`).
 *
 * The API redirects here with `?tran_id=` (its own transaction reference) and
 * the outcome is decided by which callback fired — `/payment/success` creates the
 * order items, decrements stock and clears the cart; `/payment/fail` and
 * `/payment/cancel` roll the incomplete shell order back. So the copy here
 * promises only what the API actually did, and each page points somewhere useful
 * next instead of dead-ending the customer.
 *
 * `refreshCart` is set by the success page: the cart was emptied server side, so
 * the cached `["cart"]` is dropped and the header badge cannot keep showing a
 * selection that no longer exists.
 */
const TONES = {
  success: { icon: BadgeCheck, ring: "bg-green-50", stroke: "stroke-green-500" },
  fail: { icon: XCircle, ring: "bg-red-50", stroke: "stroke-red-500" },
  cancel: { icon: Ban, ring: "bg-amber-50", stroke: "stroke-amber-500" },
};

const CheckoutResult = ({
  tone = "success",
  title,
  message,
  notes = [],
  actions = [],
  refreshCart = false,
}) => {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!refreshCart) return;
    queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
  }, [refreshCart, queryClient]);

  const { icon: Icon, ring, stroke } = TONES[tone] ?? TONES.success;

  return (
    <article className="relative flex w-full min-h-screen flex-col items-center overflow-hidden bg-bgColor px-6 pt-24 pb-20 md:px-12 lg:px-24">
      {/* Atmospheric Background Glows */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accentColor/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accentColor/[0.03] blur-[100px]" />

      <div className="relative z-10 flex w-full max-w-[640px] min-h-[70vh] flex-col items-center justify-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full">
          <span className={`flex h-20 w-20 items-center justify-center rounded-full ${ring}`}>
            <Icon size={44} className={stroke} />
          </span>
        </div>

        <h1 className="text-center text-4xl font-light leading-tight tracking-tighter text-textColor md:text-5xl">
          {title}
        </h1>

        <div className="mt-8 h-[1px] w-12 bg-accentColor opacity-50" />

        <p className="mt-8 max-w-md text-center text-[0.65rem] uppercase leading-relaxed tracking-[0.2em] text-stone-500">
          {message}
        </p>

        {tranId && (
          <p className="mt-6 text-center text-[0.55rem] uppercase tracking-[0.2em] text-stone-400">
            Transaction Reference:{" "}
            <span className="font-mono normal-case text-stone-500">{tranId}</span>
          </p>
        )}

        {notes.length > 0 && (
          <ul className="mt-12 flex w-full flex-col gap-4 border-y border-textColor/10 py-8">
            {notes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-x-3 text-[0.6rem] uppercase leading-relaxed tracking-[0.15em] text-stone-500"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accentColor/60" />
                {note}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {actions.map((action) =>
            action.primary ? (
              <Button
                key={action.href}
                href={action.href}
                className="group h-14 w-full min-w-[12rem] rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90 sm:w-auto"
              >
                <Button.Border1 className="z-[1] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
                <Button.Border2 className="z-[2] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
                <Button.Title className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor">
                  {action.label}
                </Button.Title>
              </Button>
            ) : (
              <Button
                key={action.href}
                href={action.href}
                className="group h-14 w-full min-w-[12rem] rounded-sm border border-textColor/15 transition-all duration-300 hover:bg-textColor/5 sm:w-auto"
              >
                <Button.Title className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-stone-600">
                  {action.label}
                </Button.Title>
              </Button>
            )
          )}
        </div>
      </div>
    </article>
  );
};

export default CheckoutResult;
