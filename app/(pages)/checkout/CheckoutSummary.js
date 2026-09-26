"use client";

import ProductThumb from "@/Components/ProductThumb.js";
import {
  cartItemCount,
  formatTaka,
  summariseOrder,
  unitPrice,
} from "@/libs/orderTotals.js";
import { Ticket, Truck } from "lucide-react";

/**
 * The check-out rail: the selection recapped, then the money the gateway is
 * about to charge.
 *
 * Every figure comes from `libs/orderTotals.js`, which mirrors the API's own
 * arithmetic — including the two coupon caps the old rail ignored (a PERCENTAGE
 * coupon's `maxDiscountAmount` and a FIXED coupon never exceeding the subtotal).
 * That is the difference between a total the customer agrees to and a total that
 * surprises them at the gateway.
 *
 * The submit button arrives as `children` so the rail stays sticky as one unit.
 */
const CheckoutSummary = ({
  items = [],
  subtotal = 0,
  coupon = null,
  children,
}) => {
  const pieces = cartItemCount(items);
  const { discount, delivery, payable } = summariseOrder({ subtotal, coupon });

  return (
    <div className="rounded-sm border border-textColor/10 bg-white/60 p-8 shadow-lg backdrop-blur-[20px] md:p-10">
      <div className="mb-8 flex items-center gap-x-3">
        <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-stone-600">
          Your Selection
        </span>
        <div className="h-[1px] flex-1 bg-textColor/10" />
        <span className="text-[0.5rem] font-black uppercase tracking-[0.25em] text-stone-400">
          {pieces} {pieces === 1 ? "Piece" : "Pieces"}
        </span>
      </div>

      <ul className="flex max-h-[42vh] flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => {
          const flavor = item?.productFlavorSize?.productFlavor?.flavor;
          const title = item?.product?.title;

          return (
            <li key={item.id} className="group/item flex items-center gap-x-4">
              <ProductThumb
                path={item?.productFlavorSize?.productFlavor?.images?.[0]?.path}
                alt={title}
                flavorColor={flavor?.color}
                sizes="48px"
                className="w-12"
                badge={
                  <span className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-accentColor text-[0.5rem] font-black text-bgColor shadow">
                    {item.quantity}
                  </span>
                }
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[0.6rem] font-black uppercase tracking-[0.2em] text-textColor">
                  {title}
                </p>
                <p className="mt-1 text-[0.5rem] font-medium uppercase tracking-[0.2em] text-stone-500">
                  {item.quantity} × {formatTaka(unitPrice(item))}
                  {item?.productFlavorSize?.size?.name
                    ? ` · ${item.productFlavorSize.size.name}`
                    : ""}
                </p>
              </div>

              <span className="shrink-0 text-[0.65rem] font-bold tracking-[0.15em] text-textColor">
                {formatTaka(unitPrice(item) * Number(item.quantity ?? 0))}
              </span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-8 flex flex-col gap-5 border-t border-textColor/10 pt-8">
        <div className="flex items-center justify-between">
          <dt className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-500">
            Subtotal
          </dt>
          <dd className="text-[0.75rem] font-medium tracking-widest text-textColor">
            {formatTaka(subtotal)}
          </dd>
        </div>

        {coupon && (
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-x-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-accentColor">
              <Ticket size={13} className="stroke-accentColor" />
              {coupon.code}
            </dt>
            <dd className="text-[0.75rem] font-medium tracking-widest text-accentColor">
              −{formatTaka(discount)}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-x-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-500">
            <Truck size={13} className="stroke-stone-400" />
            Boutique Delivery
          </dt>
          <dd className="text-[0.75rem] font-medium tracking-widest text-textColor">
            {formatTaka(delivery)}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex items-end justify-between border-t border-textColor/10 pt-8">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-stone-500">
          Payable Now
        </p>
        <span className="text-2xl font-light tracking-tighter text-textColor">
          {formatTaka(payable)}
        </span>
      </div>

      {children}
    </div>
  );
};

export default CheckoutSummary;
