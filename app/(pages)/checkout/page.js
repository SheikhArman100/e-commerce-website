"use client";
import Button from "@/Components/Button";
import RevealTitle from "@/Components/RevealTitle";
import StatusChecker from "@/Components/StatusChecker.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import useCarts from "@/hooks/useCarts.js";
import { checkoutSchema } from "@/libs/zod_schema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormCheckout from "./FormCheckout";
import OrderList from "./OrderList.js";
import React from "react";

const Checkout = () => {
  const axiosPrivate = useAxiosPrivate();
  const { data } = useCarts();
  const router = useRouter();
  const queryClient = useQueryClient();

  const cartData = data?.data;
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.totals?.totalAmount || 0;

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === "PERCENTAGE" 
        ? (subtotal * appliedCoupon.discountValue) / 100 
        : appliedCoupon.discountValue)
    : 0;
    
  const totalInvestment = subtotal - discountAmount;

  //form setup
  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
  });
  const { handleSubmit, reset } = methods;

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axiosPrivate.patch("/user/profile", updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-profile"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile details");
    }
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      // User requested POST /api/v1/orders
      const response = await axiosPrivate.post("/order", orderData);
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to finalize order");
    }
  });

  // Payment initiate mutation
  const paymentInitiateMutation = useMutation({
    mutationFn: async (paymentData) => {
      // User requested POST /api/v1/payment/initiate
      const response = await axiosPrivate.post("/payment/initiate", paymentData);
      return response.data;
    },
    onSuccess: (resData) => {
      // Redirect user to SSLCommerz GatewayPageURL
      if (resData?.data?.GatewayPageURL) {
        window.location.href = resData.data.GatewayPageURL;
      } else if (resData?.GatewayPageURL) {
        // Just in case data is flat
        window.location.href = resData.GatewayPageURL;
      } else {
        toast.error("Failed to retrieve payment gateway URL");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
  });

  const handleCheckoutForm = (formData) => {
    if (cartItems.length === 0) {
      toast.error("Your selection is empty");
      return;
    }

    // Step 1: Update Profile (Optional: Update address if changed)
    updateProfileMutation.mutate({
      name: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      road: formData.road,
    }, {
      onSuccess: () => {
        // Step 2: Create Order from cart (POST /api/v1/orders)
        const orderPayload = {};
        if (appliedCoupon?.code) {
          orderPayload.couponCode = appliedCoupon.code;
        }

        createOrderMutation.mutate(orderPayload, {
          onSuccess: (orderRes) => {
            // Step 3: Payment Initiation (POST /api/v1/payment/initiate)
            // Use orderId from the created order object
            const orderId = orderRes.data?._id || orderRes.data?.id || orderRes._id || orderRes.id;
            
            if (orderId) {
              paymentInitiateMutation.mutate({ orderId });
            } else {
              toast.error("Order created but ID not found");
            }
          }
        });
      }
    });
  };

  const isProcessing = updateProfileMutation.isPending || createOrderMutation.isPending || paymentInitiateMutation.isPending;

  return (
    <StatusChecker>
      <article className="w-full min-h-screen bg-bgColor relative overflow-hidden flex flex-col items-center pt-24 pb-20 px-6 md:px-12 lg:px-24">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentColor/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accentColor/3 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] flex flex-col items-center">
          <header className="mb-16 md:mb-24 flex flex-col items-center text-center">
            <span className="text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.5em] font-black text-stone-500 mb-4">
              Final Steps
            </span>
            <RevealTitle
              phrases={["Complete Purchase"]}
              phraseStyle="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-white leading-tight"
            />
            <div className="h-[1px] w-12 bg-accentColor mt-8 opacity-50" />
          </header>

          <FormProvider {...methods}>
            <form
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
              onSubmit={handleSubmit(handleCheckoutForm)}
              autoComplete="off"
            >
              <div className="lg:col-span-8">
                <FormCheckout 
                  appliedCoupon={appliedCoupon} 
                  setAppliedCoupon={setAppliedCoupon} 
                  subtotal={subtotal} 
                />
              </div>
              
              <div className="lg:col-span-4 relative">
                <div className="sticky top-32">
                  <OrderList 
                    appliedCoupon={appliedCoupon} 
                    discountAmount={discountAmount}
                    totalInvestment={totalInvestment}
                  />
                  
                  <Button 
                    className="mt-12 w-full h-16 group bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-xl border-0" 
                    type="submit"
                    disabled={isProcessing}
                  >
                    <Button.Border1 className="border-accentColor2/30 z-[1] group-hover:scale-x-105 transition-transform" />
                    <Button.Border2 className="border-accentColor2/30 z-[2] group-hover:scale-x-105 transition-transform" />
                    <Button.Title className="font-black uppercase tracking-[0.3em] text-[0.75rem] text-bgColor">
                      {isProcessing ? "Processing Selection..." : "Place Final Order"}
                    </Button.Title>
                    <Button.Icon>
                      <Plus size={18} className="stroke-bgColor group-hover:rotate-90 transition-transform duration-500" />
                    </Button.Icon>
                  </Button>

                  <p className="mt-6 text-[0.55rem] uppercase tracking-[0.2em] text-stone-600 text-center leading-loose">
                    By placing your order, you agree to our<br/>terms of artisanal service and privacy.
                  </p>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </article>
    </StatusChecker>
  );
};

export default Checkout;
