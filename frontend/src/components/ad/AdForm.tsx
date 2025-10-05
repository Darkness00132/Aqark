"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createAdSchema } from "@/lib/adValidates";
import { PROPERTY_TYPES } from "@/lib/data";

import useCreateAd from "@/hooks/ad/useCreateAd";
import CitySelect from "@/components/ad/Select/CitySelect";
import AreaSelect from "@/components/ad/Select/AreaSelect";
import ImageUpload from "@/components/ad/ImagesUpload";
import adCostInCredits from "@/lib/adCostInCredits";

const ROOM_BASED_PROPERTIES = ["شقة", "فيلا", "منزل"];

export default function AdForm() {
  const [images, setImages] = useState<File[]>([]);
  type CreateAdSchema = typeof createAdSchema;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<CreateAdSchema>>({
    resolver: zodResolver(createAdSchema),
    defaultValues: { rooms: undefined },
  });

  const selectedCity = watch("city");
  const selectedPropertyType = watch("propertyType");
  const showRoomsInput = ROOM_BASED_PROPERTIES.includes(
    selectedPropertyType || ""
  );

  const selectedType = watch("type");
  const selectedPrice = watch("price");

  const creditsCost =
    selectedType && selectedPrice
      ? adCostInCredits({ type: selectedType, price: selectedPrice })
      : null;

  const { mutate, isPending } = useCreateAd();

  const onSubmit = (data: z.infer<CreateAdSchema>) => {
    mutate({ images, data });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            عنوان الإعلان
          </label>
          <input
            {...register("title")}
            type="text"
            placeholder="مثال: شقة للبيع في الزمالك"
            className="input input-bordered w-full rounded-xl"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Location */}
        <section>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">الموقع</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CitySelect control={control} error={errors.city?.message} />
            <AreaSelect
              control={control}
              selectedCity={selectedCity}
              error={errors.area?.message}
            />
          </div>
        </section>

        {/* Property Details */}
        <section>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            تفاصيل العقار
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نوع العقار
              </label>
              <select
                {...register("propertyType")}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="">اختر نوع العقار</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.propertyType && (
                <p className="text-red-500 text-sm">
                  {errors.propertyType.message}
                </p>
              )}
            </div>

            {/* Ad Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نوع الإعلان
              </label>
              <select
                {...register("type")}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="">اختر نوع الإعلان</option>
                <option value="تمليك">تمليك</option>
                <option value="إيجار">إيجار</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">السعر</label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="السعر (جنيه)"
                className="input input-bordered w-full rounded-xl"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* Rooms */}
            {showRoomsInput && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  عدد الغرف
                </label>
                <input
                  {...register("rooms", {
                    valueAsNumber: true,
                    setValueAs: (v) =>
                      v === "" || isNaN(v) ? undefined : parseInt(v),
                  })}
                  type="number"
                  placeholder="عدد الغرف"
                  className="input input-bordered w-full rounded-xl"
                />
                {errors.rooms && (
                  <p className="text-red-500 text-sm">{errors.rooms.message}</p>
                )}
              </div>
            )}

            {/* Space */}
            <div>
              <label className="block text-sm font-medium mb-2">
                المساحة (م²)
              </label>
              <input
                {...register("space", { valueAsNumber: true })}
                type="number"
                placeholder="المساحة (م²)"
                className="input input-bordered w-full rounded-xl"
              />
              {errors.space && (
                <p className="text-red-500 text-sm">{errors.space.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Additional Details */}
        <section>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            تفاصيل إضافية
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2">العنوان</label>
              <input
                {...register("address")}
                type="text"
                placeholder="العنوان التفصيلي (مثال: بجوار الجامعة/قريب من المترو)"
                className="input input-bordered w-full rounded-xl"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">الوصف</label>
              <textarea
                {...register("description")}
                placeholder="أضف وصفاً للعقار (التشطيب، المميزات، حالة العقار...)"
                className="textarea textarea-bordered w-full rounded-xl h-32"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            معلومات التواصل
          </h3>
          <label className="block text-sm font-medium mb-2">رقم الواتساب</label>
          <input
            {...register("whatsappNumber")}
            type="text"
            placeholder="رقم الواتساب"
            className="input input-bordered w-full rounded-xl"
          />
          {errors.whatsappNumber && (
            <p className="text-red-500 text-sm">
              {errors.whatsappNumber.message}
            </p>
          )}
        </section>

        {/* Images Upload */}
        <section>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">الصور</h3>
          <ImageUpload images={images} setImages={setImages} />
        </section>

        {creditsCost !== null && (
          <p className="mb-5 text-lg text-error font-extrabold">
            سيتم خصم {creditsCost} من عملات من حسابك عند إنشاء الإعلان
          </p>
        )}

        {/* Submit */}
        <div className="text-center">
          <button
            className={`btn btn-primary w-full md:w-1/2 rounded-xl ${
              isPending && "btn-disabled"
            }`}
            disabled={isPending}
          >
            {isPending ? "جارٍ إنشاء الإعلان..." : "إنشاء الإعلان"}
          </button>
        </div>
      </form>
    </>
  );
}
