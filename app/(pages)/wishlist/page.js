import StatusChecker from "@/Components/StatusChecker.js";
import ShowWishlist from "./ShowWishlist.js";

const Wishlist = () => {
  return (
    <StatusChecker>
      <div className="relative w-full min-h-screen bg-bgColor text-textColor selection:bg-accentColor selection:text-bgColor overflow-x-hidden pt-24 md:pt-36 lg:pt-40 pb-24">
        <article className="w-full flex flex-col items-center px-6 lg:px-[2rem] xl:px-[4rem] 2xl:px-[8rem]">
          {/* Editorial Header */}
          <section className="w-full max-w-4xl text-center flex flex-col items-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-accentColor tracking-tighter mb-6">
              Your Wishlist
            </h1>
            <p className="text-stone-500 text-sm md:text-base font-light tracking-wide max-w-[35rem] leading-relaxed">
              A curated collection of your personal desires. Whenever you're ready, we'll be here to carefully wrap and deliver your selections.
            </p>
          </section>

          {/* Separation Line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-textColor/10 to-transparent mb-12 md:mb-20" />
          
          <ShowWishlist/>
        </article>
      </div>
     </StatusChecker>
  );
};

export default Wishlist;
