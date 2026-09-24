"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";
import { useAuthStore } from "@/libs/zustand/authStore";

/**
 * Landing target for the backend's Google OAuth callback. The backend route
 * is GET /auth/google/callback (passport, session:false) which signs the
 * tokens into an httpOnly cookie + JSON body — but the BROWSER is sitting on
 * that backend URL, not the storefront. This page re-establishes the session
 * on the storefront origin (refresh cookie → access token in the store) and
 * then routes home (or ?next=…).
 */
const GoogleCallbackInner = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const callbackMutation = useMutation({
    mutationFn: async () => {
      // No token in the URL by design — the refresh cookie from the OAuth
      // callback is the credential; exchange it for an access token.
      const response = await axiosPublic.get("/auth/token", {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.data?.accessToken ?? null);
      toast.success("Signed in with Google!");
      queryClient.invalidateQueries({ queryKey: ["auth", "check"], refetchType: "all" });
      router.replace(next || "/");
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error.response?.data?.message ||
          "Google sign-in failed"
      );
      router.replace("/auth/signin");
    },
  });

  useEffect(() => {
    callbackMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="w-full bg-bgColor min-h-screen text-textColor flex flex-col items-center justify-center px-8">
      <span className="loading loading-dots loading-lg text-accentColor"></span>
      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-stone-500">
        Signing you in with Google…
      </p>
    </article>
  );
};

const GoogleCallback = () => (
  <Suspense>
    <GoogleCallbackInner />
  </Suspense>
);

export default GoogleCallback;
