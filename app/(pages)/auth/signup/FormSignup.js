"use client";
import Button from "@/Components/Button";
import { signupSchema } from "@/libs/zod_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/libs/axios/config";
import { setAccessToken } from "@/libs/zustand/authStore";
import { useState } from "react";
import { Eye, EyeOff, User, Phone, AtSign } from "lucide-react";

const FormSignup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPublic.post("auth/signup", data, {
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      toast.success(data.message || "Account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["auth", "check"], refetchType: "all" });
      router.push("/");
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Sign up failed");
    },
  });

  const handleSignup = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <form
      autoComplete="off"
      className="w-full mt-8 flex flex-col items-center gap-y-6"
      onSubmit={handleSubmit(handleSignup)}
    >
      <div className="w-full grid grid-cols-1 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-semibold text-stone-500">Full Name</label>
          <div className="relative">
            <input
              type="text"
              {...register("name")}
              placeholder="Gourmet Baker"
              className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
            />
            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500">
              <User size={16} />
            </span>
          </div>
          {errors.name?.message && (
            <p className="text-xs font-semibold text-red-500">
              {errors.name?.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-semibold text-stone-500">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              placeholder="01*** ******"
              {...register("phoneNumber")}
              className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
            />
            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500">
              <Phone size={16} />
            </span>
          </div>
          {errors.phoneNumber?.message && (
            <p className="text-xs font-semibold text-red-500">
              {errors.phoneNumber?.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-semibold text-stone-500">Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="chef@bakingtales.com"
              {...register("email")}
              className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
            />
            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500">
              <AtSign size={16} />
            </span>
          </div>
          {errors.email?.message && (
            <p className="text-xs font-semibold text-red-500">
              {errors.email?.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-semibold text-stone-500">Create Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500 hover:text-accentColor"
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
      </div>

      <Button className="w-full h-[3.5rem] mt-4 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0">
        <Button.Border1 className="border-accentColor2/30 z-[1]" />
        <Button.Border2 className="border-accentColor2/30 z-[2]" />
        <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">
          {signupMutation.isPending ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <span>Sign up</span>
          )}
        </Button.Title>
      </Button>
    </form>
  );
};

export default FormSignup;
