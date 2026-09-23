import Button from "@/Components/Button";
import Card from "@/Components/Card";
import { ArrowRight, Star } from "lucide-react";

/**
 * Normalises one feed entry into everything a <Card /> needs, no matter which
 * public endpoint it came from:
 *
 *   • GET /product & GET /product/featured → the product itself; every size
 *     already carries campaign-aware `originalPrice` / `salesPrice`.
 *   • GET /campaign/active → `{ ...campaignProduct, product }` — the campaign
 *     wrapper is unwrapped here (its `customDiscountPercentage` is already
 *     baked into the product's size prices by the backend).
 *
 * Because `originalPrice` is the base price and `salesPrice` the discounted
 * one, a size is only "on sale" when `salesPrice < originalPrice` — that keeps
 * the struck-through price off cards that have no discount at all.
 */
const resolveOffer = (entry) => {
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
    categoryImagePath: item.category?.image?.path,
    categoryName: item.category?.name?.toLowerCase(),
  };
};

/**
 * Storefront product grid used by the home page sections (Featured products
 * and, separately, the live campaign's products). Purely presentational — the
 * data is fetched by the server component that renders it.
 */
const ProductSection = ({
  id,
  eyebrow = "Artisanal Selection",
  title = "Featured",
  products = [],
  href = "/products",
  emptyText = "No products found",
}) => {
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const items = (products || []).map(resolveOffer).filter(Boolean);

  return (
    <section
      id={id}
      className="w-full min-h-fit flex flex-col justify-start py-4 md:py-[4rem] px-0 md:px-[4rem]"
    >
      <div className="flex flex-col items-center mb-5">
        <div className="flex items-center justify-center gap-x-1 mb-2">
          <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
          <p className="text-textColor text-[0.7rem] font-bold uppercase tracking-[0.2em]">
            {eyebrow}
          </p>
          <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
        </div>

        <h3 className="text-4xl md:text-5xl lg:text-6xl text-textColor font2 text-center">
          {title}
        </h3>

        <div className="w-full flex justify-center md:justify-end mt-4">
          <Button className="flex bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300" href={href}>
            <Button.Border1 />
            <Button.Border2 />
            <Button.Title className="text-bgColor">See All</Button.Title>
            <Button.Icon>
              <ArrowRight className="stroke-bgColor" />
            </Button.Icon>
          </Button>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        {!items.length ? (
          <p className="text-3xl text-textColor font2">{emptyText}</p>
        ) : (
          <div className="p-4 md:p-8 grid grid-cols-2 lg:grid-cols-3  gap-y-6 sm:gap-y-16 gap-x-3 sm:gap-x-12 lg:gap-x-16 place-items-center mx-auto w-full max-w-[1200px] ">
            {items.map((offer, i) => (
              <Card key={offer.item.id ?? i}>
                <Card.CardContainer>
                  {offer.discountPercentage > 0 && (
                    <Card.Badge>{offer.discountPercentage}% OFF</Card.Badge>
                  )}
                  <Card.CategoryIcon
                    category={offer.categoryName}
                    categoryImage={
                      offer.categoryImagePath ? `${fileBase}/${offer.categoryImagePath}` : null
                    }
                  />
                  <Card.FlavorColors colors={offer.flavorColors} />
                  {/* A missing image must stay `null` so <Card.BgRemoveImage />
                      shows its "Gallery Pending" placeholder instead of
                      requesting `${fileBase}/undefined`. */}
                  <Card.BgRemoveImage
                    bgRemoveImage={
                      offer.mainImagePath ? `${fileBase}/${offer.mainImagePath}` : null
                    }
                  />
                  <Card.CardInfo
                    title={offer.item.title}
                    price={offer.price}
                    salesPrice={offer.salesPrice}
                    discountPercentage={offer.discountPercentage}
                    href={`/products/${offer.item.slug}`}
                  />
                </Card.CardContainer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
