"use client";
import Button from "@/Components/Button.js";
import RevealTitle from "@/Components/RevealTitle";
import { BadgeCheck } from "lucide-react";
import { useSearchParams } from "next/navigation.js";

const Success = () => {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  return (
    <article className="w-full min-h-screen bg-bgColor relative overflow-hidden flex flex-col items-center pt-24 pb-20 px-6 md:px-12 lg:px-24">
      {/* Atmospheric Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentColor/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accentColor/3 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] flex flex-col items-center justify-center min-h-[70vh]">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <BadgeCheck size={48} className="stroke-green-500" />
          </div>
        </div>

        {/* Title */}
        <RevealTitle
          phrases={["Payment Successful"]}
          phraseStyle="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-textColor leading-tight text-center"
        />

        {/* Divider */}
        <div className="h-[1px] w-12 bg-accentColor mt-8 opacity-50" />

        {/* Message */}
        <p className="mt-8 text-[0.65rem] uppercase tracking-[0.2em] text-stone-500 text-center leading-relaxed max-w-md">
          Thank you for your purchase! Your order has been placed 
          <br />
          and is being prepared with artisanal care.
        </p>

        {tranId && (
          <p className="mt-6 text-[0.55rem] uppercase tracking-[0.2em] text-stone-400 text-center">
            Transaction ID: <span className="font-mono text-stone-500">{tranId}</span>
          </p>
        )}

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Button href="/order" className="group bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-xl border-0 h-14 w-full sm:w-auto min-w-[12rem]">
            <Button.Border1 className="border-accentColor2/30 z-[1] group-hover:scale-x-105 transition-transform" />
            <Button.Border2 className="border-accentColor2/30 z-[2] group-hover:scale-x-105 transition-transform" />
            <Button.Title className="font-black uppercase tracking-[0.3em] text-[0.75rem] text-bgColor">
              View Orders
            </Button.Title>
          </Button>

          <Button href="/products" className="group border border-stone-300 rounded-sm hover:bg-stone-50 transition-all duration-300 h-14 w-full sm:w-auto min-w-[12rem]">
            <Button.Title className="font-black uppercase tracking-[0.3em] text-[0.75rem] text-stone-600">
              Continue Shopping
            </Button.Title>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default Success;