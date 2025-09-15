import { z } from "zod";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "./data";

export const createAdSchema = z
  .object({
    title: z
      .string()
      .min(10, "عنوان الإعلان يجب أن يكون على الأقل 10 حروف")
      .max(100, "عنوان الإعلان يجب أن لا يتجاوز 100 حرف"),

    city: z.enum(CITIES, { error: "المدينة غير صحيحة" }),

    area: z.string({ error: "المنطقة غير صحيحة" }),

    rooms: z
      .number({ error: "عدد الغرف يجب أن يكون رقمًا" })
      .int({ message: "عدد الغرف يجب أن يكون رقمًا صحيحًا" })
      .min(1, "عدد الغرف يجب أن يكون على الأقل 1")
      .max(20, "عدد الغرف يجب أن لا يتجاوز 20"),

    space: z
      .number({ error: "مساحة العقار يجب أن تكون رقمًا" })
      .int({ message: "مساحة العقار يجب أن تكون رقمًا صحيحًا" })
      .min(50, "مساحة العقار يجب أن تكون على الأقل 50")
      .max(1000, "مساحة العقار يجب أن لا تتجاوز 1000"),

    propertyType: z.enum(PROPERTY_TYPES, { error: "نوع العقار غير صحيح" }),

    type: z.enum(["تمليك", "ايجار"], {
      error: "نوع الإعلان يجب أن يكون إما 'تمليك' أو 'إيجار'",
    }),

    address: z
      .string()
      .min(10, "العنوان يجب أن يكون على الأقل 10 حروف")
      .max(200, "العنوان يجب أن لا يتجاوز 200 حرف"),

    description: z
      .string()
      .min(20, "وصف العقار يجب أن يكون على الأقل 20 حروف")
      .max(500, "وصف العقار يجب أن لا يتجاوز 500 حروف"),

    price: z
      .number({ error: "السعر يجب أن يكون رقمًا" })
      .int({ message: "السعر يجب أن يكون رقمًا صحيحًا" })
      .min(0, "السعر يجب أن لا يكون سالبًا"),

    whatsappNumber: z
      .string()
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم الواتساب غير صحيح"),
  })
  .superRefine((data, ctx) => {
    const areas = CITIES_WITH_AREAS[data.city];
    if (!areas || !areas.includes(data.area)) {
      ctx.addIssue({
        path: ["area"],
        code: "custom",
        message: "المنطقة غير صحيحة بالنسبة للمدينة المحددة",
      });
    }
  });
