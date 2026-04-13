"use client";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import CategoryImage from "@/public/assets/categoryImage.jpg";
import { ArrowRight, Loader2, Plus, Star } from "lucide-react";
import Image from "next/image.js";
import { useEffect, useState } from "react";

const Categories = ({ categories = [] }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Set default active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // Fetch product for active category using native fetch
  useEffect(() => {
    const fetchProduct = async () => {
      if (!activeCategoryId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${backendURL}/product?categoryId=${activeCategoryId}&limit=1`);
        const result = await response.json();
        console.log("result",result);
        setProduct(result.data?.[0] || null);
      } catch (error) {
        console.error("Error fetching category product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [activeCategoryId, backendURL]);

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
            {isLoading ? (
               <div className="flex items-center justify-center p-20 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 w-full max-w-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-accentColor" />
              </div>
            ) : product ? (() => {
              const allFlavorImages = product.flavors?.flatMap(f => f.images) || [];
              const flavorColors = [...new Set(product.flavors?.map(f => f.flavor?.color).filter(Boolean))];
              const bgRemovePath = allFlavorImages[0]?.path
              // const mainImagePath = allFlavorImages.find(img => !img.path.toLowerCase().includes("removebg"))?.path || allFlavorImages[0]?.path;
              const allPrices = product.flavors?.flatMap(f => f.sizes?.map(s => s.price)).filter(p => p !== undefined && p !== null) || [];
              const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : "0";
              const categoryImagePath = product.category?.image?.path;

              return (
              <Card>
                <Card.CardContainer>
                  <Card.CategoryIcon 
                    category={product.category?.name?.toLowerCase()} 
                    categoryImage={categoryImagePath ? `${fileBase}/${categoryImagePath}` : null}
                  />
                  <Card.FlavorColors colors={flavorColors} />
                  <Card.BgRemoveImage
                    bgRemoveImage={bgRemovePath ? `${fileBase}/${bgRemovePath}` : null}
                  />
                  <Card.CardInfo
                    title={product.title}
                    price={minPrice}
                    href={`/products/${product.slug}`}
                  />
                  {/* Removed hover image and button wrapper as per refactoring plan */}
                </Card.CardContainer>
              </Card>
              );
            })() : (
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
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`text-2xl sm:text-3xl md:text-5xl lg:text-7xl transition-all duration-500 hover:text-accentColor uppercase tracking-tighter ${
                      activeCategoryId === cat.id ? "opacity-100 font-bold scale-110" : "opacity-30 font-medium hover:opacity-60"
                    }`}
                    onClick={() => setActiveCategoryId(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
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
