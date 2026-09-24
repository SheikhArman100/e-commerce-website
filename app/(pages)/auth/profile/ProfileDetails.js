"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BadgeCheck, Cake, CalendarDays, Camera, Mail, MapPin, Pencil } from "lucide-react";

import { Phone, ShieldCheck, User, X } from "lucide-react";
import { updateProfileSchema } from "@/libs/zod_schema";
import useAxiosPrivate from "@/hooks/useAxiosPrivate.js";
import useUserProfile from "@/hooks/useUserProfile.js";
import Button from "@/Components/Button";

const inputClass =
  "w-full rounded-md border border-textColor/10 px-4 py-3 shadow-sm text-sm bg-white/50 focus:border-accentColor focus:outline-0 transition-all text-textColor";

const readOnlyInputClass =
  "w-full rounded-md border border-textColor/10 px-4 py-3 text-sm bg-stone-100 text-stone-400 cursor-not-allowed";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const InfoRow = ({ icon: Icon, label, value, fallback = "Not set" }) => (
  <div className="flex items-center gap-x-3 rounded-md border border-textColor/10 bg-white/50 px-4 py-3">
    <Icon className="h-4 w-4 shrink-0 text-accentColor" />
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-widest text-stone-400">
        {label}
      </p>
      <p className="text-sm text-textColor truncate">{value || fallback}</p>
    </div>
  </div>
);
const Field = ({ label, name, register, error, ...rest }) => (
  <div className="w-full flex flex-col gap-y-2">
    <label className="text-sm font-semibold text-stone-500">{label}</label>
    <input {...register(name)} {...rest} className={inputClass} />
    {error?.message && (
      <p className="text-xs font-semibold text-red-500">{error.message}</p>
    )}
  </div>
);

/**
 * Signed-in profile — GET /user/profile (view) + PATCH /user/profile (edit).
 * Page wraps it in <StatusChecker> so guests bounce to /auth/signin first.
 * Backend: multipart via FileUploadHelper.uploadSingle('user') → photo field
 * is `file`; text fields go through transformFormData, empty strings are
 * omitted so backend min-length rules never see them.
 */
