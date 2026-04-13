import RevealTitle from "@/Components/RevealTitle";
import StatusChecker from "@/Components/StatusChecker.js";
import ShowCart from "./ShowCart.js";

const Cart = () => {
  return (
    <StatusChecker>
      <article className="w-full min-h-screen bg-bgColor relative overflow-hidden flex flex-col items-center pt-24 pb-20 px-6 md:px-12 lg:px-24">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentColor/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accentColor/3 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1400px] flex flex-col items-center">
          <header className="mb-16 md:mb-24 flex flex-col items-center text-center">
            <span className="text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.5em] font-black text-stone-500 mb-4">
              Your Selection
            </span>
            <RevealTitle
              phrases={["Shopping Cart"]}
              phraseStyle="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-textColor leading-tight"
            />
            <div className="h-[1px] w-12 bg-accentColor mt-8 opacity-50" />
          </header>

          <ShowCart />
        </div>
      </article>
    </StatusChecker>
  );
};

export default Cart;
