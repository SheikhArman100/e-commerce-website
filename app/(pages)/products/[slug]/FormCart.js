"use client";
import Button from "@/Components/Button.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { cartSchema } from "@/libs/zod_schema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AddToWishList from "./AddToWishList.js";
import FlavorSelect from "./FlavorSelect.js";
import Quantity from "./Quantity.js";
import SizeSelect from "./SizeSelect.js";

const FormCart = ({
  product,
  productId,
  onFlavorChange,
  onSizeChange,
  selectedFlavorIndex,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const router = useRouter();

  const selectedFlavor = product.flavors?.[selectedFlavorIndex] || product.flavors?.[0];
  const sizes = selectedFlavor?.sizes || [];
  const soldByQuantity = sizes[0]?.soldByQuantity;

  const methods = useForm({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      quantity: 1,
      flavorId: selectedFlavor?.flavor?.id?.toString() || "",
      sizeId: soldByQuantity ? null : sizes[0]?.size?.id?.toString() || "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = methods;

  const watchedSizeId = watch("sizeId");

  useEffect(() => {
    if (onSizeChange) {
      const sizeObj = sizes.find(
        (s) => s.size?.id?.toString() === watchedSizeId
      );
      onSizeChange(soldByQuantity ? null : sizeObj?.size?.name);
    }
  }, [watchedSizeId, onSizeChange, soldByQuantity, sizes]);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && isSubmitted) {
      toast.error("Please select all required options");
    }
  }, [errors, isSubmitted]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosPrivate.post("/cart", payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
      toast.success(data?.message || "Added to your cart");
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.info(error.response.data.message || "Already in your cart");
      } else if (error.response?.status === 401) {
        toast.error("Please sign in to add to your cart");
        router.push("/auth/signin");
      } else {
        toast.error(error.response?.data?.message || "Could not add to cart");
      }
    },
  });

  const handleCart = (data) => {
    const payload = {
      productId: productId.toString(),
      flavorId: data.flavorId,
      quantity: Number(data.quantity),
    };

    if (!soldByQuantity && data.sizeId) {
      payload.sizeId = data.sizeId.toString();
    }

    addToCartMutation.mutate(payload);
  };

  const isPending = addToCartMutation.isPending;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleCart)} className="w-full space-y-6 sm:space-y-8">
        {/* Flavor Selector */}
        {product.flavors?.length > 0 && (
          <FlavorSelect
            flavors={product.flavors}
            onChange={(idx) => {
              onFlavorChange(idx);
              const newFlavorSizes = product.flavors[idx]?.sizes || [];
              const isNewFlavorQuantityBased = newFlavorSizes[0]?.soldByQuantity;
              setValue(
                "flavorId",
                product.flavors[idx]?.flavor?.id?.toString() || ""
              );
              setValue(
                "sizeId",
                isNewFlavorQuantityBased
                  ? null
                  : newFlavorSizes[0]?.size?.id?.toString() || ""
              );
            }}
            selectedIndex={selectedFlavorIndex}
          />
        )}

        {/* Size Selector */}
        {!soldByQuantity && sizes.length > 0 && <SizeSelect sizes={sizes} />}

        {/* Quantity & CTA Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 pt-2">
          <Quantity />

          <div className="flex-1 flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-14 px-6 rounded-sm bg-accentColor text-bgColor hover:bg-accentColor/90 transition-all duration-300 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-bgColor" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 stroke-bgColor transition-transform group-hover:scale-110" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <AddToWishList productId={productId} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormCart;
