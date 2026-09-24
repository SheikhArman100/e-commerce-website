import { z } from "zod";

//signin schema
export const signinSchema = z.object({
  email: z.string().nonempty("Email is required").email({
    message: "Not a valid email",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//signup schema
// Bangladeshi mobile: 11 digits, starts with 013-019 (e.g. 01XXXXXXXXX)
const phoneRegex = new RegExp(/^01[3-9]\d{8}$/);
export const signupSchema = z.object({
  name: z.string().nonempty("name is required"),
  phoneNumber: z
    .string()
    .nonempty("Phone Number is required")
    .trim()
    .regex(phoneRegex, {
      message: "Must be a valid Bangladeshi number (e.g. 01XXXXXXXXX)",
    }),
  email: z.string().nonempty("Email is required").email({
    message: "not a valid mail",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const otpSchema = z.object({
  otp1: z.string().nonempty("can not ne empty"),
  otp2: z.string().nonempty("can not ne empty"),
  otp3: z.string().nonempty("can not ne empty"),
  otp4: z.string().nonempty("can not ne empty"),
  otp5: z.string().nonempty("can not ne empty"),
  otp6: z.string().nonempty("can not ne empty"),
});

//create FormNewProduct
export const createProductSchema = z.object({
  title: z.string().nonempty("Add a title"),
  description: z.string().nonempty("Add a description"),
  category: z.string().nonempty("Select a category"),
  flavors: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one flavor",
  }),
  price: z.coerce.number().refine((val) => !isNaN(val) && val > 0, {
    message: "Price must be a valid integer and greater than 0",
  }),
  sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one size",
  }),
  images: z.array(z.string()).refine((value) => value.length === 5, {
    message: "You have to add total 5 images",
  }),
});

//cart item form
export const cartSchema = z.object({
  flavorId: z.string({
    required_error: "Add a flavor",
  }),
  sizeId: z.string().optional().nullable(),
  quantity: z.coerce.number().refine((val) => !isNaN(val) && val > 0 && val < 11, {
    message: "You can buy between 1 and 10 items",
  }),
});

//change password (authenticated) — mirrors backend changePasswordSchema
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty("Old password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

//forget password — mirrors backend forgetPasswordSchema
export const forgetPasswordSchema = z.object({
  email: z.string().nonempty("Email is required").email({
    message: "Not a valid email",
  }),
});

//reset password — mirrors backend resetPasswordSchema (token travels in query)
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
//update profile (authenticated) — mirrors backend updateProfileSchema
// (all fields optional server-side; empty inputs are omitted from the PATCH
// so backend min-length rules never see an empty string)
const bdPhoneLoose = /^(?:\+?88)?01[3-9]\d{8}$/;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || bdPhoneLoose.test(val), {
      message:
        "Please enter a valid Bangladeshi phone number (e.g., 017******** or +88017********)",
    }),
  address: z
    .string()
    .trim()
    .max(200, "Address must not exceed 200 characters")
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Address must be at least 5 characters",
    }),
  city: z
    .string()
    .trim()
    .max(50, "City must not exceed 50 characters")
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "City must be at least 2 characters",
    }),
  road: z
    .string()
    .trim()
    .max(100, "Road must not exceed 100 characters")
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Road must be at least 2 characters",
    }),
});

//checkout form
export const checkoutSchema = z.object({
  fullName: z.string({
    required_error: "Name is required",
  }),
  email: z
    .string().nonempty("Email is required")
    .email({
      message: "Not a valid email",
    }),
  phoneNumber: z
    .string().nonempty("Phone number is required")
    .trim()
    .regex(phoneRegex, {
      message: "Must be a valid Bangladeshi number (e.g. 01XXXXXXXXX)",
    }),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  road: z.string().nonempty("Road details is required"),
});
