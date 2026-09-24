"use client";
import Button from "@/Components/Button";
import { forgetPasswordSchema } from "@/libs/zod_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";

/**
 * Step 1 of the reset flow — POST /auth/forget-password with the account
 * email. Backend always returns success (even for unknown emails, to avoid
 * account enumeration) and mails a 3-minute reset link pointing at
 * /auth/reset-password?token=….
 */
const ForgetPasswordForm = () => {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgetPasswordSchema) });

  const forgetMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPublic.post("/auth/forget-password", {
        email: data.email,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setSent(true);
      toast.success(data.message || "Email sent successfully.");
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error.response?.data?.message ||
          "Request failed"
      );
    },
  });

  if (sent) {
    return (
      <div className="mt-8 flex w-full flex-col items-center gap-y-4 rounded-md border border-textColor/10 bg-white/50 p-8 text-center">
        <p className="text-lg font-semibold text-textColor">Check your inbox</p>
        <p className="text-sm text-stone-500">
          If an account exists for that email, a reset link is on its way. The
          link expires in 3 minutes.
        </p>
        <Link
          href="/auth/signin"
          className="text-xs font-bold uppercase tracking-widest text-accentColor hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => forgetMutation.mutate(data))}
      className="w-full flex flex-col items-center gap-y-6 mt-8"
    >
      <div className="w-full flex flex-col gap-y-2">
        <label className="text-sm font-semibold text-stone-500">Email Address</label>
        <div className="relative">
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your account email.."
            className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
          />
          <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500">
            <AtSign size={16} />
          </span>
        </div>
        {errors.email?.message && (
          <p className="text-xs font-semibold text-red-500">
            {errors.email?.message}
          </p>
        )}
      </div>
      <Button className="w-full h-[3.5rem] mt-4 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0">
        <Button.Border1 className="border-accentColor2/30 z-[1]" />
        <Button.Border2 className="border-accentColor2/30 z-[2]" />
        <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">
          {forgetMutation.isPending ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <span>Send reset link</span>
          )}
        </Button.Title>
      </Button>
    </form>
  );
};

export default ForgetPasswordForm;
