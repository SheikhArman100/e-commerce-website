"use client";
import Button from "@/Components/Button.js";
import Card from "@/Components/Card.js";
import { ProductGridSkeleton } from "@/Components/Skeleton.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import useWishlist from "@/hooks/useWishlist.js";
import { resolveProductOffer } from "@/libs/productOffer.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Heart, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

const ShowWishlist = () => {
  const { data, isPending, error, refetch } = useWishlist();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const deleteWishlistMutation = useMutation({
    mutationFn: async (wishlistId) => {
      const response = await axiosPrivate.delete(`/wishlist/${wishlistId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onMutate: async (wishlistId) => {
      // Cancel queries so optimistic update is not overwritten
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousData = queryClient.getQueryData(["wishlist"]);

      // Optimistically remove item from library
      queryClient.setQueryData(["wishlist"], (old) => {
        if (!old || !Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.filter((entry) => entry.id !== wishlistId),
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Removed from library");
    },
    onError: (err, _wishlistId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["wishlist"], context.previousData);
      }
      toast.error(err.response?.data?.message || "Failed to remove item");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // Skeleton state matching Card dimensions
  if (isPending) {
    return (
      <div className="w-full flex flex-col items-center py-6">
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto py-16 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-accentColor/10 border border-accentColor/20 flex items-center justify-center mb-6">
          <Heart className="w-7 h-7 text-accentColor stroke-[1.5]" />
        </div>
        <h3 className="text-xl font-medium font2 text-textColor mb-2">
          Unable to Load Your Library
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 font-light mb-6">
          We encountered an issue while retrieving your saved confections.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-6 py-2.5 rounded-sm bg-accentColor text-bgColor text-xs font-bold uppercase tracking-widest hover:bg-accentColor/90 transition-all shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = data?.data || [];
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  // Premium Empty State
  if (items.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-16 md:py-24 text-center max-w-lg mx-auto">
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center border border-textColor/10 rounded-full bg-white/70 shadow-sm backdrop-blur-sm">
          <Heart
            className="w-8 h-8 text-accentColor/40 stroke-[1.25]"
            fill="none"
          />
          <Sparkles className="w-3.5 h-3.5 text-accentColor2/60 absolute top-3 right-3 animate-pulse" />
        </div>
        <h3 className="text-2xl sm:text-3xl font2 font-medium text-textColor mb-3 tracking-tight">
          Your Library is Empty
        </h3>
        <p className="text-stone-500 text-xs sm:text-sm font-light mb-8 max-w-md leading-relaxed">
          Discover our handcrafted collection of cakes, tarts, and delicate pastries. Curate a personal treasury of your favorites.
        </p>
        <Button
          href="/products"
          className="min-w-[13rem] bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0"
        >
          <Button.Border1 className="border-accentColor2/30 z-[1]" />
          <Button.Border2 className="border-accentColor2/30 z-[2]" />
          <Button.Title className="font-bold text-xs uppercase tracking-widest text-bgColor">
            Explore Boutique
          </Button.Title>
          <Button.Icon>
            <ArrowRight className="stroke-bgColor w-3.5 h-3.5" />
          </Button.Icon>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] flex flex-col items-center">
      {/* Refined Count & Summary Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 sm:mb-10 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accentColor" />
          <span className="text-xs sm:text-sm text-textColor/80 font-medium">
            <strong className="text-accentColor font-bold font2 text-base">
              {items.length}
            </strong>{" "}
            {items.length === 1 ? "delicacy" : "delicacies"} preserved
          </span>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-textColor/60 hover:text-accentColor transition-colors"
        >
          <span>Discover more</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid of Authentic Cards */}
      <div className="w-full grid place-items-center grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-10 lg:gap-12">
        {items.map((item) => {
          const product = item?.product;
          if (!product) return null;

          const offer = resolveProductOffer(product);
          if (!offer) return null;

          const hasDiscount = offer.discountPercentage > 0;

          return (
            <Card key={item.id} className="w-full max-w-[16rem]">
              {hasDiscount && (
                <Card.Badge>
                  {offer.discountPercentage}% OFF
                </Card.Badge>
              )}

              <Card.CardContainer>
                {/* Refined Removal Button inside Card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteWishlistMutation.mutate(item.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-bgColor/90 backdrop-blur border border-textColor/15 text-textColor/60 hover:text-accentColor hover:border-accentColor/40 hover:bg-white shadow-sm transition-all duration-200"
                  title="Remove from library"
                  aria-label={`Remove ${offer.item.title} from wishlist`}
                  disabled={deleteWishlistMutation.isPending}
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
                </button>

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
          );
        })}
      </div>
    </div>
  );
};

export default ShowWishlist;
