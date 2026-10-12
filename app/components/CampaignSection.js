"use client";

import Button from "@/Components/Button";
import Card from "@/Components/Card";
import useCountdown from "@/hooks/useCountdown";
import {
  describeCampaignDiscount,
  resolveProductOffer,
} from "@/libs/productOffer";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Flame, Sparkles, Star } from "lucide-react";
import Image from "next/image";

/**
 * Reveal motion for the band's copy blocks and for each product card. Kept to
 * a gentle rise so the campaign reads as "arriving", matching the site's
 * pagereveal easing ([0.33, 1, 0.68, 1]).
 */
const riseIn = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
};

/** One glass tile of the countdown ("--" until the hook has mounted). */
const CountdownUnit = ({ value, label }) => (
  <div className="flex min-w-[3.4rem] flex-col items-center justify-center rounded-xl border border-bgColor/15 bg-bgColor/10 px-2 py-2.5 shadow-sm backdrop-blur-md sm:min-w-[4.25rem] sm:px-3 sm:py-3">
    <span className="text-lg font-bold leading-none text-bgColor tabular-nums sm:text-2xl">
      {value}
    </span>
    <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-bgColor/55 sm:text-[10px]">
      {label}
    </span>
  </div>
);

/**
 * The live campaign's storefront block — replaces the generic ProductSection
 * that used to render campaign products.
 *
 * Unlike the curated Featured grid, a campaign is an event: it gets its own
 * full-bleed banner (the admin's uploaded `bannerImage` when present), the
 * campaign's real description and discount, a live countdown to `endDate`, and
 * then the products at campaign pricing.
 *
 * Data comes straight from GET /campaign/active, whose products already carry
 * campaign-aware `originalPrice` / `salesPrice`, so nothing is re-calculated
 * here — the shared `resolveProductOffer` only decides what a card shows.
 */
