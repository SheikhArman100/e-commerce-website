"use client";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import CategoryImage from "@/public/assets/categoryImage.jpg";
import { resolveProductOffer } from "@/libs/productOffer";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image.js";
import { useState } from "react";

/**
 * Storefront category browser.
 *
 * Deliberately PRESENTATIONAL: the category list — every entry already carrying
 * its single `previewProduct` with campaign-aware prices — is fetched
 * server-side by the page that renders this section, with one request to
 * GET /category/public. That means:
 *
 *   • SEO — the category names, the active-product counts and the default
 *     preview card are all in the server-rendered HTML.
 *   • Instant switching — every preview product ships in the props, so clicking
 *     a category costs no network round trip.
 *
 * The component thus stays a client component only for that interaction.
 */
const Categories = ({ categories = [] }) => {
  // The first category is the default selection, derived from the props so the
  // server and the first client render agree (no effect, no loading flash).
  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? null
  );

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  const activeCategory =
    categories.find((cat) => cat.id === activeCategoryId) ?? categories[0];

  // `previewProduct` is null when the category holds no active product yet —
  // resolveProductOffer() then returns null and the empty card is shown.
  const offer = resolveProductOffer(activeCategory?.previewProduct);

  return (
    <article className="relative w-full min-h-screen xl:h-screen">
      {!categories.length ? (
        <section className="w-full h-full flex items-center justify-center">
          <p className="text-3xl text-textColor font2">No categories found!</p>
        </section>
      ) : (
        <section className="w-full h-full flex flex-col xl:flex-row gap-y-16">
          <div className="relative w-full h-[50vh] xl:h-full xl:w-1/2 overflow-hidden">
            <Image
              src={CategoryImage}
              alt="categories section image"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-[2s]"
              priority
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-accentColor/5" />
          </div>

          <div className=" absolute top-[40%] xl:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 drop-shadow-[0_10px_30px_rgba(155,34,66,0.15)]">
            {offer ? (
              <Card>
                <Card.CardContainer>
                  {offer.discountPercentage > 0 && (
                    <Card.Badge>{offer.discountPercentage}% OFF</Card.Badge>
                  )}
                  <Card.CategoryIcon
                    category={offer.categoryName}
                    categoryImage={
                      offer.categoryImagePath
                        ? `${fileBase}/${offer.categoryImagePath}`
                        : null
                    }
                  />
                  <Card.FlavorColors colors={offer.flavorColors} />
                  {/* A missing image must stay `null` so <Card.BgRemoveImage />
                      shows its "Gallery Pending" placeholder instead of
                      requesting `${fileBase}/undefined`. */}
                  <Card.BgRemoveImage
                    bgRemoveImage={
                      offer.mainImagePath
                        ? `${fileBase}/${offer.mainImagePath}`
                        : null
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
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-accentColor2/20 backdrop-blur-sm shadow-sm rounded-2xl border border-textColor/10 w-full max-w-[400px]">
                <p className="text-textColor/60 font2 text-xl">No delicacy found</p>
              </div>
            )}
          </div>

          <div className="w-full xl:w-[50%] flex flex-col items-center justify-center py-12 xl:py-0">
            <div className="flex items-center justify-center gap-x-1 mb-8">
              <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
              <p className="text-textColor text-[0.7rem] font-bold uppercase tracking-[0.3em]">
                Categories
              </p>
              <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-center gap-y-12">
              <div className="flex flex-col items-center justify-between gap-y-4 text-textColor">
                {categories.map((cat) => {
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      aria-pressed={isActive}
                      className={`text-2xl sm:text-3xl md:text-5xl lg:text-7xl transition-all duration-500 hover:text-accentColor uppercase tracking-tighter ${
                        isActive
                          ? "opacity-100 font-bold scale-110"
                          : "opacity-30 font-medium hover:opacity-60"
                      }`}
                      onClick={() => setActiveCategoryId(cat.id)}
                    >
                      {cat.name}
                      {/* `_count.products` from the public feed = how many ACTIVE
                          products are actually buyable in this category. */}
                      {typeof cat._count?.products === "number" && (
                        <span className="align-super ml-2 text-xs sm:text-sm font-medium tracking-normal opacity-50">
                          {cat._count.products}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <Button href="/products" className="w-48 h-12 md:w-56 md:h-14 mt-4 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-lg">
                <Button.Border1 />
                <Button.Border2 />
                <Button.Title className="text-bgColor">Explore Collections</Button.Title>
                <Button.Icon>
                  <ArrowRight className="stroke-bgColor" />
                </Button.Icon>
              </Button>
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default Categories;

