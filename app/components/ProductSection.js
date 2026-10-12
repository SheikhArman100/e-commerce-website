import Button from "@/Components/Button";
import Card from "@/Components/Card";
import { resolveProductOffer } from "@/libs/productOffer";
import { ArrowRight, Star } from "lucide-react";

/**
 * Storefront product grid used by the home page's curated feed (Featured
 * products). Purely presentational — the data is fetched by the server
 * component that renders it.
 *
 * Pricing/variant normalisation lives in `@/libs/productOffer`, shared with the
 * campaign grid so both price a card identically. Live campaigns render through
 * <CampaignSection /> instead of this component.
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
  const items = (products || []).map(resolveProductOffer).filter(Boolean);

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
                    categoryLabel={offer.categoryLabel}
                    categoryImage={
                      offer.categoryImagePath ? `${fileBase}/${offer.categoryImagePath}` : null
                    }
                  />
                  <Card.FlavorColors colors={offer.flavorColors} flavorNames={offer.flavorNames} />
                  {/* A missing image must stay `null` so <Card.CardPhoto />
                      shows its "Gallery Pending" placeholder instead of
                      requesting `${fileBase}/undefined`. */}
                  <Card.CardPhoto
                    src={
                      offer.mainImagePath ? `${fileBase}/${offer.mainImagePath}` : null
                    }
                  />
                  <Card.CardInfo
                    title={offer.item.title}
                    price={offer.price}
                    salesPrice={offer.salesPrice}
                    discountPercentage={offer.discountPercentage}
                    campaignName={offer.campaignName}
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
