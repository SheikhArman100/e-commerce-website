"use client"
import Button from "@/Components/Button";
import { signinSchema } from "@/libs/zod_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";
import { useAuthStore } from "@/libs/zustand/authStore";

const SignInForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });

  const signinMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPublic.post("/auth/signin", {
        email: data.email,
        password: data.password,
      }, {
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Backend wraps the payload as { success, message, data: { accessToken, role } }
      setAccessToken(data.data?.accessToken ?? null);
      toast.success(data.message || "Signed in successfully!");
      queryClient.invalidateQueries({ queryKey: ["auth", "check"], refetchType: "all" });
      // A guest's cached ["user"] entry is a 401 ERROR, not data. Without this
      // the header would keep rendering the signed-out UI until the 30s
      // refetchOnMount/staleTime window elapsed, and usePendingReviews (which
      // only enables once user data exists) would never turn on.
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(next || "/");
      reset();
    },
    onError: (error) => {
      // Backend error shape: { message, errorMessages: [{ message }] }
      const serverErrors = error.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error.response?.data?.message ||
          "Sign in failed"
      );
    },
  });

  const handleGoogleSignIn = () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    window.location.href = `${base}/auth/google`;
  };

  const handleSignin = (formData) => {
    signinMutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSignin)}
      className="w-full  flex flex-col items-center gap-y-6 mt-8"
    >
      {/* Email Field */}
      <div className="w-full flex flex-col gap-y-2">
        <label className="text-sm font-semibold text-stone-500">Email Address</label>
        <div className="relative">
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email.."
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

      {/* Password Field */}
      <div className="w-full flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-stone-500">Password</label>
          <Link
            href="/auth/forget-password"
            className="text-xs font-semibold text-accentColor hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password.."
            className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
          />
          {/* <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-stone-500">
            <Lock size={16} />
          </span> */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500 hover:text-accentColor transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password?.message && (
          <p className="text-xs font-semibold text-red-500">
            {errors.password?.message}
          </p>
        )}
      </div>

      <Button className="w-full h-[3.5rem] mt-4 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0">
        <Button.Border1 className="border-accentColor2/30 z-[1]" />
        <Button.Border2 className="border-accentColor2/30 z-[2]" />
        <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">
          {signinMutation.isPending ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <span>Sign in</span>
          )}
        </Button.Title>
      </Button>

      <div className="flex w-full items-center gap-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
        <span className="h-px flex-1 bg-textColor/10" />
        or
        <span className="h-px flex-1 bg-textColor/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex h-[3.5rem] w-full items-center justify-center gap-3 rounded-sm border border-textColor/15 bg-white/60 text-sm font-bold uppercase tracking-widest text-textColor shadow-sm transition-all hover:border-accentColor/40 hover:text-accentColor"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  );
};

export default SignInForm;
