"use client";

import useCoupons from "@/hooks/useCoupons.js";
import {
  couponDiscountAmount,
  couponEligibility,
  couponSavingLabel,
  formatTaka,
} from "@/libs/orderTotals.js";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

/**
 * Artisanal Rewards — the storefront's coupon till.
 *
 * Two ways in: a private code typed by hand, or one of the boutique's active
 * coupons (`GET /coupon?isActive=true`, readable by signed-in customers). The
 * discount is never invented here: `POST /coupon/validate` is asked with
 * `{ code, amount }` and its answer is what the rail prices against, so the
 * storefront can only show what the order endpoint will apply.
 *
 * Coupons the wall already knows are impossible (expired, fully redeemed, or a
 * minimum this selection does not reach) are listed WITH the reason rather than
 * hidden — no dead ends and no failed round trip. Targeting rules (new /
 * dormant / named customers) belong to the API, so those stay offerable and are
 * judged when the order is placed.
 */
const CouponPanel = ({ subtotal = 0, appliedCoupon, onApply, onRemove }) => {
  const { useActiveCoupons, useValidateCoupon } = useCoupons();
  const { data: activeCoupons } = useActiveCoupons();
  const validateCoupon = useValidateCoupon();

  const [manualCode, setManualCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const coupons = useMemo(() => {
    const list = Array.isArray(activeCoupons) ? activeCoupons : [];

    return list
      .map((coupon) => ({
        coupon,
        ...couponEligibility(coupon, subtotal),
        saving: couponDiscountAmount(coupon, subtotal),
      }))
      .sort((a, b) => {
        if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
        return b.saving - a.saving;
      });
  }, [activeCoupons, subtotal]);

  const applyCode = (code) => {
    const clean = String(code ?? "").trim().toUpperCase();
    if (!clean) return;

    setCouponError("");
    validateCoupon.mutate(
      { code: clean, amount: subtotal },
      {
        onSuccess: (coupon) => {
          onApply(coupon);
          toast.success(`Reward "${coupon?.code ?? clean}" applied`);
          setManualCode("");
        },
        onError: (error) => {
          setCouponError(error.response?.data?.message || "Invalid coupon code");
        },
      }
    );
  };

  return (
    <section>
      <div className="mb-8 flex items-center gap-x-6">
        <span className="whitespace-nowrap text-[0.6rem] font-black uppercase tracking-[0.4em] text-stone-600">
          02 — Artisanal Rewards
        </span>
        <div className="h-[1px] flex-1 bg-textColor/10" />
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-4 rounded-sm border border-accentColor/20 bg-accentColor/10 p-6">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accentColor/20 bg-bgColor/60">
              <Check size={16} className="stroke-accentColor" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.7rem] font-black uppercase tracking-widest text-accentColor">
                {appliedCoupon.code}
              </p>
              <p className="mt-1 text-[0.55rem] uppercase tracking-widest text-stone-500">
                {couponSavingLabel(appliedCoupon)} · saving{" "}
                {formatTaka(couponDiscountAmount(appliedCoupon, subtotal))}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onRemove();
              setCouponError("");
            }}
            aria-label={`Remove reward ${appliedCoupon.code}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accentColor/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentColor/40"
          >
            <X size={16} className="stroke-accentColor" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Private code */}
          <div>
            <div className="flex gap-4">
              <input
                type="text"
                autoComplete="off"
                placeholder="ENTER PRIVATE CODE"
                aria-label="Coupon code"
                value={manualCode}
                onChange={(event) => {
                  setManualCode(event.target.value.toUpperCase());
                  if (couponError) setCouponError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyCode(manualCode);
                  }
                }}
                className="min-w-0 flex-1 rounded-sm border border-textColor/15 bg-white/80 px-6 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-textColor transition-all placeholder:text-stone-400 focus:border-accentColor focus:outline-0"
              />
              <button
                type="button"
                onClick={() => applyCode(manualCode)}
                disabled={!manualCode.trim() || validateCoupon.isPending}
                className="min-w-[7rem] shrink-0 border border-textColor/15 bg-white/70 px-6 text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-600 transition-all hover:border-accentColor/40 hover:text-accentColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentColor/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {validateCoupon.isPending ? "Checking…" : "Apply"}
              </button>
            </div>

            {couponError && (
              <p className="mt-4 text-[0.6rem] font-bold uppercase tracking-wider text-red-500">
                {couponError}
              </p>
            )}
          </div>

          {/* The boutique's active rewards */}
          {coupons.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {coupons.map(({ coupon, eligible, reason, saving }) => (
                <button
                  key={coupon.id}
                  type="button"
                  disabled={!eligible || validateCoupon.isPending}
                  onClick={() => applyCode(coupon.code)}
                  className="group relative overflow-hidden rounded-sm border border-textColor/10 bg-white/60 p-5 text-left transition-all hover:border-accentColor/40 hover:bg-accentColor/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentColor/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-textColor/10 disabled:hover:bg-white/60"
                >
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-stone-500 transition-colors group-hover:text-accentColor">
                    {coupon.code}
                  </p>
                  <p className="mt-2 text-[0.5rem] uppercase tracking-widest text-stone-600">
                    {couponSavingLabel(coupon)}
                  </p>
                  <p className="mt-3 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-accentColor">
                    {!eligible
                      ? reason
                      : saving > 0
                        ? `Save ${formatTaka(saving)}`
                        : "No saving on this selection"}
                  </p>
                  <span className="pointer-events-none absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-accentColor/5 blur-xl transition-colors group-hover:bg-accentColor/10" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CouponPanel;
