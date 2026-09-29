"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { useState } from "react";

/**
 * Shown when the storefront knows the API is unreachable, as opposed to a
 * product that genuinely does not exist.
 *
 * The distinction matters: a real product whose fetch failed must NOT render
 * the "Item Not Found" 404, because that tells the customer (and a crawler)
 * the product is gone when it is only temporarily unfetchable. This state says
 * "we can't reach the bakery right now", keeps the page's normal chrome and
 * typography, and offers a retry that re-runs the server fetch.
 *
 * Design note: it reuses the boutique's existing vocabulary — the same radial
 * glows as the cart/checkout heroes, the same eyebrow + serif headline + short
 * copy rhythm, the same accent rule — so a server outage never makes the site
 * look broken, just temporarily paused.
 */
const ServiceUnavailable = ({
  title = "The bakery is resting",
  message = "We can't reach our kitchen servers right now. This is on us, not on you — please try again in a moment.",
  retryLabel = "Try again",
  children,
}) => {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  // A full server round trip: `router.refresh()` re-runs the server component
  // and its `no-store` fetch, so a recovered API restores the real product
  // without a full page load.
  const retry = () => {
    setRetrying(true);
    router.refresh();
    // Cleared on a timer rather than in an effect keyed on the fetch, which
    // this component does not own — the server component above does.
    setTimeout(() => setRetrying(false), 1500);
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bgColor px-6 pt-32 pb-24">
      {/* Atmospheric Background Glows — same as the cart/checkout heroes, so
          an outage still reads as part of the same site. */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accentColor/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accentColor/[0.03] blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[42rem] text-center"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-textColor/10 bg-textColor/5 px-4 py-1.5 backdrop-blur-md">
          <WifiOff className="h-4 w-4 text-accentColor" />
          <span className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-accentColor">
            Temporarily Unavailable
          </span>
        </span>

        <h1 className="text-4xl font-light leading-tight tracking-tighter text-textColor md:text-6xl">
          {title}
        </h1>

        <div className="mx-auto mt-8 h-[1px] w-12 bg-accentColor opacity-50" />

        <p className="mx-auto mt-8 max-w-[36rem] text-xs font-light uppercase leading-relaxed tracking-[0.15em] text-stone-500 md:text-xs">
          {message}
        </p>

        {children}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            disabled={retrying}
            className="inline-flex items-center gap-2 rounded-full bg-accentColor px-8 py-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-bgColor transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} />
            <span>{retrying ? "Checking…" : retryLabel}</span>
          </button>

          <Link
            href="/products"
            className="rounded-full border border-textColor/15 px-8 py-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-textColor/70 transition-colors hover:border-accentColor hover:text-accentColor"
          >
            Browse the collection
          </Link>
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-stone-400">
          <AlertTriangle className="h-3 w-3" />
          Your cart and saved items are safe
        </p>
      </motion.div>
    </section>
  );
};

export default ServiceUnavailable;