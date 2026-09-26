"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, PackageCheck, Loader2, PartyPopper } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import usePendingReviews from "@/hooks/usePendingReviews.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";

const dismissKey = (p) => `rt-dismissed-${p.orderId}-${p.productId}`;

/** The auto popup stays out of these funnels — never interrupt them. */
const HIDDEN_PATH_PREFIXES = ["/auth", "/checkout"];

const ReviewPromptModal = ({ item = null, onClose = null }) => {
  const pathname = usePathname();
  const { data: pending = [], isLoading } = usePendingReviews();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [, force] = useState(0);

  // Controlled mode (order history) targets one specific item on demand.
  const isControlled = Boolean(item);

  // Auto mode shows up wherever the signed-in customer lands, except the
  // auth flows and the checkout funnel where an interruption would hurt.
  if (!isControlled && HIDDEN_PATH_PREFIXES.some((p) => pathname?.startsWith(p)))
    return null;

  let current = item;
  let currentIdx = -1;

  if (!isControlled) {
    if (isLoading || !pending.length) return null;

    for (let i = 0; i < pending.length; i++) {
      const idx = (index + i) % pending.length;
      try {
        if (!sessionStorage.getItem(dismissKey(pending[idx]))) {
          current = pending[idx];
          currentIdx = idx;
          break;
        }
      } catch {
        current = pending[idx];
        currentIdx = idx;
        break;
      }
    }
    if (!current) return null;
  }

  const dismiss = (remember = true) => {
    try {
      if (remember) sessionStorage.setItem(dismissKey(current), "1");
    } catch {}
    setRating(5);
    setComment("");
    setDone(false);
    setHover(0);
    if (isControlled) {
      // Explicit flow from the order archive — just hand control back.
      onClose?.();
      return;
    }
    if (pending.length > 1) setIndex((currentIdx + 1) % pending.length);
    else force((v) => v + 1);
  };

  const submit = async () => {
    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("rating", String(rating));
      form.append("comment", comment.trim());
      form.append("orderId", String(current.orderId));
      form.append("productId", String(current.productId));
      await axiosPrivate.post("/review", form, { withCredentials: true });
      toast.success("Thank you! Your tasting note was shared.");
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      setDone(true);
      setTimeout(() => dismiss(true), 1600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={`${current.orderId}-${current.productId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-textColor/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label={`Review ${current.productTitle}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-2xl bg-bgColor border border-textColor/10 shadow-2xl overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-textColor/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accentColor/10 text-accentColor">
                {done ? (
                  <PartyPopper className="h-5 w-5" />
                ) : (
                  <PackageCheck className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-accentColor">
                  Order {current.orderNumber} · Delivered
                </p>
                <h3 className="font2 text-lg font-medium text-textColor leading-tight">
                  {done ? "Thank you!" : "How was your treat?"}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(true)}
              aria-label="Dismiss review prompt"
              className="rounded-full p-1.5 text-textColor/50 hover:text-accentColor hover:bg-accentColor/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body: product, star rating, tasting note, actions */}
          <div className="px-6 py-5">
            <p className="text-sm font-semibold text-textColor leading-snug">
              {current.productTitle}
            </p>

            {done ? (
              <div className="py-6 text-center">
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Your tasting note now helps other pastry lovers choose with
                  confidence. It will appear on the product page once approved.
                </p>
              </div>
            ) : (
              <>
                {/* Star Rating */}
                <div className="mt-4 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-label={`Rate ${v} star${v > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(v)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(v)}
                      className="transition-transform duration-150 hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          (hover || rating) >= v
                            ? "fill-accentColor text-accentColor"
                            : "fill-transparent text-stone-300"
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-[11px] font-bold uppercase tracking-widest text-textColor/50">
                    {hover || rating} / 5
                  </span>
                </div>

                {/* Tasting Note */}
                <label className="mt-4 block">
                  <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-stone-500">
                    Your tasting note
                  </span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="How was the freshness, flavour and presentation?"
                    className="mt-2 w-full resize-none rounded-md border border-textColor/15 bg-white/80 px-3 py-2.5 text-sm text-textColor placeholder:text-stone-400 font-light leading-relaxed focus:outline-none focus:border-accentColor/50 focus:ring-1 focus:ring-accentColor/30 transition-colors"
                  />
                </label>
                <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-stone-400">
                  <span>Minimum 10 characters</span>
                  <span className="tabular-nums">{comment.trim().length}/500</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => dismiss(true)}
                    className="h-11 px-4 rounded-sm border border-textColor/15 text-xs font-bold uppercase tracking-[0.18em] text-textColor/60 hover:text-textColor hover:border-textColor/30 transition-colors"
                  >
                    Later
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="flex-1 h-11 rounded-sm bg-accentColor text-bgColor text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-accentColor/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Star className="h-3.5 w-3.5 fill-bgColor stroke-bgColor" />
                        <span>Share review</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewPromptModal;
