export const marqueeContainer = {
  initial: {
    scaleX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      scaleX: {
        type: "tween",
        ease: "linear",
        duration: 0.4,
      },
    },
  },
};
export const marqueeAD={
  initial:{
    y:-100,
  },
  animate: {
    y:0,
    transition: {
      y: {
        type: 'tween',
        delay:0.4,
        duration: 0.3,
        ease: "linear",
      },
    },
  },

}
// NOTE: the per-item "marqueeText" variant was removed. Animating each item by
// -100% of its OWN width only scrolls seamlessly when every item has identical
// text/width; with different-length coupon messages the longer items slid
// faster and overlapped the shorter ones. The row is now animated as a whole
// inside Components/header/Marquee.js.

/**
 * Builds the marquee label for a coupon, e.g. "WELCOME10 — 20% off your order".
 * Handles both discount types (PERCENTAGE / FIXED) and appends the minimum
 * order amount when one is set.
 *
 * Lives here beside the belt variants because the two are a pair: the shape of
 * the text (length, separators) is what the belt's speed and repeat count are
 * tuned against, and both are needed server-side now that the coupon fetch
 * moved out of the client.
 */
export const couponToMessage = (coupon) => {
  if (!coupon?.code) return null;
  const discountText =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% off`
      : `৳${coupon.discountValue} off`;
  const minOrderText = coupon.minOrderAmount
    ? ` on orders over ৳${coupon.minOrderAmount}`
    : "";
  return `${coupon.code} — ${discountText}${minOrderText}`;
};

/**
 * Featured coupons for the public banner, fetched on the server.
 *
 * The endpoint is public (no auth), so anonymous visitors see active coupons
 * too, and the backend already filters isActive/isFeatured/expiry and returns
 * display-safe fields only. Running this here rather than in a useEffect means
 * the messages arrive in the initial HTML — no empty frame, no client-side
 * flash of a missing banner, and the fetch is deduped by Next across requests
 * instead of firing once per visitor.
 *
 * A failure must not take the page down: a banner is decoration, so this
 * returns an empty list and the marquee renders nothing.
 */
export const fetchFeaturedMessages = async () => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendURL) return [];

  try {
    const response = await fetch(`${backendURL}/coupon/featured`, {
      // Coupon campaigns change rarely; serve this from the data cache for a
      // minute instead of re-fetching the API on every request.
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];

    const result = await response.json();
    return (result?.data || []).map(couponToMessage).filter(Boolean);
  } catch (error) {
    console.error("Error fetching featured coupons:", error);
    return [];
  }
};