const ProfileDetails = () => {
  const { data: profile, isPending, isError } = useUserProfile();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(updateProfileSchema) });

  // Seed the form once the profile loads (and on cancel).
  useEffect(() => {
    if (profile) {
      reset({
        name: profile?.name ?? "",
        phoneNumber: profile?.phoneNumber ?? "",
        address: profile?.detail?.address ?? "",
        city: profile?.detail?.city ?? "",
        road: profile?.detail?.road ?? "",
      });
    }
  }, [profile, reset]);

  // Revoke object URLs on unmount / replace.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const updateMutation = useMutation({
    mutationFn: async ({ values, file, original }) => {
      const form = new FormData();
      // Only send fields the user actually changed — never re-send
      // untouched values (photo-only edits ship just `file`).
      // transformFormData throws on an empty body, so a photo-only edit
      // still works because `file` is present in the multipart payload.
      const keys = ["name", "phoneNumber", "address", "city", "road"];
      for (const key of keys) {
        const raw = values[key];
        const v = typeof raw === "string" ? raw.trim() : raw;
        const was = (original?.[key] ?? "").trim?.() ?? original?.[key] ?? "";
        const now = v ?? "";
        if (now === "" || now === was) continue;
        form.append(key, now);
      }
      if (file) form.append("file", file);
      // axiosPrivate defaults to `Content-Type: application/json`, which
      // strips the multipart boundary and makes multer drop `req.file`.
      // Delete it here so the browser sets `multipart/form-data; boundary=…`
      // itself — the only correct content-type for FormData.
      const res = await axiosPrivate.patch("/user/profile", form, {
        transformRequest: [
          (data, headers) => {
            headers?.delete?.("Content-Type");
            return data;
          },
        ],
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setEditing(false);
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return null;
      });
      toast.success(data?.message || "Profile updated successfully.");
    },
    onError: (error) => {
      const serverErrors = error?.response?.data?.errorMessages;
      toast.error(
        serverErrors?.[0]?.message ||
          error?.response?.data?.message ||
          "Profile update failed"
      );
    },
  });

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const onCancel = () => {
    setEditing(false);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    reset({
      name: profile?.name ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
      address: profile?.detail?.address ?? "",
      city: profile?.detail?.city ?? "",
      road: profile?.detail?.road ?? "",
    });
  };

  const onSubmit = (values) => {
    const file = fileInputRef.current?.files?.[0] || null;
    // Snapshot of what the form was seeded with — diffed so untouched
    // fields are never re-sent (photo-only edits ship just `file`).
    const original = {
      name: profile?.name ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
      address: profile?.detail?.address ?? "",
      city: profile?.detail?.city ?? "",
      road: profile?.detail?.road ?? "",
    };
    updateMutation.mutate({ values, file, original });
  };
  if (isPending) {
    return (
      <div
        role="status"
        className="w-full flex flex-col items-center gap-y-4 mt-8"
      >
        <span className="sr-only">Loading your profile…</span>
        <div className="h-24 w-24 rounded-full bg-textColor/10 animate-pulse" />
        <div className="h-5 w-48 rounded-md bg-textColor/10 animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-textColor/10 animate-pulse" />
        <div className="w-full mt-4 flex flex-col gap-y-3">
          <div className="h-12 w-full rounded-md bg-textColor/10 animate-pulse" />
          <div className="h-12 w-full rounded-md bg-textColor/10 animate-pulse" />
          <div className="h-12 w-full rounded-md bg-textColor/10 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <p className="mt-8 text-sm text-stone-500">
        We could not load your profile right now. Please try again.
      </p>
    );
  }

  const storedSrc = profile?.detail?.image?.path
    ? `${fileBase}/${profile.detail.image.path}`
    : profile?.detail?.profileImage || null;
  const avatarSrc = preview || storedSrc;
  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="relative h-24 w-24 rounded-full overflow-hidden border border-accentColor/30 bg-accentColor/5 flex items-center justify-center">
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={profile?.name || "Profile photo"}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <User className="h-10 w-10 text-accentColor" />
        )}
        {editing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Change photo"
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition-opacity"
          >
            <Camera className="h-6 w-6" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickPhoto}
      />

      {!editing ? (
        <>
          <h3 className="mt-4 text-xl font-semibold text-textColor">
            {profile?.name}
          </h3>
          <div className="mt-1 flex items-center gap-x-1.5 text-xs text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-accentColor" />
            {profile?.role === "admin" ? "Administrator" : "Verified member"}
            {profile?.isVerified ? "" : " (unverified)"}
          </div>

          <div className="w-full mt-8 flex flex-col gap-y-3">
            <InfoRow icon={Mail} label="Email" value={profile?.email} fallback="-" />
            <InfoRow icon={Phone} label="Phone Number" value={profile?.phoneNumber} />
            <InfoRow icon={MapPin} label="Address" value={profile?.detail?.address} />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={MapPin} label="City" value={profile?.detail?.city} />
              <InfoRow icon={MapPin} label="Road" value={profile?.detail?.road} />
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={BadgeCheck} label="Account Status" value={profile?.isActive === false ? "Deactivated" : profile?.isVerified ? "Active & verified" : "Active (unverified)"} fallback="-" />
              <InfoRow icon={Cake} label="Member Since" value={formatDate(profile?.createdAt)} fallback="-" />
            </div>
            {/* <InfoRow icon={CalendarDays} label="Last Updated" value={formatDate(profile?.updatedAt)} fallback="-" /> */}
          </div>

          <Button
            onClick={() => setEditing(true)}
            className="w-full h-[3.5rem] mt-8 bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0"
          >
            <Button.Border1 className="border-accentColor2/30 z-[1]" />
            <Button.Border2 className="border-accentColor2/30 z-[2]" />
            <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest flex items-center gap-x-2">
              <Pencil className="h-4 w-4" />
              <span>Edit profile</span>
            </Button.Title>
          </Button>
        </>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-y-5 mt-6"
        >
          <div className="w-full flex flex-col gap-y-1 rounded-md border border-textColor/10 bg-stone-100 px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-stone-400">Email (cannot be changed)</p>
            <p className="text-sm text-stone-400 truncate">{profile?.email}</p>
          </div>
          <Field label="Full Name" name="name" register={register} error={errors.name} placeholder="Your name" />
          <Field label="Phone Number" name="phoneNumber" register={register} error={errors.phoneNumber} placeholder="01XXXXXXXXX" inputMode="tel" maxLength={14} />
          <Field label="Address" name="address" register={register} error={errors.address} placeholder="House, street, area" />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="City" name="city" register={register} error={errors.city} placeholder="City" />
            <Field label="Road" name="road" register={register} error={errors.road} placeholder="Road / block" />
          </div>
          <p className="text-xs text-stone-400">
            Email cannot be changed. Tap the photo to replace it.
          </p>
          <div className="w-full flex gap-x-3 mt-2">
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 h-[3.5rem] bg-white rounded-sm border border-textColor/15 hover:border-accentColor transition-all duration-300 shadow-sm"
            >
              <Button.Title className="font-bold text-base text-stone-500 uppercase tracking-widest flex items-center justify-center gap-x-2">
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button.Title>
            </Button>
            <Button className="flex-1 h-[3.5rem] bg-accentColor rounded-sm hover:bg-accentColor/90 transition-all duration-300 shadow-md border-0">
              <Button.Border1 className="border-accentColor2/30 z-[1]" />
              <Button.Border2 className="border-accentColor2/30 z-[2]" />
              <Button.Title className="font-bold text-base text-bgColor uppercase tracking-widest">
                {updateMutation.isPending ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  <span>Save changes</span>
                )}
              </Button.Title>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileDetails;
