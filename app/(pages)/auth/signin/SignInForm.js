"use client"
import Button from "@/Components/Button";
import { signinSchema } from "@/libs/zod_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";
import { setAccessToken, useAuthStore } from "@/libs/zustand/authStore";
import { useState } from "react";

const SignInForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
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
      console.log("signin data",data);
      setAccessToken(data.data.accessToken);
      toast.success(data.data.message || "Signed in successfully!");
      queryClient.invalidateQueries(["auth", "check"]);
      router.push(next || "/");
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Sign in failed");
    },
  });

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
        <label className="text-sm font-semibold text-stone-500">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password.."
            className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500 hover:text-accentColor transition-colors"
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
    </form>
  );
};

export default SignInForm;
