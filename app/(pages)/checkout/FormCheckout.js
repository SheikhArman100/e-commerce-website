import useCoupons from "@/hooks/useCoupons.js";
import useUserProfile from "@/hooks/useUserProfile.js";

import { Ticket, X } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

const FormCheckout = ({ appliedCoupon, setAppliedCoupon, subtotal }) => {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Hooks
  const { data: profileData, isPending, error } = useUserProfile();
  const { useActiveCoupons, useValidateCoupon } = useCoupons();
  const { data: activeCoupons, isPending: loadingCoupons } = useActiveCoupons();
  const validateCouponMutation = useValidateCoupon();

  // Manual code state
  const [manualCode, setManualCode] = React.useState("");
  const [couponError, setCouponError] = React.useState("");

  const handleApplyCoupon = (code) => {
    setCouponError("");
    validateCouponMutation.mutate(
      { code, amount: subtotal },
      {
        onSuccess: (data) => {
          setAppliedCoupon(data);
          toast.success(`Coupon "${code}" applied!`);
          setManualCode("");
        },
        onError: (err) => {
          setCouponError(err.response?.data?.message || "Invalid coupon code");
        },
      }
    );
  };

  const userInfo = profileData;
  
  if (isPending) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accentColor" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <p className="text-stone-500 uppercase tracking-widest text-xs">Something went wrong during retrieval</p>
      </div>
    );
  }

  const inputClasses = "w-full rounded-sm border border-white/10 bg-white/[0.02] backdrop-blur-md px-6 py-4 text-[0.8rem] text-white placeholder:text-stone-600 focus:border-accentColor/50 focus:outline-0 transition-all duration-300 shadow-inner";
  const labelClasses = "text-[0.6rem] uppercase tracking-[0.3em] font-black text-stone-500 mb-3 block";
  const errorClasses = "text-[0.6rem] font-bold text-red-500 mt-2 tracking-wider flex items-center gap-1 uppercase before:content-['*']";

  return (
    <div className="w-full flex flex-col gap-y-16">
      {/* Shipping Section */}
      <section>
        <div className="flex items-center gap-x-6 mb-10">
           <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-white whitespace-nowrap">Shipping Destination</span>
           <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mt-2">
          {/* full name */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Full Curator Name</label>
            <input
              type="text"
              {...register("fullName")}
              defaultValue={userInfo?.name || ""}
              placeholder="e.g. Jean-Luc Picard"
              className={inputClasses}
            />
            {errors.fullName?.message && <p className={errorClasses}>{errors.fullName?.message}</p>}
          </div>

          {/* email */}
          <div className="opacity-60">
            <label className={labelClasses}>Contact Email (Registered)</label>
            <input
              type="email"
              {...register("email")}
              value={userInfo?.email || ""}
              readOnly
              className={`${inputClasses} cursor-not-allowed`}
            />
          </div>

          {/* Phone number */}
          <div>
            <label className={labelClasses}>Phone Number</label>
            <input
              type="tel"
              {...register("phoneNumber")}
              defaultValue={userInfo?.phoneNumber || ""}
              placeholder="+1 (555) 000-0000"
              className={inputClasses}
            />
            {errors.phoneNumber?.message && <p className={errorClasses}>{errors.phoneNumber?.message}</p>}
          </div>

          {/* Shipping Address */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Street Address</label>
            <input
              type="text"
              {...register("address")}
              defaultValue={userInfo?.detail?.address || ""}
              placeholder="Avenue des Champs-Élysées, 75008 Paris"
              className={inputClasses}
            />
            {errors.address?.message && <p className={errorClasses}>{errors.address?.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className={labelClasses}>City / Region</label>
            <input
              type="text"
              {...register("city")}
              defaultValue={userInfo?.detail?.city || ""}
              placeholder="Paris"
              className={inputClasses}
            />
            {errors.city?.message && <p className={errorClasses}>{errors.city?.message}</p>}
          </div>

          {/* House Details */}
          <div>
            <label className={labelClasses}>Road / Flat Details</label>
            <input
              type="text"
              {...register("road")}
              defaultValue={userInfo?.detail?.road || ""}
              placeholder="Flat 4A"
              className={inputClasses}
            />
            {errors.road?.message && <p className={errorClasses}>{errors.road?.message}</p>}
          </div>
        </div>
      </section>

      {/* Coupon Section */}
      <section className="flex flex-col gap-y-12">
        {/* Boutique Coupons */}
        <div className="p-8 border border-white/5 bg-white/[0.01] rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Ticket size={120} className="stroke-white" />
          </div>

          <div className="flex items-center gap-x-6 mb-8">
             <span className="text-[0.6rem] uppercase tracking-[0.4em] font-black text-stone-400 whitespace-nowrap">Artisanal Rewards</span>
             <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-6 bg-accentColor/10 border border-accentColor/20 rounded-sm">
              <div className="flex items-center gap-4">
                <Ticket size={20} className="stroke-accentColor" />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-widest font-black text-accentColor">{appliedCoupon.code}</p>
                  <p className="text-[0.55rem] uppercase tracking-widest text-stone-500 mt-1">
                    {appliedCoupon.discountType === "PERCENTAGE" ? `${appliedCoupon.discountValue}% OFF` : `$${appliedCoupon.discountValue} OFF`} APPLIED
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setAppliedCoupon(null)}
                className="p-2 hover:bg-accentColor/10 rounded-full transition-colors"
              >
                <X size={16} className="stroke-accentColor" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Manual Entry */}
              <div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="ENTER PRIVATE CODE"
                    value={manualCode}
                    onChange={(e) => {
                      setManualCode(e.target.value.toUpperCase());
                      if (couponError) setCouponError("");
                    }}
                    className="flex-1 bg-white/[0.02] border border-white/10 rounded-sm px-6 py-4 text-[0.7rem] tracking-[0.3em] uppercase text-white focus:border-accentColor/50 focus:outline-0 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(manualCode)}
                    disabled={!manualCode || validateCouponMutation.isPending}
                    className="px-8 bg-white/5 border border-white/10 text-[0.6rem] uppercase tracking-[0.2em] font-black hover:bg-white/10 transition-all disabled:opacity-20"
                  >
                    {validateCouponMutation.isPending ? "VALIDATING..." : "APPLY"}
                  </button>
                </div>
                {couponError && <p className={errorClasses + " mt-4"}>{couponError}</p>}
              </div>

              {/* Available Coupons */}
              {activeCoupons?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCoupons.map((coupon) => (
                    <button
                      key={coupon._id}
                      type="button"
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className="group p-6 border border-white/5 bg-white/[0.02] hover:border-accentColor/30 hover:bg-accentColor/[0.02] transition-all text-left rounded-sm relative overflow-hidden"
                    >
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] font-black text-stone-400 group-hover:text-accentColor transition-colors mb-2">{coupon.code}</p>
                      <p className="text-[0.5rem] uppercase tracking-widest text-stone-600">
                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% SAVINGS` : `$${coupon.discountValue} REWARD`}
                      </p>
                      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-12 h-12 bg-accentColor/5 blur-xl group-hover:bg-accentColor/10 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FormCheckout;

