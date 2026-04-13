import React from "react";
import OrderItem from "./OrderItem.js";
import useCarts from "@/hooks/useCarts.js";

const OrderList = ({ appliedCoupon, discountAmount, totalInvestment }) => {
  const { data, isPending, error } = useCarts();

  const cartData = data?.data;
  const items = cartData?.items || [];
  const totals = cartData?.totals;

  if (isPending) {
    return (
      <div className="w-full h-[30vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-accentColor" />
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="w-full p-8 border border-white/5 bg-white/[0.01] rounded-sm text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-stone-600">No treasures found in your selection</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white/[0.02] backdrop-blur-[20px] border border-white/10 rounded-sm shadow-2xl">
      <div className="flex items-center gap-x-3 mb-10">
         <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500">Your Selection</span>
      </div>

      <div className="space-y-2 pb-10 border-b border-white/5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-4">
        {items.map((item) => (
          <OrderItem
            key={item.id}
            image={item.productFlavorSize?.productFlavor?.images[0]?.path}
            title={item.product?.title}
            category={item.product?.category?.name}
            price={item.salesPrice}
            flavor={item.productFlavorSize?.productFlavor?.flavor}
            size={item.productFlavorSize?.size?.name}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="pt-10 space-y-6">
        <div className="flex justify-between items-center text-stone-500">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] font-black">Subtotal</p>
          <span className="text-[0.8rem] font-medium tracking-widest text-white/80">${totals?.totalAmount?.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-accentColor">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] font-black flex items-center gap-2">
              Reward: {appliedCoupon.code}
            </p>
            <span className="text-[0.8rem] font-medium tracking-widest">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-stone-500">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] font-black">Boutique Shipping</p>
          <span className="text-[0.8rem] font-medium tracking-widest text-accentColor">Complimentary</span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] font-black text-stone-400">Total Investment</p>
          <span className="text-2xl font-light tracking-tighter text-white">${totalInvestment.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