const CampaignSection = ({
  campaign,
  id = "live-campaign",
  href = "/products",
  emptyText = "This campaign's treats are still being plated — check back soon.",
}) => {
  // Called before any early return so hook order stays stable when the
  // campaign is absent (the page hides the section, but we stay defensive).
  const countdown = useCountdown(campaign?.endDate);

  if (!campaign) return null;

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const items = (campaign.products || []).map(resolveProductOffer).filter(Boolean);
  const discountLabel = describeCampaignDiscount(campaign);
  const bannerImage = campaign.bannerImage
    ? `${fileBase}/${campaign.bannerImage}`
    : null;

  const endsLabel = campaign.endDate
    ? new Date(campaign.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  // Placeholder "--" while the countdown has not mounted yet.
  const unit = (value) => (countdown ? String(value).padStart(2, "0") : "--");

  // Thumbnails for the countdown panel: first image of each campaign product,
  // same `${fileBase}/${path}` shape the cards use.
  const thumbs = items
    .map((offer) => offer.mainImagePath)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <section
      id={id}
      className="relative w-full min-h-fit py-6 md:py-16 px-3 sm:px-6 md:px-[4rem]"
    >
      <div className="relative mx-auto w-full max-w-[1400px]">
        {/* Soft ruby bloom behind the band so it lifts off the cream page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -top-4 bottom-12 rounded-[3rem] bg-accentColor/10 blur-[90px]"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative isolate overflow-hidden rounded-[1.75rem] border border-textColor/10 shadow-[0_45px_90px_-45px_rgba(93,64,55,0.65)] md:rounded-[2.5rem]"
        >
          {/* ── Backdrop: admin banner when uploaded, deep ruby wash when not ── */}
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            {bannerImage && (
              <Image
                src={bannerImage}
                alt=""
                fill
                priority
                sizes="100vw"
                className="scale-[1.03] object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2F211D]/95 via-[#5D4037]/92 to-accentColor/95" />
            <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-accentColor2/25 blur-3xl" />
            <div className="absolute -right-16 -bottom-28 h-80 w-80 rounded-full bg-accentColor/40 blur-3xl" />
          </div>

          <div className="relative z-10 grid items-center gap-10 px-6 py-10 sm:px-10 md:px-14 md:py-16 lg:grid-cols-12 lg:gap-14">
            {/* ── Left: the offer story ─────────────────────────────────── */}
            <motion.div
              variants={riseIn}
              className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accentColor2/30 bg-accentColor2/10 px-3.5 py-1.5 backdrop-blur-md">
                <Star fill="#F4C2C2" stroke="none" className="h-3 w-3" />
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-accentColor2">
                  Live Campaign
                </span>
                <Star fill="#F4C2C2" stroke="none" className="h-3 w-3" />
              </span>

              <h3 className="mt-6 font2 text-3xl font-black leading-[1.06] tracking-tight text-bgColor sm:text-4xl md:text-5xl lg:text-6xl">
                {campaign.title}
              </h3>

              {campaign.description && (
                <p className="mt-5 w-full max-w-xl text-sm font-light leading-relaxed text-bgColor/75 sm:text-base">
                  {campaign.description}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-accentColor2 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-accentColor shadow-lg sm:text-xs">
                  <Flame className="h-3.5 w-3.5" />
                  {discountLabel}
                </span>

                {endsLabel && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-bgColor/20 bg-bgColor/10 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-bgColor/80 backdrop-blur-md sm:text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    Ends {endsLabel}
                  </span>
                )}
              </div>

              {/* <Button
                href={href}
                className="mt-9 h-12 w-56 rounded-sm bg-accentColor2 shadow-xl transition-all duration-300 hover:bg-accentColor2/90 md:h-14 md:w-64"
              >
                <Button.Border1 className="border-bgColor/40" />
                <Button.Border2 className="border-bgColor/40" />
                <Button.Title className="text-xs font-bold uppercase tracking-[0.2em] text-accentColor md:text-sm">
                  Shop The Campaign
                </Button.Title>
                <Button.Icon>
                  <ArrowRight className="stroke-accentColor" />
                </Button.Icon>
              </Button> */}
            </motion.div>

            {/* ── Right: the countdown panel ────────────────────────────── */}
            <motion.div variants={riseIn} className="w-full lg:col-span-5">
              <div className="mx-auto w-full max-w-sm rounded-3xl border border-bgColor/15 bg-bgColor/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-accentColor2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Offer Ends In
                  </span>
                  <span className="whitespace-nowrap text-[0.65rem] font-medium uppercase tracking-widest text-bgColor/50">
                    {items.length} {items.length === 1 ? "Piece" : "Pieces"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
                  <CountdownUnit value={unit(countdown?.days ?? 0)} label="Days" />
                  <CountdownUnit value={unit(countdown?.hours ?? 0)} label="Hours" />
                  <CountdownUnit value={unit(countdown?.minutes ?? 0)} label="Mins" />
                  <CountdownUnit value={unit(countdown?.seconds ?? 0)} label="Secs" />
                </div>

                {/* Dates are display-only on the backend, so a passed endDate
                    never hides a live campaign — we just soften the copy. */}
                <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-accentColor2/70">
                  {countdown?.isExpired
                    ? "Final hours of the campaign"
                    : "While the campaign lasts"}
                </p>

                {thumbs.length > 0 && (
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-bgColor/10 pt-5">
                    <div className="flex -space-x-3">
                      {thumbs.map((path, i) => (
                        <span
                          key={`${path}-${i}`}
                          className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-bgColor/80 shadow-lg sm:h-10 sm:w-10"
                        >
                          <Image
                            src={`${fileBase}/${path}`}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                      ))}
                    </div>
                    <a
                      href={href}
                      className="group inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-bgColor/70 transition-colors hover:text-accentColor2"
                    >
                      View All
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── The campaign's products, at campaign pricing ───────────────── */}
        <div className="mt-12 md:mt-16">
          <div className="mb-7 flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-textColor/50">
                In This Campaign
              </span>
              <h4 className="mt-1 font2 text-2xl tracking-tight text-textColor md:text-3xl">
                Handpicked for the occasion
              </h4>
            </div>

            <Button
              href={href}
              className="flex rounded-sm bg-accentColor transition-all duration-300 hover:bg-accentColor/90"
            >
              <Button.Border1 />
              <Button.Border2 />
              <Button.Title className="text-bgColor">See All</Button.Title>
              <Button.Icon>
                <ArrowRight className="stroke-bgColor" />
              </Button.Icon>
            </Button>
          </div>

          {!items.length ? (
            <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-textColor/10 bg-accentColor2/15 px-6 py-14 text-center">
              <Star fill="#9B2242" stroke="none" className="h-4 w-4" />
              <p className="mt-3 font2 text-lg text-textColor/60">{emptyText}</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid w-full grid-cols-2 place-items-center gap-x-3 gap-y-6 sm:gap-x-8 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4"
            >
              {items.map((offer, i) => (
                <motion.div key={offer.item.id ?? i} variants={riseIn}>
                  <Card>
                    <Card.CardContainer>
                      {offer.discountPercentage > 0 && (
                        <Card.Badge>{offer.discountPercentage}% OFF</Card.Badge>
                      )}
                      <Card.CategoryIcon
                        category={offer.categoryName}
                        categoryLabel={offer.categoryLabel}
                        categoryImage={
                          offer.categoryImagePath
                            ? `${fileBase}/${offer.categoryImagePath}`
                            : null
                        }
                      />
                      <Card.FlavorColors colors={offer.flavorColors} flavorNames={offer.flavorNames} />
                      {/* A missing image must stay `null` so <Card.CardPhoto />
                          shows its "Gallery Pending" placeholder instead of
                          requesting `${fileBase}/undefined`. */}
                      <Card.CardPhoto
                        src={
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
                        campaignName={campaign.title}
                        href={`/products/${offer.item.slug}`}
                      />
                    </Card.CardContainer>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;

