"use client";
import Button from "@/Components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { axiosPublic } from "@/libs/axios/config";

const resendSchema = z.object({
  email: z.string().nonempty("Email is required").email({
    message: "Not a valid email",
  }),
});

/**
 * Re-issues the verification mail — POST /auth/resend-verification. Backend
 * 400s when the address is already verified, 404s for unknown emails.
 */
const ResendVerificationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resendSchema) });

  const resendMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPublic.post("/auth/resend-verification", {
        email: data.email,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification email sent successfully");
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

  return (
    <form
      onSubmit={handleSubmit((data) => resendMutation.mutate(data))}
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
          {resendMutation.isPending ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <span>Resend email</span>
          )}
        </Button.Title>
      </Button>
    </form>
  );
};

export default ResendVerificationForm;
