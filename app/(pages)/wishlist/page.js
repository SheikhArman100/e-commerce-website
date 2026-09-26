import StatusChecker from "@/Components/StatusChecker.js";
import ShowWishlist from "./ShowWishlist.js";
import { Star } from "lucide-react";

export const metadata = {
  title: "Wishlist | Baking Tales",
  description: "Your curated library of handcrafted pastries, cakes, and artisanal confections.",
};

const Wishlist = () => {
  return (
    <StatusChecker>
      <div className="relative w-full min-h-screen bg-bgColor text-textColor selection:bg-accentColor selection:text-bgColor overflow-x-hidden pt-24 md:pt-36 lg:pt-40 pb-28">
        {/* Ambient atmospheric bakery glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[600px] h-[350px] bg-accentColor/5 rounded-full blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 -right-24 w-[400px] h-[400px] bg-accentColor2/5 rounded-full blur-[140px]"
        />

        <article className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 lg:px-[2rem] xl:px-[4rem] 2xl:px-[8rem]">
          {/* Editorial Header */}
          <section className="w-full max-w-4xl text-center flex flex-col items-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-x-2 mb-3">
              <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
              <p className="text-textColor/70 text-[0.7rem] font-bold uppercase tracking-[0.25em]">
                Personal Library
              </p>
              <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font2 font-medium text-textColor tracking-tight mb-4">
              Your Curated <span className="text-accentColor">Wishlist</span>
            </h1>

            <p className="text-stone-500 text-xs sm:text-sm md:text-base font-light tracking-wide max-w-[34rem] leading-relaxed">
              A private collection of your chosen delicacies. Saved here for your forthcoming celebrations, milestones, and daily indulgences.
            </p>
          </section>

          {/* Delicate Section Divider */}
          <div className="w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-textColor/10 to-transparent mb-10 md:mb-14" />

          {/* Wishlist Grid & Interactions */}
          <ShowWishlist />
        </article>
      </div>
    </StatusChecker>
  );
};

export default Wishlist;
