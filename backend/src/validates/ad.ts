import Joi from "joi";
import { CITIES, PROPERTY_TYPES, CITIES_WITH_AREAS } from "../db/data.js";

export interface getAds {
  city?: string;
  area?: string;
  rooms?: number;
  space?: number;
  propertyType?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  search?: string;
  order?: string;
}

interface createAd {
  title: string;
  city: string;
  area: string;
  rooms?: number;
  space: number;
  price: number;
  propertyType: string;
  address: string;
  type: string;
  description: string;
  whatsappNumber: string;
  images: Array<{ url: string; key: string }>;
}

interface updateAd {
  title?: string;
  city?: string;
  area?: string;
  rooms?: number;
  space?: number;
  price?: number;
  propertyType?: string;
  address?: string;
  type?: string;
  description?: string;
  whatsappNumber?: string;
  deletedImages?: string[];
}

export const getAdsSchema = Joi.object<getAds>({
  city: Joi.string()
    .trim()
    .valid(...CITIES)
    .messages({
      "string.base": "المدينة يجب أن تكون نصًا",
      "any.only": "المدينة غير صحيحة",
    })
    .optional(),
  area: Joi.string()
    .trim()
    .custom((value, helper) => {
      const { city } = helper.state.ancestors[0] as {
        city: keyof typeof CITIES_WITH_AREAS;
      };

      if (!CITIES_WITH_AREAS[city]?.includes(value)) {
        return helper.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.base": "المنطقة يجب أن تكون نصًا",
      "any.invalid": "المنطقة غير صحيحة بالنسبة للمدينة المحددة",
      "any.only": "المنطقة غير صحيحة",
    })
    .optional(),
  rooms: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .optional()
    .messages({
      "number.base": "عدد الغرف يجب أن يكون رقمًا",
      "number.min": "عدد الغرف يجب أن يكون على الأقل 1",
      "number.max": "عدد الغرف يجب أن لا يتجاوز 20",
    })
    .optional(),
  space: Joi.number()
    .integer()
    .min(10)
    .max(1000)
    .messages({
      "number.base": "مساحة العقار يجب أن تكون رقمًا",
      "number.min": "مساحة العقار يجب أن تكون على الأقل 10",
      "number.max": "مساحة العقار يجب أن لا تتجاوز 1000",
    })
    .optional(),
  propertyType: Joi.string()
    .trim()
    .valid(...PROPERTY_TYPES)
    .required()
    .messages({
      "string.base": "نوع العقار يجب أن يكون نصًا",
      "any.only": "نوع العقار غير صحيح",
    })
    .optional(),
  type: Joi.string()
    .trim()
    .valid("تمليك", "إيجار")
    .messages({
      "string.base": "نوع الإعلان يجب أن يكون نصًا",
      "any.only": "نوع الإعلان يجب أن يكون إما 'تمليك' أو 'إيجار'",
    })
    .optional(),
  minPrice: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "السعر يجب أن يكون رقمًا",
      "number.min": "السعر يجب أن لا يكون سالبًا",
    })
    .optional(),
  maxPrice: Joi.number()
    .integer()
    .min(0)
    .custom((value, helper) => {
      const { minPrice } = helper.state.ancestors[0];
      if (minPrice >= value) {
        return helper.error("any.invalid");
      }
      return value;
    })
    .messages({
      "number.base": "السعر يجب أن يكون رقمًا",
      "number.min": "السعر يجب أن لا يكون سالبًا",
      "any.invalid": "السعر الأقصى يجب أن يكون أكبر من السعر الأدنى",
    })
    .optional(),
  page: Joi.number()
    .min(1)
    .messages({
      "number.base": "السعر يجب أن يكون رقمًا",
      "number.min": "السعر يجب أن لا يكون سالبًا",
    })
    .optional(),
  limit: Joi.number()
    .min(1)
    .messages({
      "number.base": "السعر يجب أن يكون رقمًا",
      "number.min": "السعر يجب أن لا يكون سالبًا",
    })
    .optional(),
  search: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .messages({
      "string.base": "عنوان الإعلان يجب أن يكون نصًا",
      "string.empty": "عنوان الإعلان لا يمكن أن يكون فارغًا",
      "string.min": "عنوان الإعلان يجب أن يكون على الأقل 10 حروف",
      "string.max": "عنوان الإعلان يجب أن لا يتجاوز 500 حرف",
      "any.required": "عنوان الإعلان مطلوب",
    })
    .optional(),
  order: Joi.string()
    .trim()
    .valid("ASC", "DESC", "lowPrice", "highPrice")
    .messages({
      "string.base": "طريقة الفرز يجب أن تكون نصًا",
      "any.only": "طريقة الفرز غير صحيحة",
    })
    .optional(),
});

