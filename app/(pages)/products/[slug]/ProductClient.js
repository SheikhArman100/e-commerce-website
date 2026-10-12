"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowLeft,
  Sparkles,
  Truck,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  Info,
} from "lucide-react";
import Card from "@/Components/Card.js";
import { resolveProductOffer } from "@/libs/productOffer.js";
import { AccordionComponent } from "./AccordionComponent.js";
import FormCart from "./FormCart.js";
import ReviewSection from "./ReviewSection.js";
import { cn } from "@/libs/utils";

const ProductClient = ({ product, similarProducts = [] }) => {
  const [selectedFlavorIndex, setSelectedFlavorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) return null;

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const flavors = product.flavors || [];
  const selectedFlavor = flavors[selectedFlavorIndex] || flavors[0];
  const flavorImages = selectedFlavor?.images || [];

  // Active gallery image
  const activeImageIndex =
    selectedImageIndex < flavorImages.length ? selectedImageIndex : 0;
  const mainImagePath = flavorImages[activeImageIndex]?.path;

  // Selected variant size data
  const sizeData = useMemo(() => {
    const sizes = selectedFlavor?.sizes || [];
    if (selectedSize) {
      return sizes.find((s) => s.size?.name === selectedSize) || sizes[0];
    }
    return sizes[0];
  }, [selectedFlavor, selectedSize]);

  // Price calculations. The API returns the exact campaign amount (a percentage
  // off a whole base price can land on a paisa), but the storefront quotes whole
  // taka — so round for display only; checkout math lives in libs/orderTotals.
  const originalPrice = Math.round(
    Number(sizeData?.originalPrice ?? sizeData?.price ?? 0)
  );
  const salesPrice = Math.round(Number(sizeData?.salesPrice ?? originalPrice));
  const hasDiscount = salesPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round((1 - salesPrice / originalPrice) * 100)
    : 0;
  const savingsAmount = hasDiscount ? originalPrice - salesPrice : 0;

  // Stock availability
  const stock = sizeData?.stock;
  const isOutOfStock = stock === 0;
  const isLowStock = typeof stock === "number" && stock > 0 && stock <= 3;

  // Accordion details
  const accordionItems = [
    {
      id: "tasting-notes",
      title: "Tasting Notes & Profile",
      icon: UtensilsCrossed,
      content: (
        <p>
          Each creation is handcrafted with layered harmony: a crisp, buttery foundation
          yielding to a velvety, fragrant center. Baked in small artisanal batches to
          preserve delicate flavor aromatics.
        </p>
      ),
    },
    {
      id: "ingredients",
      title: "Ingredients & Dietary Guide",
      icon: Info,
      content: (
        <div className="space-y-2">
          <p>
            European churned butter, Belgian chocolate, fresh dairy cream, unbleached flour,
            and pure fruit purées. No artificial colors or commercial preservatives.
          </p>
          <p className="text-[11px] text-stone-500 font-medium">
            Allergens: Contains dairy, gluten, and eggs. May contain traces of tree nuts.
          </p>
        </div>
      ),
    },
    {
      id: "storage",
      title: "Storage & Serving Advice",
      icon: Clock,
      content: (
        <p>
          Store chilled at 2°C–4°C in its original boutique packaging. For the optimal
          sensory texture, allow pastries to rest at room temperature for 15 minutes before
          serving. Best savored within 48 to 72 hours of delivery.
        </p>
      ),
    },
    {
      id: "delivery",
      title: "Chilled Delivery & Celebration",
      icon: Truck,
      content: (
        <p>
          Hand-delivered across Dhaka in insulated pastry cartons. Orders confirmed by 4 PM
          are scheduled for delivery within 24 to 48 hours. Custom celebration message cards
          can be personalized during checkout.
        </p>
      ),
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-bgColor pt-20 md:pt-28 pb-24 text-textColor">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-0 w-[550px] h-[550px] bg-accentColor/4 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 w-[600px] h-[600px] bg-accentColor2/4 rounded-full blur-[150px] -translate-x-1/3"
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Navigation / Breadcrumb */}
        <div className="pt-4 mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2 text-xs text-textColor/50">
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.2em] text-[10px] text-textColor/60 hover:text-accentColor transition-colors"
            >
              <ArrowLeft
                size={13}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Collections</span>
            </Link>
            <span>/</span>
            {product.category?.slug && (
              <>
                <Link
                  href={`/products?category=${encodeURIComponent(
                    product.category.slug
                  )}`}
                  className="hover:text-accentColor transition-colors font-medium capitalize"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-textColor font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.title}
            </span>
          </div>
        </div>

        {/* Two-Column Product Dossier */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-20 items-start">
          {/* Column 1: Gallery Showcase */}
          <div className="w-full lg:w-1/2 xl:w-[52%]">
            <div className="relative flex flex-col gap-4">
              {/* Main Showcase Stage */}
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl border border-textColor/10 bg-white/80 shadow-sm overflow-hidden flex items-center justify-center backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedFlavorIndex}-${activeImageIndex}-${mainImagePath}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="relative w-full h-full p-6 sm:p-10 flex items-center justify-center"
                  >
                    {mainImagePath ? (
                      <Image
                        src={`${fileBase}/${mainImagePath}`}
                        alt={product.title}
                        fill
                        priority
                        className="object-contain p-4 sm:p-8 hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-textColor/30">
                        <Sparkles className="w-12 h-12 stroke-[1] mb-2" />
                        <span className="text-xs font-light italic">
                          Artisan Photography Forthcoming
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Floating Category Pill */}
                {product.category?.name && (
                  <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-textColor/10 shadow-sm text-[10px] font-bold uppercase tracking-wider text-textColor/80">
                    <Star fill="#9B2242" stroke="none" className="w-2.5 h-2.5" />
                    <span>{product.category.name}</span>
                  </div>
                )}

                {/* Floating Discount Chip */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-accentColor text-bgColor shadow-md text-[10px] font-bold uppercase tracking-wider">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {flavorImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                  {flavorImages.map((img, i) => {
                    const isSelected = activeImageIndex === i;
                    return (
                      <button
                        key={img.id ?? i}
                        type="button"
                        onClick={() => setSelectedImageIndex(i)}
                        className={cn(
                          "relative h-18 w-18 sm:h-20 sm:w-20 rounded-lg border bg-white/80 shrink-0 overflow-hidden transition-all duration-200",
                          isSelected
                            ? "border-accentColor ring-2 ring-accentColor/30 shadow-sm scale-102"
                            : "border-textColor/10 hover:border-accentColor/40 opacity-70 hover:opacity-100"
                        )}
                        aria-label={`View photo ${i + 1}`}
                      >
                        <Image
                          fill
                          className="object-contain p-1.5"
                          src={`${fileBase}/${img.path}`}
                          alt={`${product.title} thumb ${i + 1}`}
                          sizes="80px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Delicacy Dossier & Actions */}
          <div className="w-full lg:w-1/2 xl:w-[48%] flex flex-col space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              {/* Campaign Indicator */}
              {product.activeCampaign && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentColor/10 border border-accentColor/25 text-accentColor text-[11px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-accentColor" />
                  <span>Part of {product.activeCampaign.title}</span>
                </div>
              )}

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font2 font-medium text-textColor tracking-tight leading-[1.15]">
                {product.title}
              </h1>

              {/* Live Rating (from verified reviews) */}
              <a
                href="#reviews"
                className="flex flex-wrap items-center gap-3 text-xs text-textColor/70 pt-1 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-0.5 text-accentColor">
                  {[...Array(5)].map((_, i) => {
                    const avg = Number(product?.reviewSummary?.average || 0);
                    return (
                      <Star
                        key={i}
                        stroke="none"
                        className="w-3.5 h-3.5"
                        fill={
                          i < Math.round(avg)
                            ? "currentColor"
                            : "rgba(60,32,32,0.15)"
                        }
                      />
                    );
                  })}
                </div>
                <span className="font-semibold text-textColor">
                  {Number(product?.reviewSummary?.average || 0) > 0
                    ? Number(product.reviewSummary.average).toFixed(1)
                    : "New"}
                </span>
                {(product?.reviewSummary?.count || 0) > 0 && (
                  <span className="text-textColor/50">
                    ({product.reviewSummary.count}{" "}
                    {product.reviewSummary.count === 1 ? "review" : "reviews"})
                  </span>
                )}
                <span className="text-textColor/30">·</span>
                <span className="uppercase tracking-widest text-[10px] font-bold text-textColor/60">
                  Artisan Handcrafted
                </span>
              </a>

              {/* Price Hero */}
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 pt-2">
                <span className="text-3xl sm:text-4xl font2 font-bold text-accentColor tracking-tight">
                  ৳{salesPrice}
                </span>

                {hasDiscount && (
                  <span className="text-base sm:text-lg text-stone-400 line-through font-normal">
                    ৳{originalPrice}
                  </span>
                )}

                {hasDiscount && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Save ৳{savingsAmount} ({discountPercentage}% off)
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    Currently sold out
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    Only {stock} remaining for today
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    Baked fresh upon order confirmation
                  </span>
                )}
              </div>

              {/* Editorial Description */}
              {product.description && (
                <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed border-l-2 border-accentColor/30 pl-4 py-1 italic">
                  {product.description}
                </p>
              )}
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-textColor/10" />

            {/* Interactive Customization & Cart Form */}
            <FormCart
              product={product}
              productId={product.id}
              onFlavorChange={(idx) => {
                setSelectedFlavorIndex(idx);
                setSelectedSize(null);
                setSelectedImageIndex(0);
              }}
              onSizeChange={setSelectedSize}
              selectedFlavorIndex={selectedFlavorIndex}
            />

            {/* Patisserie Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-textColor/10">
              <div className="flex items-start gap-3 p-3 rounded-md bg-white/50 border border-textColor/5">
                <Clock className="w-4 h-4 text-accentColor shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-textColor">Baked Fresh</h4>
                  <p className="text-[11px] text-stone-500 font-light leading-tight mt-0.5">
                    Made to order with 100% pure butter & cream
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md bg-white/50 border border-textColor/5">
                <Truck className="w-4 h-4 text-accentColor shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-textColor">Chilled Transit</h4>
                  <p className="text-[11px] text-stone-500 font-light leading-tight mt-0.5">
                    Temperature-controlled delivery across Dhaka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md bg-white/50 border border-textColor/5">
                <ShieldCheck className="w-4 h-4 text-accentColor shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-textColor">Artisan Craft</h4>
                  <p className="text-[11px] text-stone-500 font-light leading-tight mt-0.5">
                    Hand-decorated by master pastry specialists
                  </p>
                </div>
              </div>
            </div>

            {/* Comprehensive Detail Accordions */}
            <div className="pt-2">
              <AccordionComponent items={accordionItems} />
            </div>
          </div>
        </div>

        {/* Guest Reviews */}
        <ReviewSection product={product} />

        {/* Similar Specialties Section */}
        {similarProducts?.length > 0 && (
          <div className="mt-28 sm:mt-36 pt-16 border-t border-textColor/10">
            <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
              <div className="flex items-center gap-2 mb-2">
                <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
                <span className="text-accentColor text-[0.7rem] uppercase tracking-[0.3em] font-bold">
                  Curated Pairings
                </span>
                <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font2 font-medium text-textColor tracking-tight">
                Similar Specialties
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mt-2">
                Complement your selection with artisanal favorites from the same collection.
              </p>
            </div>

            {/* Grid of Authentic Cards */}
            <div className="w-full grid place-items-center grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
              {similarProducts.map((item, idx) => {
                const offer = resolveProductOffer(item);
                if (!offer) return null;

                const hasOfferDiscount = offer.discountPercentage > 0;

                return (
                  <Card key={item.id ?? idx} className="w-full max-w-[16rem]">
                    {hasOfferDiscount && (
                      <Card.Badge>
                        {offer.discountPercentage}% OFF
                      </Card.Badge>
                    )}

                    <Card.CardContainer>
                      <Card.CategoryIcon
                        category={offer.categoryName}
                        categoryLabel={offer.categoryLabel}
                        categoryImage={
                          offer.categoryImagePath
                            ? `${fileBase}/${offer.categoryImagePath}`
                            : null
                        }
                      />

                      <Card.FlavorColors
                        colors={offer.flavorColors}
                        flavorNames={offer.flavorNames}
                      />

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
                        href={`/products/${offer.item.slug}`}
                      />
                    </Card.CardContainer>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductClient;
