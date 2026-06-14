"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip.jsx";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { toast } from "react-toastify";

const AddToWishList = ({ productId }) => {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  // Wishlist Mutation (simple POST — backend handles duplicates with 409)
  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.post("/wishlist", { productId: String(productId) }, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Wishlist updated");
      return await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Please sign in to manage your wishlist");
        router.push("/auth/signin");
      } else if (error.response?.status === 409) {
        toast.error("Already in your wishlist");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleWishlist = () => {
    wishlistMutation.mutate();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="p-2 border border-accentColor rounded-sm hover:bg-accentColor/10 transition-all duration-300 mt-4 lg:mt-0 h-16 w-16 flex items-center justify-center shrink-0"
            onClick={handleWishlist}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className="stroke-accentColor"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-black">
          <p className="font2">Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddToWishList;