/**
 * The storefront's single source of truth for cart / checkout money.
 *
 * Every number here mirrors a rule the API enforces when it creates the order
 * (`ecommerce-api/src/modules/order/order.service.ts` +
 * `cart/cart.service.ts`), because the storefront shows a total BEFORE the
 * order exists and must never advertise an amount the API will not charge:
 *
 *   • Unit price  — `salesPrice` is already campaign aware: the API picks
 *     whichever active campaign yields the LOWEST final price (PERCENTAGE takes
 *     `customDiscountPercentage ?? campaign.discountDefault`, FIXED is a flat
 *     amount off). `originalPrice` is the untouched variant price, so an item is
 *     only "on sale" when `salesPrice < originalPrice`.
 *   • Subtotal    — Σ salePrice × quantity, which is exactly the API's
 *     `totals.totalAmount` (and its `totalAmount` when building the order).
 *   • Reward      — PERCENTAGE is `subtotal × value / 100`, capped by the
 *     coupon's `maxDiscountAmount`; FIXED is the value, capped at the subtotal
 *     (a fixed discount can never turn the payable amount negative).
 *   • Delivery    — the API's `DELIVERY_CHARGE` env (`config.delivery_charge`).
 *     It is a storefront constant too because no public endpoint exposes it;
 *     keep the two in step.
 *   • Payable     — subtotal − reward + delivery, i.e. what the gateway charges.
 *
 * Deliberately a plain module (no hooks, no "use client") so server and client
 * components price identically.
 */

/** Mirror of the API's `DELIVERY_CHARGE`. */
export const DELIVERY_CHARGE = 60;

/** The API's currency. */
export const formatTaka = (value) => `৳${Number(value ?? 0).toFixed(2)}`;

/** Unit price the API will charge, with the raw price as a fallback. */
export const unitPrice = (item) =>
  Number(item?.salesPrice ?? item?.productFlavorSize?.price ?? 0);

/** Full price of one variant, before any campaign. */
export const listPrice = (item) => Number(item?.originalPrice ?? 0);

/** What one row costs: unit × quantity. */
export const lineTotal = (item) =>
  unitPrice(item) * Number(item?.quantity ?? 0);

/** True only when the campaign actually moved the price. */
export const isItemDiscounted = (item) => {
  const original = listPrice(item);
  return original > 0 && unitPrice(item) < original;
};

/** Rounded percent off, for the "-N%" chip. `0` when there is no discount. */
export const itemDiscountPercentage = (item) => {
  if (!isItemDiscounted(item)) return 0;
  return Math.round((1 - unitPrice(item) / listPrice(item)) * 100);
};

/** Pieces in the selection (not rows) — matches the API's `totals.totalItems`. */
export const cartItemCount = (items = []) =>
  items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);

/** Σ of every row — identical to the API's `totals.totalAmount`. */
export const cartSubtotal = (items = []) =>
  items.reduce((sum, item) => sum + lineTotal(item), 0);

/** Stock the API would accept for this row, when it told us. */
export const itemStock = (item) => {
  const stock = item?.productFlavorSize?.stock;
  return typeof stock === "number" ? stock : null;
};

/** The API's own ceiling on a single cart line. */
export const MAX_ITEM_QUANTITY = 10;

/** Stock left is worth flagging to a customer at or below this. */
export const LOW_STOCK_THRESHOLD = 3;

/* ─────────────────────────────── coupons ─────────────────────────────── */

/** Expiry is enforced by the API; the UI just hides what it would refuse. */
export const isCouponExpired = (coupon) =>
  Boolean(coupon?.expiryDate) && new Date(coupon.expiryDate) < new Date();

/** `usageLimit: null | 0` means unlimited (see coupon.service.ts). */
export const isCouponExhausted = (coupon) => {
  const limit = coupon?.usageLimit;
  if (!limit) return false;
  return Number(coupon.usedCount ?? 0) >= Number(limit);
};

/**
 * The exact discount the API will apply, in ৳ — the same branches as
 * `createOrderFromCart`, including both caps, so the check-out rail can never
 * disagree with the gateway.
 */
export const couponDiscountAmount = (coupon, subtotal) => {
  if (!coupon) return 0;
  const amount = Number(subtotal ?? 0);

  if (coupon.discountType === "PERCENTAGE") {
    let discount = (amount * Number(coupon.discountValue ?? 0)) / 100;
    const cap = Number(coupon.maxDiscountAmount ?? 0);
    if (cap > 0 && discount > cap) discount = cap;
    return Math.min(discount, amount);
  }

  return Math.min(Number(coupon.discountValue ?? 0), amount);
};

/** PERCENTAGE / FIXED described the way the panel and the till row show it. */
export const couponSavingLabel = (coupon) => {
  if (!coupon) return "";
  return coupon.discountType === "PERCENTAGE"
    ? `${coupon.discountValue}% off`
    : `${formatTaka(coupon.discountValue)} off`;
};

/**
 * Would the API accept this coupon for this selection?
 *
 * `POST /coupon/validate` is still the authority (it also checks targeting and
 * per-user limits, which need the signed-in user's own history) — this only
 * keeps coupons the wall already knows are impossible from being offered and
 * then refused.
 */
export const couponEligibility = (coupon, subtotal) => {
  if (isCouponExpired(coupon)) return { eligible: false, reason: "Expired" };
  if (isCouponExhausted(coupon)) {
    return { eligible: false, reason: "Fully redeemed" };
  }

  const minOrder = Number(coupon?.minOrderAmount ?? 0);
  if (minOrder > 0 && Number(subtotal ?? 0) < minOrder) {
    return { eligible: false, reason: `Needs a ${formatTaka(minOrder)} order` };
  }

  // Targeting (new / inactive / specific customers) can only be judged by the
  // API, which owns the order history — offer it and let the API have its say.
  if (coupon?.targetType && coupon.targetType !== "ALL") {
    return { eligible: true, reason: "Account specific" };
  }

  return { eligible: true, reason: null };
};

/* ──────────────────────────────── totals ─────────────────────────────── */

/**
 * The whole arithmetic of an order in one call:
 * `{ subtotal, discount, delivery, payable }`, all in ৳, all mirroring the API.
 */
export const summariseOrder = ({ subtotal = 0, coupon = null } = {}) => {
  const discount = couponDiscountAmount(coupon, subtotal);
  const delivery = DELIVERY_CHARGE;

  return {
    subtotal,
    discount,
    delivery,
    payable: subtotal - discount + delivery,
  };
};

