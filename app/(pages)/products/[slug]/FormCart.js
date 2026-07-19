"use client";
import Button from "@/Components/Button.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import { cartSchema } from "@/libs/zod_schema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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

  const selectedFlavor = product.flavors[selectedFlavorIndex];
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
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = methods;

  const watchedSizeId = watch("sizeId");

  useEffect(() => {
    if (onSizeChange) {
      const sizeObj = sizes.find(
        (s) => s.size?.id?.toString() === watchedSizeId,
      );
      onSizeChange(soldByQuantity ? null : sizeObj?.size?.name);
    }
  }, [watchedSizeId, onSizeChange, soldByQuantity, sizes]);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && isSubmitted) {
      toast.error("Provide more info");
    }
  }, [errors, isSubmitted]);

  // add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosPrivate.post("cart", payload);
      return response.data;
    },
    onSuccess: async (data) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "all" });
      toast.success(data.message || "Added to cart");
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        router.push("/auth/signin");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleCart = (data) => {
    const payload = {
      productId: productId.toString(),
      flavorId: data.flavorId,
      quantity: data.quantity,
    };

    if (!soldByQuantity && data.sizeId) {
      payload.sizeId = data.sizeId;
    }

    addToCartMutation.mutate(payload);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleCart)} className="w-full space-y-8">
        <FlavorSelect
          flavors={product.flavors}
          onChange={(idx) => {
            onFlavorChange(idx);
            const newFlavorSizes = product.flavors[idx]?.sizes || [];
            const isNewFlavorQuantityBased = newFlavorSizes[0]?.soldByQuantity;
            methods.setValue(
              "flavorId",
              product.flavors[idx]?.flavor?.id?.toString() || "",
            );
            methods.setValue(
              "sizeId",
              isNewFlavorQuantityBased
                ? null
                : newFlavorSizes[0]?.size?.id?.toString() || "",
            );
          }}
          selectedIndex={selectedFlavorIndex}
        />

        {!soldByQuantity && <SizeSelect sizes={sizes} />}

        <div className="flex flex-col md:flex-row items-center gap-6">
          <Quantity />
          <div className="flex-1 flex items-center justify-center gap-x-4 w-full">
            <Button
              className="flex-1 lg:h-16 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-lg border-0"
              type="submit"
            >
              <Button.Border1 className="border-accentColor2/30 z-[1]" />
              <Button.Border2 className="border-accentColor2/30 z-[2]" />
              <Button.Title className="font-black uppercase tracking-[0.2em] text-[0.7rem] text-bgColor">
                Add to cart
              </Button.Title>
              <Button.Icon>
                <Plus className="stroke-bgColor h-4 w-4" />
              </Button.Icon>
            </Button>
            <AddToWishList productId={productId} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormCart;
