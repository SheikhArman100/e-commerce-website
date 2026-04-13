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
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { toast } from "react-toastify";

const AddToWishList = ({ productId }) => {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  // const { data } = useWishlist();
  // const wishlist = data?.wishlist;
  // const isInWishlist = wishlist?.some(
  //   (product) => product.productId === productId
  // );

  // Wishlist Mutation (Atomic Toggle)
  const wishlistMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.post("/wishlist", data, {
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
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleWishlist = () => {
    wishlistMutation.mutate({ productId:String(productId) });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
          type="button"
            className="p-2 border border-white mt-4 "
            onClick={handleWishlist}
          >
            <Heart
              strokeWidth="1"
              className="stroke-white"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent className=" bg-white text-black">
          <p className="font2">Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AddToWishList;
