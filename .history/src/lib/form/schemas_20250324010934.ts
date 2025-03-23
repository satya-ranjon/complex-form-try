import { z } from "zod";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.date(),
  gender: z.enum(["male", "female", "other"]),
});

const contactInfoSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "Please enter a valid city"),
  country: z.string().min(1, "Please select a country"),
});

const accountInfoSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const multiStepSchema = z
  .object({
    ...personalInfoSchema.shape,
    ...contactInfoSchema.shape,
    ...z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase, and number"
        ),
      confirmPassword: z.string(),
    }).shape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type MultiStepFormData = z.infer<typeof multiStepSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type AccountInfoData = z.infer<typeof accountInfoSchema>;
