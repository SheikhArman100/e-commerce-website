"use client";
import Button from "@/Components/Button";
import SectionTitle from "@/Components/SectionTitle";
import image1 from "@/public/assets/homeImage1.jpg";
import image2 from "@/public/assets/pexels-jonathan-borba-9816191.jpg";
import { ArrowRight, Facebook, Instagram, Star, Twitter } from "lucide-react";
import Image from "next/image";
import image3 from "../../public/assets/frank-zhang-53nLF9woXE0-unsplash.jpg";

/**
 * Home page hero. When a campaign is live it renders a floating card with that
 * campaign's real details (instead of the static "New Arrival" card); clicking
 * the card smooth-scrolls to the #live-campaign section further down the page.
 * The section only exists when the campaign has products, so the card falls
 * back to the original static promo when there's nothing to scroll to.
 */
const HomeContainer = ({ children, activeCampaign = null }) => {
  const campaignProducts = activeCampaign?.products ?? [];
  const hasCampaign = Boolean(activeCampaign) && campaignProducts.length > 0;

  // Best discount on offer: per-product overrides beat the campaign default,
  // and any product WITHOUT an override falls back to that default — so the
  // advertised "up to" must consider both when even one product lacks a custom
  // percent (all overridden → pure max of overrides; none → the default).
  const productPercents = campaignProducts
    .map((entry) => Number(entry.customDiscountPercentage))
    .filter((n) => Number.isFinite(n) && n > 0);
  const defaultPercent = Number(activeCampaign?.discountDefault) || 0;
  const bestPercent =
    campaignProducts.length > 0 && productPercents.length === campaignProducts.length
      ? Math.max(...productPercents)
      : Math.max(defaultPercent, ...productPercents);

  const discountLabel =
    activeCampaign?.discountType === "PERCENTAGE"
      ? `Up to ${bestPercent}% off`
      : `Up to ৳${Number(activeCampaign?.discountDefault) || 0} off`;

  const endDateLabel = activeCampaign
    ? new Date(activeCampaign.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  // Thumbnails for the campaign card: first image of each campaign product
  // (same `${fileBase}/${path}` shape the product cards use). Campaign products
  // can ship without images, so fall back to the original hero art.
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const productThumbs = campaignProducts
    .map((entry) => {
      const path = (entry.product?.flavors ?? [])
        .flatMap((flavor) => flavor.images ?? [])
        .find((image) => image?.path)?.path;
      return path ? `${fileBase}/${path}` : null;
    })
    .filter(Boolean)
    .slice(0, 2);
  const thumbs = productThumbs.length ? productThumbs : [image2, image3];
  // Thumbs for the "+N" pill: only product images count as "pictured" — the
  // static fallback art is decoration, so it never reduces the remaining count.
  const remaining = Math.max(campaignProducts.length - productThumbs.length, 0);

  // Smooth-scroll to the campaign section. The href="#live-campaign" stays as
  // the no-JS fallback, so only preventDefault when the target really exists.
  const scrollToCampaign = (event) => {
    const target = document.getElementById("live-campaign");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const floatingCardClass =
    "absolute bottom-6 left-1/2 -translate-x-1/2 right-auto md:left-auto md:translate-x-0 md:bottom-12 md:right-12 lg:-left-24 lg:bottom-12 z-30 bg-accentColor2/80 backdrop-blur-3xl p-4 md:p-8 border border-white/20 rounded-3xl w-[90%] max-w-[240px] md:max-w-sm shadow-xl group overflow-hidden flex flex-col items-center md:items-start text-center md:text-left";

  return (
    <section className="w-full h-full max-w-[1600px] mx-auto overflow-hidden">
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-bgColor pt-24 md:pt-36 lg:pt-40">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-10 md:px-16 pb-20 z-20">
          <div className="flex items-center justify-center lg:justify-start gap-x-2 mb-6">
            <Star
              fill="#9B2242"
              stroke="none"
              className="h-4 w-4 md:h-5 md:w-5"
            />
            <span className="text-accentColor tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase">
              Premium Bakery
            </span>
            <Star
              fill="#9B2242"
              stroke="none"
              className="h-4 w-4 md:h-5 md:w-5"
            />
          </div>

          <h1 className="text-textColor text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] mb-8 tracking-tight">
            Baking for <br />
            <span className="text-accentColor">Your Pleasure</span>
          </h1>

          <p className="text-textColor/80 text-base md:text-lg lg:text-xl max-w-lg mb-10 leading-relaxed font-light mx-auto lg:mx-0">
            Enjoy your indulgent afternoon tea in the comfort of your home with
            the most beautiful & scrumptious cakes, crafted from the finest
            ingredients.
          </p>

          <div className="flex justify-center lg:justify-start w-full">
            <Button
              className="w-48 h-12 md:w-56 md:h-14 bg-accentColor rounded-sm hover:bg-accentColor/90 shadow-lg"
              href="/products"
            >
              <Button.Border1 />
              <Button.Border2 />
              <Button.Title className="text-xs md:text-base uppercase tracking-widest font-bold text-bgColor">
                Discover Shop
              </Button.Title>
              <Button.Icon>
                <ArrowRight className="stroke-bgColor" />
              </Button.Icon>
            </Button>
          </div>

          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8">
            <div className="flex items-center gap-x-4">
              <div className="w-8 md:w-12 h-[1px] bg-accentColor/30" />
              <span className="text-textColor/50 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] whitespace-nowrap">
                Follow Our Story
              </span>
            </div>
            <div className="flex gap-x-3">
              {[
                { Icon: Facebook, link: "#" },
                { Icon: Instagram, link: "#" },
                { Icon: Twitter, link: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-textColor/10 bg-textColor/5 rounded-full hover:border-accentColor hover:bg-accentColor text-textColor/70 hover:text-bgColor group shadow-sm"
                >
                  <social.Icon
                    size={16}
                    className="md:w-[18px] md:h-[18px] group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative min-h-[500px] md:min-h-[550px] lg:min-h-0 flex-1 px-4 sm:px-8 lg:pl-12 lg:pr-24 pb-16 lg:pb-20">
          <div className="relative h-full w-full min-h-[500px] md:min-h-[550px]">
            <Image
              src={image1}
              alt="Artisanal Bakery Campaign"
              fill
              className="object-cover rounded-3xl lg:rounded-[3.5rem] shadow-2xl"
              priority
              placeholder="blur"
            />

            {hasCampaign ? (
              <a
                href="#live-campaign"
                onClick={scrollToCampaign}
                aria-label={`View ${activeCampaign.title} campaign`}
                className={`${floatingCardClass} cursor-pointer transition-transform duration-300 hover:-translate-y-1`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between w-full mb-2 gap-1 md:gap-2">
                  <div className="flex items-center gap-x-2">
                    <Star
                      fill="#9B2242"
                      stroke="none"
                      className="h-3 w-3 md:hidden"
                    />
                    <SectionTitle
                      title="Live Campaign"
                      className="!mb-0 scale-75 md:scale-100 origin-center md:origin-left !text-textColor"
                    />
                    <Star
                      fill="#9B2242"
                      stroke="none"
                      className="h-3 w-3 md:hidden"
                    />
                  </div>
                </div>

                <h4 className="text-textColor text-xs md:text-xl font-bold leading-tight mb-1 md:mb-2 tracking-tight">
                  {activeCampaign.title}
                </h4>

                <p className="w-full text-[10px] md:text-sm font-semibold text-bgColor uppercase tracking-widest mb-1 md:mb-2">
                  {discountLabel}
                </p>
                {endDateLabel && (
                  <p className="w-full text-[10px] md:text-xs text-textColor/70 mb-3 md:mb-4">
                    Ends {endDateLabel}
                  </p>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-6">
                  <div className="flex -space-x-3 justify-center">
                    {thumbs.map((img, i) => {
                      const isRemote = typeof img === "string";
                      return (
                        <div
                          key={i}
                          className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 border-bgColor overflow-hidden relative shadow-xl"
                        >
                          <Image
                            src={img}
                            alt="campaign item"
                            fill
                            className="object-cover"
                            placeholder={isRemote ? undefined : "blur"}
                          />
                        </div>
                      );
                    })}
                    {remaining > 0 && (
                      <div className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 border-bgColor bg-accentColor flex items-center justify-center text-bgColor font-black text-[10px] md:text-sm shadow-xl">
                        +{remaining}
                      </div>
                    )}
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center bg-textColor/10 rounded-full hover:bg-accentColor hover:text-bgColor shadow-sm border border-textColor/5 ml-4"
                    >
                      <ArrowRight
                        size={16}
                        className="md:w-[22px] md:h-[22px] text-textColor"
                      />
                    </span>
                  </div>
                </div>
              </a>
            ) : (
              <div className={floatingCardClass}>
                <div className="flex flex-col md:flex-row items-center justify-between w-full mb-2 gap-1 md:gap-2">
                  <div className="flex items-center gap-x-2">
                    <Star
                      fill="#9B2242"
                      stroke="none"
                      className="h-3 w-3 md:hidden"
                    />
                    <SectionTitle
                      title="New Arrival"
                      className="!mb-0 scale-75 md:scale-100 origin-center md:origin-left !text-textColor"
                    />
                    <Star
                      fill="#9B2242"
                      stroke="none"
                      className="h-3 w-3 md:hidden"
                    />
                  </div>
                </div>

                <h4 className="text-textColor text-xs md:text-xl font-bold leading-tight mb-3 md:mb-6 tracking-tight">
                  Our Fall Product Collection is here
                </h4>

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-6">
                  <div className="flex -space-x-3 justify-center">
                    {[image2, image3].map((img, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 border-bgColor overflow-hidden relative shadow-xl"
                      >
                        <Image
                          src={img}
                          alt="item"
                          fill
                          className="object-cover"
                          placeholder="blur"
                        />
                      </div>
                    ))}
                    <div className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 border-bgColor bg-accentColor flex items-center justify-center text-bgColor font-black text-[10px] md:text-sm shadow-xl">
                      +5
                    </div>
                    <a
                      href="/products"
                      className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center bg-textColor/10 rounded-full hover:bg-accentColor hover:text-bgColor shadow-sm border border-textColor/5 ml-4"
                    >
                      <ArrowRight
                        size={16}
                        className="md:w-[22px] md:h-[22px] text-textColor"
                      />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-40 bg-bgColor mt-0">{children}</div>
    </section>
  );
};

export default HomeContainer;
