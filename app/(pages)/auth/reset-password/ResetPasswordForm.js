"use client";
import Button from "@/Components/Button";
import { resetPasswordSchema } from "@/libs/zod_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";

const inputClass =
  "w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor";

/**
 * Step 2 of the reset flow — PUT /auth/reset-Password?token=… (exact backend
 * casing) with { newPassword }. Backend hashes, revokes all sessions and the
 * token is single-purpose, so the user signs in fresh afterwards.
 */
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [show, setShow] = useState({ next: false, confirm: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const resetMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPublic.put(
        `/auth/reset-Password?token=${encodeURIComponent(token || "")}`,
        { newPassword: data.newPassword }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully");
      router.push("/auth/signin");
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error.response?.data?.message ||
          "Password reset failed"
      );
    },
  });

  if (!token) {
    return (
      <div className="mt-8 flex w-full flex-col items-center gap-y-4 rounded-md border border-textColor/10 bg-white/50 p-8 text-center">
        <p className="text-lg font-semibold text-textColor">Invalid reset link</p>
        <p className="text-sm text-stone-500">
          This link is missing its token. Please request a fresh one.
        </p>
        <Link
          href="/auth/forget-password"
          className="text-xs font-bold uppercase tracking-widest text-accentColor hover:underline"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => resetMutation.mutate(data))}
      className="w-full flex flex-col items-center gap-y-6 mt-8"
    >
      <div className="w-full flex flex-col gap-y-2">
        <label className="text-sm font-semibold text-stone-500">New Password</label>
        <div className="relative">
          <input
            type={show.next ? "text" : "password"}
            {...register("newPassword")}
            placeholder="••••••••"
            className={inputClass}
          />
          {/* <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-stone-500">
            <Lock size={16} />
          </span> */}
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
            className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500 hover:text-accentColor transition-colors"
            aria-label={show.next ? "Hide password" : "Show password"}
          >
            {show.next ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.newPassword?.message && (
          <p className="text-xs font-semibold text-red-500">
            {errors.newPassword?.message}
          </p>
        )}
      </div>
      <div className="w-full flex flex-col gap-y-2">
        <label className="text-sm font-semibold text-stone-500">Confirm New Password</label>
        <div className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="••••••••"
            className={inputClass}
          />
          {/* <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-stone-500">
            <Lock size={16} />
          </span> */}
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500 hover:text-accentColor transition-colors"
            aria-label={show.confirm ? "Hide password" : "Show password"}
          >
            {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword?.message && (
          <p className="text-xs font-semibold text-red-500">
            {errors.confirmPassword?.message}
          </p>
        )}
      </div>
      <Button className="w-full h-[3.5rem] mt-4 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0">
        <Button.Border1 className="border-accentColor2/30 z-[1]" />
        <Button.Border2 className="border-accentColor2/30 z-[2]" />
        <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">
          {resetMutation.isPending ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <span>Reset password</span>
          )}
        </Button.Title>
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
