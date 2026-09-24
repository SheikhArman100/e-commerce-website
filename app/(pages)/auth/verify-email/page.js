"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";

/**
 * Consumes the emailed link GET /auth/verify-email?token=… (exact backend
 * casing) which flips isVerified=true, then routes to sign in. A missing
 * token or an expired/invalid one lands on the resend page instead.
 */
const VerifyEmailInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPublic.put(
        `/auth/verify-email?token=${encodeURIComponent(token || "")}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Email Verification Successful");
      router.replace("/auth/signin");
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error.response?.data?.message ||
          "Email verification failed"
      );
      router.replace("/auth/resend-verification");
    },
  });

  useEffect(() => {
    if (!token) {
      router.replace("/auth/resend-verification");
      return;
    }
    verifyMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center justify-center px-8">
      <span className="loading loading-dots loading-lg text-accentColor"></span>
      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-stone-500">
        Verifying your email…
      </p>
    </article>
  );
};

const VerifyEmail = () => (
  <Suspense>
    <VerifyEmailInner />
  </Suspense>
);

export default VerifyEmail;
