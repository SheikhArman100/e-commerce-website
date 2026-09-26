"use client";

import Button from "@/Components/Button.js";
import {
  OrderSummarySkeleton,
  Skeleton,
} from "@/Components/Skeleton.js";
import RevealParagraph from "@/Components/RevealParagraph.js";
import RevealTitle from "@/Components/RevealTitle.js";
import StatusChecker from "@/Components/StatusChecker.js";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import useCarts from "@/hooks/useCarts.js";
import { cartSubtotal } from "@/libs/orderTotals.js";
import { checkoutSchema } from "@/libs/zod_schema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CheckoutForm from "./CheckoutForm.js";
import CheckoutSummary from "./CheckoutSummary.js";
import CouponPanel from "./CouponPanel.js";

const CheckoutLoadingState = () => (
  <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
    <div className="flex flex-col gap-y-10 lg:col-span-7 xl:col-span-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-12 w-full rounded-sm" />
        </div>
      ))}
    </div>
    <div className="lg:col-span-5 xl:col-span-4">
      <OrderSummarySkeleton />
    </div>
  </div>
);

const CheckoutEmptyState = () => (
  <div className="flex w-full flex-col items-center justify-center py-24 text-center">
    <div className="relative mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-textColor/10 bg-textColor/5">
      <ShoppingBag size={40} className="stroke-accentColor/30" />
      <div className="absolute right-0 top-0 h-4 w-4 rounded-full bg-accentColor2 opacity-50 blur-sm" />
    </div>
    <h3 className="mb-4 text-2xl font-medium tracking-tight text-textColor md:text-3xl">
      Nothing to Check Out
    </h3>
    <p className="mx-auto mb-10 max-w-sm font-light leading-relaxed text-stone-500">
      Your selection is empty, so there is nothing to pay for yet. Choose a
      creation from the boutique and it will be waiting here.
    </p>
    <Button
      href="/products"
      className="group h-14 min-w-[14rem] rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90"
    >
      <Button.Border1 className="z-[1] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
      <Button.Border2 className="z-[2] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
      <Button.Title className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor">
        Start Shopping
      </Button.Title>
    </Button>
  </div>
);

/**
 * The till.
 *
 * Two steps in one screen: the delivery details are PATCHed onto the customer's
 * profile (best effort — the order endpoint falls back to "N/A" for the gateway's
 * shipping block, so a refused profile sync must never cost someone their
 * order), then `POST /order` is asked to start the order. The API answers with a
 * `GatewayPageURL`, which is where the browser goes next; the order itself is
 * only completed when the gateway calls back, so this page never claims the
 * purchase happened.
 *
 * The coupon comes from `POST /coupon/validate` (see CouponPanel) and travels on
 * as `couponCode`; the rail prices it with the API's own caps, so the subtotal,
 * reward, delivery and payable figures all match what the gateway will charge.
 */
const Checkout = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { data, isPending } = useCarts();

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const items = data?.data?.items ?? [];
  const subtotal = data?.data?.totals?.totalAmount ?? cartSubtotal(items);

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const createOrderMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosPrivate.post("/order", payload);
      return response.data;
    },
    onSuccess: (result) => {
      const gatewayUrl = result?.data?.GatewayPageURL;

      if (!gatewayUrl) {
        toast.error(
          "The payment gateway did not return a link. Nothing was charged — please try again."
        );
        return;
      }

      // Payment completion clears the cart server side, and the customer
      // returns from the gateway on a fresh page load, so drop the cache now.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      window.location.href = gatewayUrl;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "We could not start your order. Please try again."
      );
    },
  });

  const handleCheckoutForm = async (formData) => {
    if (items.length === 0) {
      toast.error("Your selection is empty");
      return;
    }

    // Best effort: the delivery details only decorate the gateway's shipping
    // block, so a refusal is a warning, never a dead end.
    try {
      await axiosPrivate.patch("/user/profile", {
        name: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        road: formData.road,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
        refetchType: "all",
      });
    } catch (error) {
      toast.warn(
        error.response?.data?.message ||
          "We could not save your delivery details, but your order can still be placed."
      );
    }

    createOrderMutation.mutate(
      appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}
    );
  };

  const isProcessing = createOrderMutation.isPending || isSubmitting;

  return (
    <StatusChecker>
      <article className="relative flex w-full min-h-screen flex-col items-center overflow-hidden bg-bgColor pt-24 pb-20 px-6 md:px-12 lg:px-24">
        {/* Atmospheric Background Glows */}
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accentColor/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accentColor/[0.03] blur-[100px]" />

        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center">
          <header className="mb-16 flex flex-col items-center text-center md:mb-24">
            <span className="mb-4 text-[0.6rem] font-black uppercase tracking-[0.5em] text-stone-500 md:text-[0.7rem]">
              Final Steps
            </span>

            <RevealTitle
              phrases={["Complete Purchase"]}
              phraseStyle="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-textColor leading-tight"
            />

            <div className="mt-8 h-[1px] w-12 bg-accentColor opacity-50" />

            <RevealParagraph
              phrases={[
                "Confirm where your creation should travel, add a reward if you have one, then continue to our secure payment partner to finish the order.",
              ]}
              phraseStyle="text-[0.7rem] md:text-xs text-stone-500 leading-relaxed font-light uppercase tracking-[0.15em]"
              containerStyle="max-w-[42rem] mt-8"
            />
          </header>

          {isPending ? (
            <CheckoutLoadingState />
          ) : items.length === 0 ? (
            <CheckoutEmptyState />
          ) : (
            <FormProvider {...methods}>
              <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit(handleCheckoutForm)}
                className="grid w-full grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20"
              >
                <div className="flex flex-col gap-y-16 lg:col-span-7 xl:col-span-8">
                  <CheckoutForm />

                  <CouponPanel
                    subtotal={subtotal}
                    appliedCoupon={appliedCoupon}
                    onApply={setAppliedCoupon}
                    onRemove={() => setAppliedCoupon(null)}
                  />
                </div>

                <div className="relative lg:col-span-5 xl:col-span-4">
                  <div className="sticky top-32">
                    <CheckoutSummary
                      items={items}
                      subtotal={subtotal}
                      coupon={appliedCoupon}
                    >
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="group mt-10 h-16 w-full rounded-sm border-0 bg-accentColor shadow-xl transition-all duration-300 hover:bg-accentColor/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accentColor"
                      >
                        <Button.Border1 className="z-[1] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
                        <Button.Border2 className="z-[2] border-accentColor2/30 transition-transform group-hover:scale-x-105" />
                        <Button.Title className="text-[0.75rem] font-black uppercase tracking-[0.3em] text-bgColor">
                          {isProcessing ? "Opening the Gateway…" : "Place Order & Pay"}
                        </Button.Title>
                        <Button.Icon>
                          <CreditCard
                            size={18}
                            className="stroke-bgColor transition-transform duration-500 group-hover:scale-110"
                          />
                        </Button.Icon>
                      </Button>

                      <p className="mt-6 text-center text-[0.5rem] uppercase leading-loose tracking-[0.2em] text-stone-500">
                        You will continue to SSLCommerz to pay securely.
                        <br />
                        The order is confirmed the moment the gateway answers —
                        we never store your card details.
                      </p>
                    </CheckoutSummary>
                  </div>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </article>
    </StatusChecker>
  );
};

export default Checkout;

