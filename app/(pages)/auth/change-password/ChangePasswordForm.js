"use client";
import Button from "@/Components/Button";
import { changePasswordSchema } from "@/libs/zod_schema";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const inputClass =
  "w-full rounded-md border border-textColor/10 px-4 shadow-sm text-sm bg-white/50 py-3 focus:border-accentColor focus:outline-0 transition-all text-textColor";

const PasswordField = ({ label, name, register, error, show, onToggle }) => (
  <div className="w-full flex flex-col gap-y-2">
    <label className="text-sm font-semibold text-stone-500">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        {...register(name)}
        placeholder="••••••••"
        className={inputClass}
      />
      {/* <span className="pointer-events-none absolute inset-y-0 start-0 grid w-10 place-content-center text-stone-500">
        <Lock size={16} />
      </span> */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 end-0 grid w-10 place-content-center text-stone-500 hover:text-accentColor transition-colors"
        aria-label={show ? `Hide ${label}` : `Show ${label}`}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {error?.message && (
      <p className="text-xs font-semibold text-red-500">{error.message}</p>
    )}
  </div>
);

/**
 * Authenticated password change — PUT /auth/change-password (Bearer token
 * via axiosPrivate). Backend revokes all refresh tokens on success, so the
 * session is refreshed from scratch and the user stays signed in.
 */
const ChangePasswordForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const [show, setShow] = useState({ old: false, next: false, confirm: false });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const changeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosPrivate.put("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully.");
      reset();
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error.response?.data?.message ||
          "Password change failed"
      );
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => changeMutation.mutate(data))}
      className="w-full flex flex-col items-center gap-y-6 mt-8"
    >
      <PasswordField
        label="Old Password"
        name="oldPassword"
        register={register}
        error={errors.oldPassword}
        show={show.old}
        onToggle={() => setShow((s) => ({ ...s, old: !s.old }))}
      />
      <PasswordField
        label="New Password"
        name="newPassword"
        register={register}
        error={errors.newPassword}
        show={show.next}
        onToggle={() => setShow((s) => ({ ...s, next: !s.next }))}
      />
      <PasswordField
        label="Confirm New Password"
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword}
        show={show.confirm}
        onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
      />
      <Button className="w-full h-[3.5rem] mt-4 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0">
        <Button.Border1 className="border-accentColor2/30 z-[1]" />
        <Button.Border2 className="border-accentColor2/30 z-[2]" />
        <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">
          {changeMutation.isPending ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <span>Change password</span>
          )}
        </Button.Title>
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
