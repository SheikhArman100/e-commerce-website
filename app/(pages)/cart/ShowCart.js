"use client";
import Button from "@/Components/Button.js";
import useCarts from "@/hooks/useCarts.js";
import { Plus } from "lucide-react";
import CartItem from "./CartItem.js";

const ShowCart = () => {
  const { data, isPending, error } = useCarts();

  const cartData = data?.data;
  const items = cartData?.items || [];
  const totals = cartData?.totals;

  if (isPending) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accentColor" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-stone-500">Failed to load your collection. Please try again later.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-24 text-center">
        {/* Elegant Empty State Graphic */}
        <div className="w-28 h-28 mb-10 text-black/20 flex items-center justify-center border border-textColor/10 rounded-full bg-textColor/5 relative">
          <svg 
            className="w-10 h-10 text-accentColor/30" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <div className="absolute top-0 right-0 w-4 h-4 bg-accentColor2 rounded-full blur-sm opacity-50" />
        </div>

        <h3 className="text-2xl md:text-3xl font-medium text-textColor mb-4 tracking-tight">Your Cart is Empty</h3>
        <p className="text-stone-500 font-light mb-10 max-w-sm mx-auto leading-relaxed">
          It seems you haven't discovered your next favorite indulgence yet. Explore our curated collections of artisanal delicacies.
        </p>

        <Button href="/products" className="min-w-[14rem] h-14 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-xl border-0 group">
          <Button.Border1 className="border-accentColor2/30 z-[1] group-hover:scale-x-105 transition-transform" />
          <Button.Border2 className="border-accentColor2/30 z-[2] group-hover:scale-x-105 transition-transform" />
          <Button.Title className="font-black uppercase tracking-[0.3em] text-[0.7rem] text-bgColor">Start Shopping</Button.Title>
        </Button>

        <div className="mt-16 flex items-center gap-x-4 opacity-20">
          <div className="h-px w-8 bg-textColor" />
          <span className="text-[0.5rem] tracking-[0.5em] uppercase font-black">Baking Tales</span>
          <div className="h-px w-8 bg-textColor" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
      {/* Items Section */}
      <section className="lg:col-span-8 flex flex-col">
        <div className="flex items-center gap-x-6 mb-12">
           <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500 whitespace-nowrap">Selected Delicacies</span>
           <div className="h-[1px] flex-1 bg-textColor/10" />
        </div>
        
        <div className="flex flex-col">
          {items.map((item, index) => (
            <div key={item.id} className="animate-reveal" style={{ animationDelay: `${index * 100}ms` }}>
              <CartItem
                cartId={item.id}
                image={item.productFlavorSize?.productFlavor?.images[0]?.path}
                title={item.product?.title}
                category={item.product?.category?.name}
                price={item.salesPrice}
                originalPrice={item.originalPrice}
                discountPercentage={item.discountPercentage}
                flavor={item.productFlavorSize?.productFlavor?.flavor}
                size={item.productFlavorSize?.size?.name}
                quantity={item.quantity}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Summary Section */}
      <section className="lg:col-span-4 relative">
        <div className="sticky top-32 p-10 bg-white/50 backdrop-blur-[20px] border border-textColor/10 rounded-sm shadow-2xl">
          <div className="flex items-center gap-x-3 mb-10">
             <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-500">Order Summary</span>
          </div>

          <div className="space-y-6 pb-10 border-b border-textColor/10 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <p className="text-[0.7rem] uppercase tracking-widest text-textColor font-bold leading-relaxed line-clamp-1">
                    {item.product?.title}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-[0.75rem] font-bold text-accentColor tracking-widest">৳{(item.salesPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-10 space-y-6">
            <div className="flex justify-between items-center text-stone-500">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] font-black">Subtotal</p>
              <span className="text-[0.8rem] font-medium tracking-widest text-textColor/80">৳{totals?.totalAmount?.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] font-black text-stone-500">Total Amount</p>
              <span className="text-2xl font-light tracking-tighter text-textColor">৳{totals?.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          <Button className="mt-12 w-full h-16 group bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-xl border-0" href="/checkout">
            <Button.Border1 className="border-accentColor2/30 z-[1] group-hover:scale-x-105 transition-transform" />
            <Button.Border2 className="border-accentColor2/30 z-[2] group-hover:scale-x-105 transition-transform" />
            <Button.Title className="font-black uppercase tracking-[0.3em] text-[0.75rem] text-bgColor">Complete Purchase</Button.Title>
            <Button.Icon>
              <Plus size={18} className="stroke-bgColor group-hover:rotate-90 transition-transform duration-500" />
            </Button.Icon>
          </Button>

          <p className="mt-6 text-[0.55rem] uppercase tracking-[0.2em] text-stone-600 text-center leading-loose">
            Shipping & taxes calculated at checkout.<br/>Secure boutique payment processing.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ShowCart;
