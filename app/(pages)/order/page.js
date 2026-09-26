"use client";

import RevealParagraph from "@/Components/RevealParagraph.js";
import RevealTitle from "@/Components/RevealTitle.js";
import StatusChecker from "@/Components/StatusChecker.js";
import OrderContainer from "./OrderContainer.js";

/**
 * The order archive: a boutique framed hero ("Your Archive" eyebrow, revealed
 * title, ruby rule, one short line of copy) over <OrderContainer />, which owns
 * the queries, pagination and every state of the list.
 */
const Order = () => {
  return (
    <StatusChecker>
      <article className="relative flex w-full min-h-screen flex-col items-center overflow-hidden bg-bgColor pt-24 pb-20 px-6 md:px-12 lg:px-24">
        {/* Atmospheric Background Glows */}
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accentColor/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accentColor/[0.03] blur-[100px]" />

        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center">
          <header className="mb-16 flex flex-col items-center text-center md:mb-24">
            <span className="mb-4 text-[0.6rem] font-black uppercase tracking-[0.5em] text-stone-500 md:text-[0.7rem]">
              Your Archive
            </span>

            <RevealTitle
              phrases={["Order History"]}
              phraseStyle="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-textColor leading-tight"
            />

            <div className="mt-8 h-[1px] w-12 bg-accentColor opacity-50" />

            <RevealParagraph
              phrases={[
                "Every indulgence, kept in order. Follow each creation from the moment the boutique received it through to the knock at your door.",
              ]}
              phraseStyle="text-[0.7rem] md:text-xs text-stone-500 leading-relaxed font-light uppercase tracking-[0.15em]"
              containerStyle="max-w-[42rem] mt-8"
            />
          </header>

          <OrderContainer />
        </div>
      </article>
    </StatusChecker>
  );
};

export default Order;
