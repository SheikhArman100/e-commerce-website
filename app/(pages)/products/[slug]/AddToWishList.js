"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip.jsx";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import useWishlist from "@/hooks/useWishlist.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { toast } from "react-toastify";

const AddToWishList = ({ productId }) => {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { data: wishlistData } = useWishlist();

  // Find if this product is already in the user's wishlist
  const wishlistItem = (wishlistData?.data || []).find((item) => {
    return (
      String(item.productId) === String(productId) ||
      String(item.product?.id) === String(productId)
    );
  });

  const isWishlisted = Boolean(wishlistItem);

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post(
        "/wishlist",
        { productId: String(productId) },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Saved to wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Please sign in to save delicacies");
        router.push("/auth/signin");
      } else if (error.response?.status === 409) {
        toast.info("Already in your wishlist");
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      } else {
        toast.error(error.response?.data?.message || "Could not update wishlist");
      }
    },
  });

  // Remove Mutation
  const removeMutation = useMutation({
    mutationFn: async (wishlistId) => {
      const response = await axiosPrivate.delete(`/wishlist/${wishlistId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    },
  });

  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleToggle = (e) => {
    e.preventDefault();
    if (isPending) return;

    if (isWishlisted && wishlistItem) {
      removeMutation.mutate(wishlistItem.id);
    } else {
      addMutation.mutate();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border transition-all duration-300 shadow-sm ${
              isWishlisted
                ? "border-accentColor/40 bg-accentColor/10 text-accentColor shadow-[0_0_15px_rgba(155,34,66,0.15)]"
                : "border-textColor/15 bg-white text-textColor/60 hover:border-accentColor/40 hover:text-accentColor hover:bg-accentColor/5"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-accentColor" />
            ) : (
              <Heart
                size={20}
                strokeWidth={1.75}
                className={`transition-transform duration-300 group-hover:scale-110 ${
                  isWishlisted
                    ? "fill-accentColor stroke-accentColor"
                    : "stroke-current fill-transparent"
                }`}
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-textColor text-bgColor text-xs font-medium py-1.5 px-3 rounded shadow-lg border-0">
          <p>{isWishlisted ? "In your wishlist · Click to remove" : "Save to wishlist"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddToWishList;
