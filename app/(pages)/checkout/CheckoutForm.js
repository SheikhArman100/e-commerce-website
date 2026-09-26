"use client";

import useUserProfile from "@/hooks/useUserProfile.js";
import { AlertTriangle, Loader2, UserCheck } from "lucide-react";
import Link from "next/link.js";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const INPUT_CLASSES =
  "w-full rounded-sm border border-textColor/15 bg-white/80 px-6 py-4 text-[0.8rem] text-textColor shadow-sm backdrop-blur-md transition-all placeholder:text-stone-400 focus:border-accentColor focus:outline-0 disabled:opacity-50";
const LABEL_CLASSES =
  "mb-3 block text-[0.6rem] font-black uppercase tracking-[0.3em] text-stone-600";
const ERROR_CLASSES =
  "mt-2 text-[0.6rem] font-bold uppercase tracking-wider text-red-500";

/**
 * Delivery details, seeded from the signed-in customer's own profile.
 *
 * `GET /user/profile` returns `{ name, email, phoneNumber, detail: { address,
 * city, road } }`, and those five fields are exactly what `PATCH /user/profile`
 * accepts — the same five the order endpoint reads when it builds the gateway's
 * shipping block. They are pushed in with `reset(..., { keepDirtyValues: true })`
 * so a customer who is already typing is never overwritten by the arriving
 * profile.
 *
 * The email is shown, never submitted: it belongs to the account, order
 * confirmations follow it, and registering it as a required field used to block
 * submission outright whenever a profile had no email.
 */
const CheckoutForm = () => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const { data: profile, isPending, isError } = useUserProfile();

  useEffect(() => {
    if (!profile) return;

    reset(
      {
        fullName: profile.name ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.detail?.address ?? "",
        city: profile.detail?.city ?? "",
        road: profile.detail?.road ?? "",
      },
      { keepDirtyValues: true }
    );
  }, [profile, reset]);

  return (
    <div className="flex w-full flex-col gap-y-16">
      <section>
        <div className="mb-10 flex items-center gap-x-6">
          <span className="whitespace-nowrap text-[0.6rem] font-black uppercase tracking-[0.4em] text-stone-600">
            01 — Delivery Details
          </span>
          <div className="h-[1px] flex-1 bg-textColor/10" />
        </div>

        {isPending && (
          <p className="mb-8 flex items-center gap-x-2 text-[0.55rem] font-black uppercase tracking-[0.25em] text-stone-400">
            <Loader2 size={13} className="animate-spin stroke-accentColor/60" />
            Loading your saved details…
          </p>
        )}

        {isError && (
          <p className="mb-8 flex items-center gap-x-2 text-[0.55rem] font-black uppercase tracking-[0.25em] text-stone-500">
            <AlertTriangle size={13} className="stroke-amber-500" />
            We could not load your saved details — please enter them below.
          </p>
        )}

        {!isPending && !isError && profile && (
          <p className="mb-8 flex items-center gap-x-2 text-[0.55rem] font-black uppercase tracking-[0.25em] text-stone-400">
            <UserCheck size={13} className="stroke-accentColor/60" />
            Prefilled from your account — edit anything before ordering
          </p>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className={LABEL_CLASSES}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Ayesha Rahman"
              className={INPUT_CLASSES}
              {...register("fullName")}
            />
            {errors.fullName?.message && (
              <p className={ERROR_CLASSES}>{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className={LABEL_CLASSES}>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={INPUT_CLASSES}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber?.message && (
              <p className={ERROR_CLASSES}>{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={LABEL_CLASSES}>
              Contact Email
            </label>
            <input
              id="email"
              type="email"
              readOnly
              value={profile?.email ?? ""}
              placeholder="Signed in account"
              aria-describedby="email-note"
              className={`${INPUT_CLASSES} cursor-not-allowed opacity-60`}
            />
            {/* <p
              id="email-note"
              className="mt-2 text-[0.5rem] uppercase tracking-[0.2em] text-stone-400"
            >
              Order updates follow this address —{" "}
              <Link href="/auth/profile" className="text-accentColor underline">
                change it in your profile
              </Link>
            </p> */}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className={LABEL_CLASSES}>
              Street Address
            </label>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              placeholder="House 12, Road 5, Dhanmondi"
              className={INPUT_CLASSES}
              {...register("address")}
            />
            {errors.address?.message && (
              <p className={ERROR_CLASSES}>{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className={LABEL_CLASSES}>
              City / Region
            </label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Dhaka"
              className={INPUT_CLASSES}
              {...register("city")}
            />
            {errors.city?.message && (
              <p className={ERROR_CLASSES}>{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="road" className={LABEL_CLASSES}>
              Road / Flat Details
            </label>
            <input
              id="road"
              type="text"
              autoComplete="address-line2"
              placeholder="Flat 4A, Mirpur Road"
              className={INPUT_CLASSES}
              {...register("road")}
            />
            {errors.road?.message && (
              <p className={ERROR_CLASSES}>{errors.road.message}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutForm;
