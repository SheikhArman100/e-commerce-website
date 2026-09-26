/**
 * Shared product-feed normalisation for the storefront.
 *
 * Deliberately a plain module (no hooks, no "use client"): the server
 * components that fetch the feeds and the client components that animate them
 * both import the exact same rules, so a card can never price differently
 * depending on where it is rendered.
 */

/**
 * Normalises one feed entry into everything a <Card /> needs, no matter which
 * public endpoint it came from:
 *
 *   • GET /product & GET /product/featured → the product itself; every size
 *     already carries campaign-aware `originalPrice` / `salesPrice`.
 *   • GET /campaign/active → `{ ...campaignProduct, product }` — the campaign
 *     wrapper is unwrapped here (its `customDiscountPercentage`, or the
 *     campaign's flat `discountDefault` for FIXED campaigns, is already baked
 *     into the product's size prices by the backend).
 *
 * Because `originalPrice` is the base price and `salesPrice` the discounted
 * one, a size is only "on sale" when `salesPrice < originalPrice` — that keeps
 * the struck-through price off cards that have no discount at all.
 */
export const resolveProductOffer = (entry) => {
  const item = entry?.product ?? entry;
  if (!item) return null;

  // ─── Pricing: cheapest size wins ("from ৳x") ─────────────────────────────
  const offers = (item.flavors || [])
    .flatMap((flavor) =>
      (flavor.sizes || []).map((size) => {
        const original = Number(size.originalPrice ?? size.price);
        const sales = Number(size.salesPrice ?? original);
        return { original, sales };
      })
    )
    .filter(({ original }) => Number.isFinite(original));

  const cheapest = offers.reduce(
    (min, curr) => (curr.sales < min.sales ? curr : min),
    offers[0]
  );

  // Campaign behind the price the card advertises. Every feed names it the same
  // way: the product endpoint and the wishlist attach `activeCampaign`
  // (the campaign that produced the LOWEST size price), while GET /campaign/active
  // wraps entries as `{ ...campaignProduct, product }` — the campaign itself is
  // passed to <CampaignSection />, so the caller forwards its name there.
  const campaignName =
    entry?.product ? null : (item.activeCampaign?.title ?? null);

  const onSale = Boolean(cheapest) && cheapest.sales < cheapest.original;

  return {
    item,
    price: cheapest ? cheapest.original : 0,
    salesPrice: onSale ? cheapest.sales : null,
    discountPercentage: onSale
      ? Math.round((1 - cheapest.sales / cheapest.original) * 100)
      : 0,
    mainImagePath: (item.flavors || []).flatMap((f) => f.images || [])[0]?.path,
    flavorColors: [
      ...new Set((item.flavors || []).map((f) => f.flavor?.color).filter(Boolean)),
    ],
    flavorNames: [
      ...new Set((item.flavors || []).map((f) => f.flavor?.name).filter(Boolean)),
    ],
    categoryImagePath: item.category?.image?.path,
    categoryLabel: item.category?.name,
    categoryName: item.category?.name?.toLowerCase(),
    campaignName,
  };
};

/**
 * Human-readable headline for a campaign's saving.
 *
 * Per-product overrides beat the campaign default, and any product WITHOUT an
 * override falls back to that default — so the advertised "up to" must consider
 * both when even one product lacks a custom percent (all overridden → pure max
 * of overrides; none → the default).
 *
 * FIXED campaigns apply a flat ৳ amount (and the backend ignores per-product
 * overrides for them), so only the default is advertised there.
 */
export const describeCampaignDiscount = (campaign) => {
  const products = campaign?.products ?? [];

  if (campaign?.discountType === "FIXED") {
    return `Up to ৳${Number(campaign?.discountDefault) || 0} off`;
  }

  const productPercents = products
    .map((entry) => Number(entry?.customDiscountPercentage))
    .filter((n) => Number.isFinite(n) && n > 0);
  const defaultPercent = Number(campaign?.discountDefault) || 0;
  const bestPercent =
    products.length > 0 && productPercents.length === products.length
      ? Math.max(...productPercents)
      : Math.max(defaultPercent, ...productPercents);

  return `Up to ${bestPercent}% off`;
};
