"use client";
import Button from "@/Components/Button.js";
import Card from "@/Components/Card.js";
import useWishlist from "@/hooks/useWishlist.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ShowWishlist = () => {
  const {data,isPending}=useWishlist()
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const deleteWishlistMutation = useMutation({
    mutationFn: async (wishlistId) => {
      const response = await axiosPrivate.delete(`/wishlist/${wishlistId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Removed from wishlist");
      return await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-[40vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-t-2 border-accentColor border-solid rounded-full animate-spin"></div>
        <p className="text-stone-500 text-xs tracking-widest uppercase">Curating...</p>
      </div>
    );
  }

  // Premium Empty State
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 mb-8 text-black/20 flex items-center justify-center border border-textColor/10 rounded-full bg-textColor/5">
           <svg className="w-8 h-8 text-accentColor/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-medium text-textColor mb-4 tracking-tight">Your Library is Empty</h3>
        <p className="text-stone-500 font-light mb-8 max-w-md">Discover our collections and curate a selection of your favorite artisanal creations.</p>
        <Button href="/products" className="min-w-[12rem] bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-lg border-0">
          <Button.Border1 className="border-accentColor2/30 z-[1]" />
          <Button.Border2 className="border-accentColor2/30 z-[2]" />
          <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">Explore Boutique</Button.Title>
        </Button>
      </div>
    );
  }
  

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full grid place-items-center grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-10 lg:gap-12">
      {data?.data?.map((item) => {
        const product = item?.product;
        if (!product) return null;

        const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
        
        const allFlavorImages = product.flavors?.flatMap(f => f.images) || [];
        const flavorColors = [...new Set(product.flavors?.map(f => f.flavor?.color).filter(Boolean))];
        
        const mainImagePath = allFlavorImages[0]?.path;
        const allPrices = product.flavors?.flatMap(f => f.sizes?.map(s => ({
          original: s.originalPrice,
          sales: s.salesPrice,
          discount: s.discountPercentage
        }))).filter(p => p.original !== undefined) || [];
        
        const minPriceVariant = allPrices.reduce((min, curr) => 
          (curr.sales < min.sales) ? curr : min, 
          allPrices[0] || { original: "0", sales: "0", discount: 0 }
        );
        
        const hasDiscount = minPriceVariant.discount > 0;
        const categoryImagePath = product.category?.image?.path;

        return (
          <Card key={item.id} className="">
            {hasDiscount && (
              <Card.Badge>
                {minPriceVariant.discount}% OFF
              </Card.Badge>
            )}
            <Card.CardContainer>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteWishlistMutation.mutate(item.id);
                }}
                className="absolute top-3 right-3 p-1.5 sm:p-2 bg-bgColor/80 backdrop-blur text-textColor/50 rounded-full hover:bg-accentColor/10 hover:text-accentColor border border-textColor/10 hover:border-accentColor/30 transition-all z-20 shadow-sm"
                title="Remove from library"
                disabled={deleteWishlistMutation.isPending}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
              </button>
              <Card.CategoryIcon
                category={product.category?.name?.toLowerCase()}
                categoryImage={categoryImagePath ? `${fileBase}/${categoryImagePath}` : null}
              />
              <Card.FlavorColors colors={flavorColors} />
              <Card.BgRemoveImage
                bgRemoveImage={mainImagePath ? `${fileBase}/${mainImagePath}` : null}
              />
              <Card.CardInfo
                title={product.title}
                price={minPriceVariant.original}
                salesPrice={hasDiscount ? minPriceVariant.sales : null}
                discountPercentage={minPriceVariant.discount}
                href={`/products/${product.slug}`}
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
