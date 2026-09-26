"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import {
  ORDER_PIPELINE,
  formatDateTime,
  isDeviation,
  statusReachedAt,
} from "./orderDisplay.js";

/**
 * The four stage rail (Placed → Paid → Shipped → Delivered), each stage stamped
 * with the moment the API's own status timeline recorded it, so a customer can
 * read the whole journey without opening anything. Stages an order never
 * reached stay hollow; the stage it sits on is the lit ruby dot.
 *
 * Cancelled / Failed orders have left the happy path, so they get a deviation
 * strip instead of a rail that would lie about where they are.
 */
const OrderProgress = ({ status, history = [] }) => {
  if (isDeviation(status)) {
    const failed = status === "Failed";
    const stamp = formatDateTime(statusReachedAt(history, status));

    return (
      <div
        className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-textColor/10 px-6 py-5 md:px-8 ${
          failed ? "bg-red-50/60" : "bg-stone-50/60"
        }`}
      >
        <XCircle
          size={16}
          className={`shrink-0 ${failed ? "stroke-red-500" : "stroke-stone-400"}`}
        />
        <p
          className={`text-[0.55rem] font-black uppercase tracking-[0.25em] ${
            failed ? "text-red-600" : "text-stone-500"
          }`}
        >
          {failed ? "Payment failed" : "Order cancelled"}
        </p>
        {stamp && (
          <p className="text-[0.55rem] font-medium uppercase tracking-[0.2em] text-stone-400">
            {stamp}
          </p>
        )}
        <p className="ml-auto hidden text-[0.5rem] font-black uppercase tracking-[0.3em] text-stone-400 sm:block">
          {history.length} {history.length === 1 ? "entry" : "entries"} recorded
        </p>
      </div>
    );
  }

  const reachedIndex = Math.max(
    0,
    ORDER_PIPELINE.findIndex((step) => step.status === status)
  );

  return (
    <ol className="flex items-start border-b border-textColor/10 px-6 py-6 md:px-8">
      {ORDER_PIPELINE.map((step, index) => {
        const done = index < reachedIndex;
        const current = index === reachedIndex;
        const stamp = formatDateTime(statusReachedAt(history, step.status));
        const lineLeft =
          index === 0
            ? "bg-transparent"
            : done || current
              ? "bg-accentColor/30"
              : "bg-textColor/10";
        const lineRight =
          index === ORDER_PIPELINE.length - 1
            ? "bg-transparent"
            : done
              ? "bg-accentColor/30"
              : "bg-textColor/10";

        return (
          <li
            key={step.status}
            className="flex flex-1 flex-col items-center gap-y-2 text-center"
          >
            <div className="flex w-full items-center">
              <span className={`h-[1px] flex-1 ${lineLeft}`} />
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                  done
                    ? "border-accentColor bg-accentColor/10"
                    : current
                      ? "border-accentColor bg-accentColor ring-4 ring-accentColor/10"
                      : "border-textColor/20 bg-bgColor"
                }`}
              >
                {done ? (
                  <CheckCircle2 size={12} className="stroke-accentColor" />
                ) : (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      current ? "bg-bgColor" : "bg-textColor/15"
                    }`}
                  />
                )}
              </span>
              <span className={`h-[1px] flex-1 ${lineRight}`} />
            </div>

            <span
              className={`text-[0.5rem] font-black uppercase tracking-[0.2em] sm:text-[0.55rem] ${
                current
                  ? "text-accentColor"
                  : done
                    ? "text-textColor"
                    : "text-stone-400"
              }`}
            >
              {step.label}
            </span>
            <span className="hidden text-[0.5rem] font-medium uppercase tracking-[0.15em] text-stone-400 sm:block">
              {stamp || step.note}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderProgress;