export const createAdSchema = Joi.object<createAd>({
  title: Joi.string().trim().min(5).max(50).required().messages({
    "string.base": "عنوان الإعلان يجب أن يكون نصًا",
    "string.empty": "عنوان الإعلان لا يمكن أن يكون فارغًا",
    "string.min": "عنوان الإعلان يجب أن يكون على الأقل 5 حروف",
    "string.max": "عنوان الإعلان يجب أن لا يتجاوز 50 حرف",
    "any.required": "عنوان الإعلان مطلوب",
  }),
  city: Joi.string()
    .trim()
    .valid(...CITIES)
    .required()
    .messages({
      "string.base": "المدينة يجب أن تكون نصًا",
      "any.only": "المدينة غير صحيحة",
      "any.required": "المدينة مطلوبة",
    }),
  area: Joi.string()
    .trim()
    .required()
    .custom((value, helper) => {
      const { city } = helper.state.ancestors[0] as {
        city: keyof typeof CITIES_WITH_AREAS;
      };

      if (!CITIES_WITH_AREAS[city]?.includes(value)) {
        return helper.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.base": "المنطقة يجب أن تكون نصًا",
      "any.invalid": "المنطقة غير صحيحة بالنسبة للمدينة المحددة",
      "any.only": "المنطقة غير صحيحة",
      "any.required": "المنطقة مطلوبة",
    }),
  rooms: Joi.number().integer().min(1).max(20).optional().messages({
    "number.base": "عدد الغرف يجب أن يكون رقمًا",
    "number.min": "عدد الغرف يجب أن يكون على الأقل 1",
    "number.max": "عدد الغرف يجب أن لا يتجاوز 20",
  }),
  space: Joi.number().integer().min(10).max(1000).required().messages({
    "number.base": "مساحة العقار يجب أن تكون رقمًا",
    "number.min": "مساحة العقار يجب أن تكون على الأقل 10",
    "number.max": "مساحة العقار يجب أن لا تتجاوز 1000",
    "any.required": "مساحة العقار مطلوبة",
  }),
  propertyType: Joi.string()
    .trim()
    .valid(...PROPERTY_TYPES)
    .required()
    .messages({
      "string.base": "نوع العقار يجب أن يكون نصًا",
      "any.only": "نوع العقار غير صحيح",
      "any.required": "نوع العقار مطلوب",
    }),
  address: Joi.string().trim().min(10).max(200).required().messages({
    "string.base": "العنوان يجب أن يكون نصًا",
    "string.empty": "العنوان لا يمكن أن يكون فارغًا",
    "string.min": "العنوان يجب أن يكون على الأقل 10 حروف",
    "string.max": "العنوان يجب أن لا يتجاوز 200 حرف",
    "any.required": "العنوان مطلوب",
  }),
  type: Joi.string().trim().valid("تمليك", "إيجار").required().messages({
    "string.base": "نوع الإعلان يجب أن يكون نصًا",
    "any.only": "نوع الإعلان يجب أن يكون إما 'تمليك' أو 'إيجار'",
    "any.required": "نوع الإعلان مطلوب",
  }),
  description: Joi.string().trim().min(10).max(500).required().messages({
    "string.base": "وصف العقار يجب أن يكون نصًا",
    "string.empty": "وصف العقار لا يمكن أن يكون فارغًا",
    "string.min": "وصف العقار يجب أن يكون على الأقل 10 حروف",
    "string.max": "وصف العقار يجب أن لا يتجاوز 500 حروف",
    "any.required": "وصف العقار مطلوب",
  }),
  price: Joi.number().integer().min(0).required().messages({
    "number.base": "السعر يجب أن يكون رقمًا",
    "number.min": "السعر يجب أن لا يكون سالبًا",
    "any.required": "السعر مطلوب",
  }),
  whatsappNumber: Joi.string()
    .trim()
    .pattern(/^\+\d{8,15}$/)
    .required()
    .messages({
      "string.base": "رقم الواتساب يجب أن يكون نصًا",
      "string.empty": "رقم الواتساب لا يمكن أن يكون فارغًا",
      "string.pattern.base":
        "رقم الواتساب غير صحيح، استخدم الرقم الدولي مع كود الدولة (+2010xxxxxxx)",
      "any.required": "رقم الواتساب مطلوب",
    }),
});

export const updateAdSchema = Joi.object<updateAd>({
  title: Joi.string().trim().min(10).max(100).messages({
    "string.base": "عنوان الإعلان يجب أن يكون نصًا",
    "string.empty": "عنوان الإعلان لا يمكن أن يكون فارغًا",
    "string.min": "عنوان الإعلان يجب أن يكون على الأقل 10 حروف",
    "string.max": "عنوان الإعلان يجب أن لا يتجاوز 100 حرف",
  }),
  city: Joi.string()
    .trim()
    .valid(...CITIES)

    .messages({
      "string.base": "المدينة يجب أن تكون نصًا",
      "any.only": "المدينة غير صحيحة",
    }),
  area: Joi.string()
    .trim()

    .custom((value, helper) => {
      const { city } = helper.state.ancestors[0] as {
        city: keyof typeof CITIES_WITH_AREAS;
      };

      if (!CITIES_WITH_AREAS[city]?.includes(value)) {
        return helper.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.base": "المنطقة يجب أن تكون نصًا",
      "any.invalid": "المنطقة غير صحيحة بالنسبة للمدينة المحددة",
      "any.only": "المنطقة غير صحيحة",
    }),
  rooms: Joi.number().integer().min(1).max(20).messages({
    "number.base": "عدد الغرف يجب أن يكون رقمًا",
    "number.min": "عدد الغرف يجب أن يكون على الأقل 1",
    "number.max": "عدد الغرف يجب أن لا يتجاوز 20",
  }),
  space: Joi.number().integer().min(10).max(1000).messages({
    "number.base": "مساحة العقار يجب أن تكون رقمًا",
    "number.min": "مساحة العقار يجب أن تكون على الأقل 10",
    "number.max": "مساحة العقار يجب أن لا تتجاوز 1000",
  }),
  propertyType: Joi.string()
    .trim()
    .valid(...PROPERTY_TYPES)

    .messages({
      "string.base": "نوع العقار يجب أن يكون نصًا",
      "any.only": "نوع العقار غير صحيح",
    }),
  address: Joi.string().trim().min(10).max(200).messages({
    "string.base": "العنوان يجب أن يكون نصًا",
    "string.empty": "العنوان لا يمكن أن يكون فارغًا",
    "string.min": "العنوان يجب أن يكون على الأقل 10 حروف",
    "string.max": "العنوان يجب أن لا يتجاوز 200 حرف",
  }),
  type: Joi.string().trim().valid("تمليك", "إيجار").messages({
    "string.base": "نوع الإعلان يجب أن يكون نصًا",
    "any.only": "نوع الإعلان يجب أن يكون إما 'تمليك' أو 'إيجار'",
  }),
  description: Joi.string().trim().min(20).max(2000).messages({
    "string.base": "وصف العقار يجب أن يكون نصًا",
    "string.empty": "وصف العقار لا يمكن أن يكون فارغًا",
    "string.min": "وصف العقار يجب أن يكون على الأقل 20 حروف",
    "string.max": "وصف العقار يجب أن لا يتجاوز 2000 حروف",
  }),
  price: Joi.number().integer().min(0).messages({
    "number.base": "السعر يجب أن يكون رقمًا",
    "number.min": "السعر يجب أن لا يكون سالبًا",
  }),
  whatsappNumber: Joi.string()
    .trim()
    .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
    .messages({
      "string.base": "رقم الواتساب يجب أن يكون نصًا",
      "string.empty": "رقم الواتساب لا يمكن أن يكون فارغًا",
      "string.pattern.base": "رقم الواتساب غير صحيح",
    }),
  deletedImages: Joi.array()
    .items(
      Joi.object().keys({
        url: Joi.string().required(),
        key: Joi.string().required(),
      })
    )
    .messages({
      "array.base": "الصور المحذوفة يجب أن تكون مصفوفة",
      "object.base": "كل صورة محذوفة يجب أن تكون كائنًا يحتوي على url و key",
    }),
});
