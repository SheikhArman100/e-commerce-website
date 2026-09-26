"use client";

import { cn } from "@/libs/utils.js";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, PackageSearch, Star } from "lucide-react";
import Image from "next/image.js";
import Link from "next/link.js";
import { useState } from "react";
import OrderProgress from "./OrderProgress.js";
import {
  formatAmount,
  formatDate,
  orderItemFlavor,
  orderItemImage,
  orderItemLine,
  orderItemSize,
  orderItemTitle,
  orderPayable,
  orderReference,
  orderTotalQuantity,
  paymentLabel,
  paymentTone,
  softFlavorTint,
  statusTone,
} from "./orderDisplay.js";

/** Rows shown before the "view more" toggle takes over. */
const COLLAPSED_ITEMS = 3;

/**
 * One purchased delicacy: thumbnail with its quantity badge, the snapshot of
 * what was bought (title / flavour / size / unit price) and the line total.
 * Delivered items still awaiting a review get an inline "Write review" button
 * that opens the shared review modal for that exact order/product pair.
 */
const OrderItemRow = ({ item, order, pending = [], onReview }) => {
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const image = orderItemImage(item);
  const [imageFailed, setImageFailed] = useState(false);
  const flavor = orderItemFlavor(item);
  const size = orderItemSize(item);
  const quantity = Number(item?.quantity ?? 1);
  const title = orderItemTitle(item);
  const href = item?.product?.slug ? `/products/${item.product.slug}` : null;
  const tint = softFlavorTint(flavor.color);
  const showImage = Boolean(image) && !imageFailed;
  const reviewTarget = pending.find(
    (p) => Number(p.orderId) === Number(order?.id) && Number(p.productId) === Number(item?.productId),
  );

  return (
    <div className="group/item flex items-center gap-x-4 py-4 md:gap-x-6">
      {/* Thumbnail + quantity badge */}
      <div className="relative shrink-0">
        <div className="relative aspect-square w-14 overflow-hidden rounded-sm border border-textColor/10 bg-white shadow-inner transition-colors group-hover/item:border-accentColor/30 md:w-16">
          {showImage ? (
            <Image
              src={`${fileBase}/${image}`}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-700 group-hover/item:scale-110"
              alt={title}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center"
              style={tint ? { backgroundColor: tint } : undefined}
            >
              <PackageSearch
                size={16}
                style={{ color: flavor.color || "#9B2242", opacity: 0.55 }}
              />
            </span>
          )}
        </div>
        <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accentColor text-[0.55rem] font-black text-bgColor shadow-lg">
          {quantity}
        </span>
      </div>

      {/* Snapshot details */}
      <div className="min-w-0 flex-1 text-left">
        {href ? (
          <Link
            href={href}
            className="line-clamp-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-textColor transition-colors hover:text-accentColor"
          >
            {title}
          </Link>
        ) : (
          <p className="line-clamp-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-textColor">
            {title}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {flavor.name && (
            <span className="flex items-center gap-x-2 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-stone-500">
              {flavor.color && (
                <span
                  className="h-2 w-2 rounded-full border border-textColor/20"
                  style={{ backgroundColor: flavor.color }}
                />
              )}
              {flavor.name}
            </span>
          )}
          {size && (
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-accentColor">
              Size {size}
            </span>
          )}
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.2em] text-stone-400">
            {formatAmount(item?.price)} each
          </span>
          {reviewTarget && (
            <button
              type="button"
              onClick={() => onReview?.(reviewTarget)}
              className="flex items-center gap-x-1.5 rounded-full border border-accentColor/30 px-3 py-1 text-[0.5rem] font-black uppercase tracking-[0.2em] text-accentColor transition-colors hover:bg-accentColor hover:text-bgColor"
            >
              <Star size={10} className="fill-current" />
              Write review
            </button>
          )}
        </div>
      </div>

      <p className="shrink-0 text-[0.75rem] font-bold tracking-[0.15em] text-textColor">
        {formatAmount(orderItemLine(item))}
      </p>
    </div>
  );
};

/**
 * One past order: reference + date, payment/status pills, the four stage rail,
 * the purchased delicacies, and the money breakdown that closed the order.
 *
 * Orders with many items stay scannable — only the first rows show until the
 * customer asks for the rest.
 */
const OrderCard = ({ order, index = 0, pending = [], onReview }) => {
  const [expanded, setExpanded] = useState(false);

  const items = order?.items ?? [];
  const hiddenItems = Math.max(0, items.length - COLLAPSED_ITEMS);
  const visibleItems = expanded ? items : items.slice(0, COLLAPSED_ITEMS);

  const payable = orderPayable(order);
  const discount = Number(order?.discountAmount ?? 0);
  const paid = order?.paymentStatus === "PAID";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.08, ease: "easeOut" }}
      className="w-full overflow-hidden rounded-sm border border-textColor/10 bg-white/50 shadow-lg backdrop-blur-[20px] transition-all duration-500 hover:border-accentColor/25 hover:shadow-xl"
    >
      {/* Reference, date, payment + status */}
      <header className="flex flex-col gap-5 border-b border-textColor/10 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[0.5rem] font-black uppercase tracking-[0.45em] text-stone-400">
            Order
          </span>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-textColor md:text-base">
            {orderReference(order)}
          </h3>
          <p className="flex items-center gap-x-2 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-stone-500">
            <CalendarDays size={11} className="shrink-0 stroke-stone-400" />
            {formatDate(order?.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span
            className={cn(
              "flex items-center gap-x-2 text-[0.55rem] font-black uppercase tracking-[0.25em]",
              paymentTone(order?.paymentStatus)
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                paid ? "bg-accentColor" : "bg-current opacity-50"
              )}
            />
            {paymentLabel(order?.paymentStatus)}
          </span>

          <span
            className={cn(
              "rounded-full border px-4 py-1.5 text-[0.55rem] font-black uppercase tracking-[0.25em]",
              statusTone(order?.status)
            )}
          >
            {order?.status}
          </span>
        </div>
      </header>

      {/* Where the order stands */}
      <OrderProgress status={order?.status} history={order?.statusHistory} />

      {/* What was bought */}
      {items.length > 0 ? (
        <div className="px-6 md:px-8">
          <div className="flex flex-col divide-y divide-textColor/10">
            {visibleItems.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                order={order}
                pending={pending}
                onReview={onReview}
              />
            ))}
          </div>

          {hiddenItems > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className="flex w-full items-center justify-center gap-x-2 border-t border-textColor/10 py-4 text-[0.55rem] font-black uppercase tracking-[0.3em] text-accentColor transition-colors hover:text-accentColor/70"
            >
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-300", expanded && "rotate-180")}
              />
              {expanded
                ? "Show fewer items"
                : `View ${hiddenItems} more ${hiddenItems === 1 ? "item" : "items"}`}
            </button>
          )}
        </div>
      ) : (
        <p className="px-6 py-8 text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 md:px-8">
          No items were recorded for this order.
        </p>
      )}

      {/* Money breakdown */}
      <footer className="flex flex-col gap-6 border-t border-textColor/10 bg-textColor/[0.02] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <dl className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1 text-left">
            <dt className="text-[0.5rem] font-black uppercase tracking-[0.35em] text-stone-400">
              Items
            </dt>
            <dd className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-textColor">
              {orderTotalQuantity(items)}
            </dd>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <dt className="text-[0.5rem] font-black uppercase tracking-[0.35em] text-stone-400">
              Delivery
            </dt>
            <dd className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-textColor">
              {formatAmount(order?.deliveryCharge)}
            </dd>
          </div>

          {discount > 0 && (
            <div className="flex flex-col gap-1 text-left">
              <dt className="text-[0.5rem] font-black uppercase tracking-[0.35em] text-stone-400">
                Reward
              </dt>
              <dd className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accentColor">
                -{formatAmount(discount)}
              </dd>
            </div>
          )}

          <div className="flex flex-col gap-1 text-left">
            <dt className="text-[0.5rem] font-black uppercase tracking-[0.35em] text-stone-400">
              Subtotal
            </dt>
            <dd className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-textColor">
              {formatAmount(order?.totalAmount)}
            </dd>
          </div>
        </dl>

        <div className="flex items-baseline gap-x-4 md:justify-end">
          <span className="text-[0.55rem] font-black uppercase tracking-[0.35em] text-stone-500">
            {paid ? "Total Paid" : "Order Total"}
          </span>
          <span className="text-xl font-light tracking-tighter text-textColor md:text-2xl">
            {formatAmount(payable)}
          </span>
        </div>
      </footer>
    </motion.article>
  );
};

export default OrderCard;

