"use client";

import Button from "@/Components/Button.js";
import Pagination from "@/Components/Pagination.js";
import ReviewPromptModal from "@/Components/ReviewPromptModal.js";
import { OrdersListSkeleton } from "@/Components/Skeleton.js";
import useOrders from "@/hooks/useOrders.js";
import usePendingReviews from "@/hooks/usePendingReviews.js";
import { AlertTriangle, PackageSearch, RotateCcw } from "lucide-react";
import { useState } from "react";
import OrderCard from "./OrderCard.js";

/** Orders per page — enough to feel like an archive, short enough to scan. */
const ORDERS_PER_PAGE = 6;

const OrderErrorState = ({ onRetry }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-sm border border-textColor/10 bg-white/50 px-6 py-20 text-center shadow-lg backdrop-blur-[20px]">
    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-red-200 bg-red-50">
      <AlertTriangle size={30} className="stroke-red-400" />
    </div>
    <h3 className="mb-4 text-2xl font-medium tracking-tight text-textColor md:text-3xl">
      We could not reach your archive
    </h3>
    <p className="mb-10 max-w-md font-light leading-relaxed text-stone-500">
      Something interrupted this request. Your orders are safe — please try again.
    </p>
    <Button
      onClick={onRetry}
      className="h-14 min-w-[12rem] rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90 group"
    >
      <Button.Border1 className="border-accentColor2/30 z-[1]" />
      <Button.Border2 className="border-accentColor2/30 z-[2]" />
      <Button.Title className="flex items-center gap-x-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor">
        <RotateCcw size={14} className="stroke-bgColor" />
        Try Again
      </Button.Title>
    </Button>
  </div>
);

const OrderEmptyState = () => (
  <div className="flex w-full flex-col items-center justify-center py-24 text-center">
    <div className="relative mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-textColor/10 bg-textColor/5">
      <PackageSearch size={40} className="stroke-accentColor/30" />
      <div className="absolute right-0 top-0 h-4 w-4 rounded-full bg-accentColor2 opacity-50 blur-sm" />
    </div>
    <h3 className="mb-4 text-2xl font-medium tracking-tight text-textColor md:text-3xl">
      No Orders Yet
    </h3>
    <p className="mx-auto mb-10 max-w-sm font-light leading-relaxed text-stone-500">
      Your archive opens with your first order. Explore the boutique and let a tray of
      artisanal treats travel to your door.
    </p>
    <Button
      href="/products"
      className="h-14 min-w-[14rem] rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90 group"
    >
      <Button.Border1 className="border-accentColor2/30 z-[1] transition-transform group-hover:scale-x-105" />
      <Button.Border2 className="border-accentColor2/30 z-[2] transition-transform group-hover:scale-x-105" />
      <Button.Title className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor">
        Start Shopping
      </Button.Title>
    </Button>
    <div className="mt-16 flex items-center gap-x-4 opacity-20">
      <div className="h-px w-8 bg-textColor" />
      <span className="text-[0.5rem] font-black uppercase tracking-[0.5em]">Baking Tales</span>
      <div className="h-px w-8 bg-textColor" />
    </div>
  </div>
);

/**
 * The archive itself: paged order cards, a live count of what is on record, and
 * the boutique's own loading / error / empty states.
 */
const OrderContainer = () => {
  const [page, setPage] = useState(1);
  const [reviewTarget, setReviewTarget] = useState(null);
  const { data, isPending, isError, isFetching, refetch } = useOrders(page, ORDERS_PER_PAGE);
  const { data: pendingReviews = [] } = usePendingReviews();

  const orders = data?.orders ?? [];
  const meta = data?.meta;
  const recorded = meta?.count ?? orders.length;
  const totalPages = Math.max(1, Math.ceil((meta?.count ?? 0) / ORDERS_PER_PAGE));

  if (isPending) return <OrdersListSkeleton />;
  if (isError) return <OrderErrorState onRetry={refetch} />;
  if (orders.length === 0) return <OrderEmptyState />;

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="flex w-full flex-col items-center">
      <div className="mb-10 flex w-full items-center gap-x-6">
        <span className="whitespace-nowrap text-[0.6rem] font-black uppercase tracking-[0.4em] text-stone-500">
          {recorded} {recorded === 1 ? "Order" : "Orders"} On Record
        </span>
        <div className="h-[1px] flex-1 bg-textColor/10" />
        {isFetching && (
          <span className="whitespace-nowrap text-[0.55rem] font-black uppercase tracking-[0.3em] text-stone-400">
            Refreshing…
          </span>
        )}
      </div>

      <div className="flex w-full flex-col gap-8">
        {orders.map((order, index) => (
          <OrderCard
            key={order.id}
            order={order}
            index={index}
            pending={pendingReviews}
            onReview={setReviewTarget}
          />
        ))}
      </div>

      {/* Explicit "Write review" flow for a chosen delivered item; hidden
          unless asked for so the global auto prompt stays the only one. */}
      {reviewTarget && (
        <ReviewPromptModal
          item={reviewTarget}
          onClose={() => setReviewTarget(null)}
        />
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />

      <p className="mt-10 max-w-lg text-center text-[0.55rem] uppercase leading-loose tracking-[0.2em] text-stone-400">
        Orders awaiting payment stay marked as payment pending. Every status change is
        emailed to you as it happens.
      </p>
    </section>
  );
};

export default OrderContainer;
