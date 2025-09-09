import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "يرجى إدخال بريد إلكتروني صحيح" })
    .nonempty("الايميل مطلوب"),

  password: z
    .string()
    .min(6, { message: "كلمة السر يجب أن تكون على الأقل 6 أحرف" })
    .refine((val) => /[a-z]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على حرف صغير واحد على الأقل",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على حرف كبير واحد على الأقل",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على رقم واحد على الأقل",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على رمز خاص واحد على الأقل",
    }),
});

const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/; //name contain only arabic and english letters
export const signupSchema = z.object({
  name: z
    .string()
    .min(6, "الاسم يجب أن يكون 6 أحرف على الأقل")
    .max(50, "الاسم طويل جدًا")
    .regex(nameRegex, "الاسم يجب أن يحتوي على أحرف فقط"),
  email: z
    .email({ message: "يرجى إدخال بريد إلكتروني صحيح" })
    .nonempty("الايميل مطلوب"),
  password: z
    .string()
    .min(6, { message: "كلمة السر يجب أن تكون على الأقل 6 أحرف" })
    .refine((val) => /[a-z]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على حرف صغير واحد على الأقل",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على حرف كبير واحد على الأقل",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على رقم واحد على الأقل",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على رمز خاص واحد على الأقل",
    }),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "كلمة السر يجب أن تكون على الأقل 6 أحرف" })
    .refine((val) => /[a-z]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على حرف صغير واحد على الأقل",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على حرف كبير واحد على الأقل",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على رقم واحد على الأقل",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "يجب أن تحتوي كلمة السر على رمز خاص واحد على الأقل",
    }),
  resetPasswordToken: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .min(6, "الاسم يجب أن يكون 6 أحرف على الأقل")
      .max(50, "الاسم طويل جدًا")
      .regex(nameRegex, "الاسم يجب أن يحتوي على أحرف فقط")
      .optional()
  ),
  role: z.enum(["user", "landlord"]).optional(),
  password: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .min(6, "كلمة السر يجب أن تكون على الأقل 6 أحرف")
      .refine(
        (v) => /[a-z]/.test(v),
        "يجب أن تحتوي كلمة السر على حرف صغير واحد على الأقل"
      )
      .refine(
        (v) => /[A-Z]/.test(v),
        "يجب أن تحتوي كلمة السر على حرف كبير واحد على الأقل"
      )
      .refine(
        (v) => /[0-9]/.test(v),
        "يجب أن تحتوي كلمة السر على رقم واحد على الأقل"
      )
      .refine(
        (v) => /[^A-Za-z0-9]/.test(v),
        "يجب أن تحتوي كلمة السر على رمز خاص واحد على الأقل"
      )
      .optional()
  ),
  newPassword: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .min(6, "كلمة السر يجب أن تكون على الأقل 6 أحرف")
      .refine(
        (v) => /[a-z]/.test(v),
        "يجب أن تحتوي كلمة السر على حرف صغير واحد على الأقل"
      )
      .refine(
        (v) => /[A-Z]/.test(v),
        "يجب أن تحتوي كلمة السر على حرف كبير واحد على الأقل"
      )
      .refine(
        (v) => /[0-9]/.test(v),
        "يجب أن تحتوي كلمة السر على رقم واحد على الأقل"
      )
      .refine(
        (v) => /[^A-Za-z0-9]/.test(v),
        "يجب أن تحتوي كلمة السر على رمز خاص واحد على الأقل"
      )
      .optional()
  ),
});
