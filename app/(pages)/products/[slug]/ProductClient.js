"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { AccordionComponent } from "./AccordionComponent";
import FormCart from "./FormCart.js";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Card from "@/Components/Card.js";
import { cn } from "@/libs/utils";

const ProductClient = ({ product, similarProducts }) => {
  const [selectedFlavorIndex, setSelectedFlavorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) return null;

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const flavors = product.flavors || [];
  const selectedFlavor = flavors[selectedFlavorIndex] || flavors[0];
  const flavorImages = selectedFlavor?.images || [];
  
  // Gallery Logic: Handle index out of bounds on flavor change
  const activeImageIndex = selectedImageIndex < flavorImages.length ? selectedImageIndex : 0;
  const mainImagePath = flavorImages[activeImageIndex]?.path;
  
  const sizeData = useMemo(() => {
    const sizes = selectedFlavor?.sizes || [];
    if (selectedSize) {
      return sizes.find(s => s.size?.name === selectedSize) || sizes[0];
    }
    return sizes[0];
  }, [selectedFlavor, selectedSize]);

  const hasDiscount = sizeData?.discountPercentage > 0;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div 
      className="relative w-full bg-bgColor pt-24 "
    >
      {/* Immersive Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentColor/3 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accentColor2/3 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Navigation / Breadcrumb */}
        <motion.div variants={itemVariants} className="pt-8 mb-12">
           <Link href="/products" className="group inline-flex items-center gap-x-2 text-stone-500 hover:text-accentColor transition-colors duration-300">
             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Collections</span>
           </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-x-16 xl:gap-x-24">
          
          {/* Pillar 1: Immersive Gallery */}
          <div className="w-full lg:w-1/2 xl:w-[55%]">
            <motion.div variants={itemVariants} className="relative group">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] xl:aspect-square max-h-[750px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-white/50 border border-textColor/10  mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainImagePath}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="relative w-full h-full"
                  >
                    {mainImagePath ? (
                      <Image
                        src={`${fileBase}/${mainImagePath}`}
                        alt={product.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center italic text-stone-600">Gallery empty</div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Glassmorphic Tags */}
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  {product.activeCampaign && (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-accentColor text-bgColor text-[0.65rem] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/20"
                    >
                      {product.activeCampaign.title}
                    </motion.div>
                  )}
                  {sizeData?.stock <= 5 && sizeData?.stock > 0 && (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-red-500/90 text-white text-[0.6rem] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg"
                    >
                      Limited: {sizeData.stock} Left
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="mt-8 grid grid-cols-5 gap-4">
                {flavorImages.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      "relative aspect-square rounded-2xl md:rounded-[1.5rem] overflow-hidden bg-white/50 border cursor-pointer transition-all duration-300",
                      activeImageIndex === i ? "border-accentColor shadow-[0_0_15px_rgba(155,34,66,0.2)]" : "border-textColor/10 hover:border-accentColor/30"
                    )}
                  >
                    <Image
                      fill
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        activeImageIndex === i ? "opacity-100" : "opacity-40 hover:opacity-100"
                      )}
                      src={`${fileBase}/${img.path}`}
                      alt={`Thumbnail ${i}`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Pillar 2: Sticky Refined Info */}
          <div className="w-full lg:w-1/2 xl:w-[45%] mt-12 lg:mt-0">
            <div className=" space-y-12">
              
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex flex-col gap-y-2">
                  <div className="inline-flex items-center gap-x-2 px-4 py-1.5 rounded-full border border-accentColor/20 bg-accentColor/5 w-fit">
                    <Star fill="#9B2242" stroke="none" className="h-3 w-3" />
                    <span className="text-accentColor text-[0.6rem] uppercase tracking-[0.3em] font-black">
                      {product.category?.name}
                    </span>
                  </div>
                  {product.activeCampaign && (
                    <span className="text-[0.65rem] text-accentColor font-black uppercase tracking-[0.2em] italic opactiy-80">
                      Part of [{product.activeCampaign.title}]
                    </span>
                  )}
                </div>

                <h1 className="text-5xl xl:text-7xl text-textColor font-black leading-[1.1] tracking-tighter">
                  {product.title}
                </h1>

                <div className="flex flex-col gap-y-3">
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-[0.6rem] font-black px-3 py-1 rounded-full w-fit animate-pulse tracking-widest uppercase">
                      {sizeData.discountPercentage}% OFF
                    </span>
                  )}
                  <div className="flex items-center gap-x-4">
                    <span className="text-4xl font-black text-accentColor tracking-tight">
                      ${sizeData?.salesPrice || sizeData?.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-xl text-stone-600 line-through font-light italic">
                        ${sizeData.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-stone-500 text-base font-light leading-relaxed italic border-l-2 border-accentColor/20 pl-6">
                  {product.description}
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8 border-t border-white/5">
                <FormCart 
                  product={product} 
                  productId={product.id} 
                  onFlavorChange={(idx) => {
                    setSelectedFlavorIndex(idx);
                    setSelectedSize(null);
                    setSelectedImageIndex(0); // Reset image on flavor change
                  }} 
                  onSizeChange={setSelectedSize}
                  selectedFlavorIndex={selectedFlavorIndex}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts?.length > 0 && (
          <motion.div variants={itemVariants} className="mt-32 pt-24 border-t border-textColor/10">
            <div className="flex flex-col items-center mb-16">
              <span className="text-accentColor text-[0.6rem] uppercase tracking-[0.5em] font-black mb-4">Discover More</span>
              <h2 className="text-4xl xl:text-5xl text-textColor font-bold tracking-tight">Similar Specialties</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((item, idx) => {
                const allFlavorImages = item.flavors?.flatMap(f => f.images) || [];
                const flavorEntries = [
                  ...new Map(
                    (item.flavors || [])
                      .map((f) => [f.flavor?.color, f.flavor?.name])
                      .filter(([color]) => Boolean(color))
                  ).entries(),
                ].map(([color, name]) => ({ color, name }));
                const mainImagePath = allFlavorImages[0]?.path;
                
                const allVariants = item.flavors?.flatMap(f => f.sizes) || [];
                const validVariants = allVariants.filter(v => v.price !== undefined);
                
                // Get the lowest salesPrice variant
                const minPriceVariant = validVariants.reduce((min, curr) => 
                  (curr.salesPrice < min.salesPrice) ? curr : min, 
                  validVariants[0] || { price: "0", salesPrice: "0", discountPercentage: 0 }
                );

                const hasDiscount = minPriceVariant.discountPercentage > 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                  >
                    <Card className="w-full">
                      {hasDiscount && (
                        <Card.Badge>
                          {minPriceVariant.discountPercentage}% OFF
                        </Card.Badge>
                      )}
                      <Card.CardContainer>
                        <Card.CategoryIcon
                          category={item.category?.name?.toLowerCase()}
                          categoryLabel={item.category?.name}
                          categoryImage={item.category?.image?.path ? `${fileBase}/${item.category.image.path}` : null}
                        />
                        <Card.FlavorColors colors={flavorEntries} />
                        <Card.BgRemoveImage
                          bgRemoveImage={mainImagePath ? `${fileBase}/${mainImagePath}` : null}
                        />
                        <Card.CardInfo
                          title={item.title}
                          price={minPriceVariant.originalPrice || minPriceVariant.price}
                          salesPrice={hasDiscount ? minPriceVariant.salesPrice : null}
                          discountPercentage={minPriceVariant.discountPercentage}
                          href={`/products/${item.slug}`}
                        />
                      </Card.CardContainer>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductClient;
