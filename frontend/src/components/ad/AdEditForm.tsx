"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdEditSchema } from "@/lib/adValidates";
import { PROPERTY_TYPES } from "@/lib/data";
import { Ad } from "@/store/useAd";

import useEditAd from "@/hooks/ad/useEditAd";
import CitySelect from "./Select/CitySelect";
import AreaSelect from "./Select/AreaSelect";
import ImageUpload from "./ImagesUpload";

const ROOM_BASED_PROPERTIES = ["شقة", "فيلا", "منزل"];

export default function AdEditForm({ ad }: { ad: Ad }) {
  const [images, setImages] = useState<File[]>([]);
  const deletedImages: Array<{ url: string; key: string }> = [];

  type EditForm = z.infer<typeof AdEditSchema>;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<EditForm>({
    resolver: zodResolver(AdEditSchema),
    defaultValues: ad,
  });

  const selectedCity = watch("city");
  const selectedPropertyType = watch("propertyType");
  const showRoomsInput = ROOM_BASED_PROPERTIES.includes(
    selectedPropertyType || ""
  );

  const { mutate, isPending } = useEditAd();

  const onSubmit = (data: EditForm) => {
    const updatedAd: Record<string, string | number | undefined> = {};
    for (const key of Object.keys(dirtyFields)) {
      if (key in data) {
        const propertyKey = key as keyof typeof data;
        updatedAd[propertyKey] = data[propertyKey];
      }
    }
    mutate({ data: updatedAd, images, deletedImages, id: ad.id });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">عنوان الإعلان</label>
        <input
          {...register("title")}
          type="text"
          className="input input-bordered w-full rounded-xl"
          placeholder="مثال: شقة للإيجار في مدينة نصر"
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
          {/* Rooms (conditionally shown) */}
          {showRoomsInput && (
            <div>
              <label className="block text-sm font-medium mb-2">
                عدد الغرف
              </label>
              <input
                {...register("rooms", {
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? undefined : parseInt(v),
                })}
                type="number"
                placeholder="مثال: 3"
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
              placeholder="مثال: 120"
              className="input input-bordered w-full rounded-xl"
            />
            {errors.space && (
              <p className="text-red-500 text-sm">{errors.space.message}</p>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-2">نوع العقار</label>
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
              placeholder="مثال: 250000"
              className="input input-bordered w-full rounded-xl"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
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
          placeholder="مثال: 01012345678"
          className="input input-bordered w-full rounded-xl"
        />
        {errors.whatsappNumber && (
          <p className="text-red-500 text-sm">
            {errors.whatsappNumber.message}
          </p>
        )}
      </section>

      {/* Address & Description */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          تفاصيل إضافية
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2">
              العنوان التفصيلي
            </label>
            <input
              {...register("address")}
              type="text"
              placeholder="مثال: بجوار الجامعة / قريب من المترو"
              className="input input-bordered w-full rounded-xl"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">وصف العقار</label>
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

      {/* Images Upload */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">الصور</h3>
        <ImageUpload
          images={images}
          setImages={setImages}
          defaultImages={ad.images}
          deletedImages={deletedImages}
        />
      </section>

      {/* Submit */}
      <div className="text-center">
        <button
          className={`btn btn-primary w-full md:w-1/2 rounded-xl ${
            isPending && "btn-disabled"
          }`}
          disabled={isPending}
        >
          {isPending ? "جارٍ تعديل الإعلان..." : "تعديل الإعلان"}
        </button>
      </div>
    </form>
  );
}
