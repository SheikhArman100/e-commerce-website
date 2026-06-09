import Button from "@/Components/Button";
import Card from "@/Components/Card";
import { ArrowRight, Star } from "lucide-react";

const FeaturedItem = ({ products, campaign, campaignProducts }) => {
  const isCampaignActive = campaign && campaignProducts?.length > 0;
  const items = isCampaignActive ? campaignProducts : (products || []);

  return (
    <section className="w-full min-h-fit flex flex-col justify-start py-4 md:py-[4rem] px-0 md:px-[4rem]">
      <div className="flex flex-col items-center mb-5">
        <div className="flex items-center justify-center gap-x-1 mb-2">
          <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
          <p className="text-textColor text-[0.7rem] font-bold uppercase tracking-[0.2em]">
            {isCampaignActive ? "Live Campaign" : "Artisanal Selection"}
          </p>
          <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
        </div>

        <h3 className="text-4xl md:text-5xl lg:text-6xl text-textColor font2 text-center">
          {isCampaignActive ? `${campaign.title}` : "Featured"}
        </h3>

        <div className="w-full flex justify-center md:justify-end mt-4">
          <Button className="flex bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300" href="/products">
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
        {!items?.length ? (
          <p className="text-3xl text-textColor font2">No products found</p>
        ) : (
          <div className="p-4 md:p-8 grid grid-cols-2 lg:grid-cols-3  gap-y-6 sm:gap-y-16 gap-x-3 sm:gap-x-12 lg:gap-x-16 place-items-center mx-auto w-full max-w-[1200px] ">
            {items.map((entry, i) => {
              const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

              // Handle campaign product structure (nested) vs regular product structure
              const item = isCampaignActive ? entry.product : entry;
              if (!item) return null;

              // Aggregate flavors and images
              const allFlavorImages = item.flavors?.flatMap(f => f.images) || [];
              const flavorColors = [...new Set(item.flavors?.map(f => f.flavor?.color).filter(Boolean))];

              const mainImagePath = allFlavorImages[0]?.path;

              // ─── Pricing ─────────────────────────────────────────────────
              // Initialize as numbers (0 not "0") so downstream code can do
              // numeric math without coercion.
              let minPrice = 0;
              let minSalesPrice = null;
              let maxDiscount = Number(entry.customDiscountPercentage) || 0;

              if (isCampaignActive) {
                // Backend now pre-computes `originalPrice` / `salesPrice` / `discountPercentage`
                // on every size. Find the cheapest sales price across all flavors/sizes.
                const campaignPrices = (item.flavors || []).flatMap(
                  (f) => (f.sizes || []).map((s) => ({
                    original: s.originalPrice,
                    sales: s.salesPrice,
                    discount: s.discountPercentage,
                  }))
                );

                if (campaignPrices.length > 0) {
                  // Pick the entry with the lowest sales price.
                  const cheapest = campaignPrices.reduce((min, curr) => {
                    const minSales = Number(min?.sales ?? Infinity);
                    const currSales = Number(curr?.sales ?? Infinity);
                    return currSales < minSales ? curr : min;
                  });
                  minPrice = Number(cheapest.original) || 0;
                  minSalesPrice =
                    Number(cheapest.sales ?? cheapest.original) || null;
                  if (!maxDiscount) {
                    maxDiscount = campaignPrices.reduce(
                      (m, p) => Math.max(m, Number(p.discount) || 0),
                      0
                    );
                  }
                }
              } else {
                // Regular pricing logic — base `size.price` per size.
                const allPrices = (item.flavors || [])
                  .flatMap((f) => (f.sizes || []).map((s) => Number(s.price)))
                  .filter((p) => Number.isFinite(p));
                minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
              }

              // Category Image
              const categoryImagePath = item.category?.image?.path;

              return (
                <Card key={i}>
                  <Card.CardContainer>
                    {maxDiscount > 0 && (
                      <Card.Badge>
                        {maxDiscount}% OFF
                      </Card.Badge>
                    )}
                    <Card.CategoryIcon
                      category={item.category?.name?.toLowerCase()}
                      categoryImage={categoryImagePath ? `${fileBase}/${categoryImagePath}` : null}
                    />
                    <Card.FlavorColors colors={flavorColors} />
                    <Card.BgRemoveImage bgRemoveImage={`${fileBase}/${mainImagePath}`} />
                    <Card.CardInfo
                      title={item.title}
                      price={minPrice}
                      salesPrice={minSalesPrice}
                      discountPercentage={maxDiscount}
                      href={`/products/${item.slug}`}
                    />
                  </Card.CardContainer>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedItem;
