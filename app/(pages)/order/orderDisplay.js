/**
 * Display rules for the order history page (`app/(pages)/order`).
 *
 * The API already sends everything the archive needs — status, payment status,
 * the money breakdown, item snapshots (title / flavour / size / unit price) and
 * the status timeline — so this module only turns those values into the
 * boutique's cream/chocolate/ruby language and absorbs the snapshot fallbacks
 * (an item keeps its purchased title/flavour/size even if the product changed).
 */

/** The journey a healthy order climbs, in order. */
export const ORDER_PIPELINE = [
  { status: "Pending", label: "Placed", note: "Order received" },
  { status: "Paid", label: "Paid", note: "Payment confirmed" },
  { status: "Shipped", label: "Shipped", note: "Left the boutique" },
  { status: "Delivered", label: "Delivered", note: "Enjoyed" },
];

/** Terminal states that leave the happy path. */
export const DEVIATION_STATUSES = ["Cancelled", "Failed"];

/** Order status pill: ruby on pale pink while open, chocolate in transit, solid ruby when done. */
const STATUS_TONES = {
  Pending: "bg-accentColor2/20 text-accentColor border-accentColor2/40",
  Paid: "bg-accentColor/10 text-accentColor border-accentColor/25",
  Shipped: "bg-textColor/10 text-textColor border-textColor/20",
  Delivered: "bg-accentColor text-bgColor border-accentColor",
  Cancelled: "bg-stone-100 text-stone-500 border-stone-200",
  Failed: "bg-red-50 text-red-600 border-red-200",
};

const PAYMENT_LABELS = {
  PAID: "Payment Confirmed",
  PENDING: "Payment Pending",
  FAILED: "Payment Failed",
  CANCELLED: "Payment Cancelled",
  REFUNDED: "Refunded",
};

const PAYMENT_TONES = {
  PAID: "text-accentColor",
  PENDING: "text-stone-500",
  FAILED: "text-red-600",
  CANCELLED: "text-stone-500",
  REFUNDED: "text-textColor",
};

export const statusTone = (status) => STATUS_TONES[status] ?? STATUS_TONES.Pending;

export const isDeviation = (status) => DEVIATION_STATUSES.includes(status);

export const paymentLabel = (status) => PAYMENT_LABELS[status] ?? PAYMENT_LABELS.PENDING;

export const paymentTone = (status) => PAYMENT_TONES[status] ?? PAYMENT_TONES.PENDING;

/** Money in the storefront's own currency. */
export const formatAmount = (value) => `৳${Number(value ?? 0).toFixed(2)}`;

/** "22 Sep 2026" — the archive's date format. */
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

/** "22 Sep 2026, 4:35 PM" — the status rail's stamps. */
export const formatDateTime = (value) =>
  value
    ? `${formatDate(value)}, ${new Date(value).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : null;

/** The API's human friendly reference, with a padded id as the safety net. */
export const orderReference = (order) =>
  order?.orderNumber || `ORD-${String(order?.id ?? "").padStart(6, "0")}`;

/** When a stage was reached, straight from the order's own timeline. */
export const statusReachedAt = (history, status) =>
  history?.find((entry) => entry.status === status)?.changedAt ?? null;

/** A soft wash of a flavour's own colour (hex only), used when a row has no photo. */
export const softFlavorTint = (color) =>
  /^#[0-9a-fA-F]{6}$/.test(color ?? "") ? `${color}14` : null;

/**
 * Variant image first (the resolved `productFlavorSize`), then the same image
 * reached through the product's own nesting
 * (`product.flavors[].sizes[].productFlavor.images`) and finally nothing — the
 * row then drops back to its placeholder mark.
 */
export const orderItemImage = (item) =>
  item?.productFlavorSize?.productFlavor?.images?.[0]?.path ||
  item?.product?.flavors
    ?.flatMap((flavor) => flavor.sizes ?? [])
    .flatMap((size) => size.productFlavor?.images ?? [])?.[0]?.path ||
  null;

export const orderItemTitle = (item) =>
  item?.productTitle || item?.product?.title || "Delicacy";

/** Snapshot flavour name/colour first; live relations are the fallback. */
export const orderItemFlavor = (item) => {
  const flavor = item?.productFlavorSize?.productFlavor?.flavor;
  return {
    name: item?.flavorName || flavor?.name || null,
    color: flavor?.color || null,
  };
};

export const orderItemSize = (item) =>
  item?.sizeName || item?.productFlavorSize?.size?.name || null;

export const orderItemLine = (item) =>
  Number(item?.price ?? 0) * Number(item?.quantity ?? 1);

export const orderTotalQuantity = (items = []) =>
  items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);

/** The amount that matters: payable when the API has it, else the raw total. */
export const orderPayable = (order) =>
  Number(order?.payableAmount ?? order?.totalAmount ?? 0);
