"use client";

import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MdDriveFileRenameOutline,
  MdLocationOn,
  MdHome,
  MdDescription,
  MdPhone,
  MdImage,
  MdWarning,
  MdEdit,
} from "react-icons/md";

import { AdEditSchema } from "@/lib/adValidates";
import { PROPERTY_TYPES } from "@/lib/data";
import { Ad } from "@/store/useAd";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <div className="form-control">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdDriveFileRenameOutline className="text-primary text-xl" />
            عنوان الإعلان
          </h3>
          <input
            {...register("title")}
            type="text"
            placeholder="مثال: شقة للإيجار في مدينة نصر"
            className="input input-bordered input-lg w-full"
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <MdWarning />
                {errors.title.message}
              </span>
            </label>
          )}
        </div>

        <div className="divider"></div>

        {/* Location */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdLocationOn className="text-secondary text-2xl" />
            الموقع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CitySelect control={control} error={errors.city?.message} />
            <AreaSelect
              control={control}
              selectedCity={selectedCity}
              error={errors.area?.message}
            />
          </div>
        </div>

        <div className="divider"></div>

        {/* Property Details */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdHome className="text-accent text-2xl" />
            تفاصيل العقار
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Property Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">نوع العقار</span>
              </label>
              <select
                {...register("propertyType")}
                className="select select-bordered w-full"
              >
                <option value="">اختر نوع العقار</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.propertyType && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <MdWarning />
                    {errors.propertyType.message}
                  </span>
                </label>
              )}
            </div>

            {/* Ad Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">نوع الإعلان</span>
              </label>
              <select
                {...register("type")}
                className="select select-bordered w-full"
              >
                <option value="">اختر نوع الإعلان</option>
                <option value="تمليك">تمليك</option>
                <option value="إيجار">إيجار</option>
              </select>
              {errors.type && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <MdWarning />
                    {errors.type.message}
                  </span>
                </label>
              )}
            </div>

            {/* Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">السعر (جنيه)</span>
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="أدخل السعر"
                className="input input-bordered w-full"
              />
              {errors.price && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <MdWarning />
                    {errors.price.message}
                  </span>
                </label>
              )}
            </div>

            {/* Rooms */}
            {showRoomsInput && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">عدد الغرف</span>
                </label>
                <input
                  {...register("rooms", {
                    valueAsNumber: true,
                    setValueAs: (v) =>
                      v === "" || isNaN(v) ? undefined : parseInt(v),
                  })}
                  type="number"
                  placeholder="أدخل عدد الغرف"
                  className="input input-bordered w-full"
                />
                {errors.rooms && (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <MdWarning />
                      {errors.rooms.message}
                    </span>
                  </label>
                )}
              </div>
            )}

            {/* Space */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">المساحة (م²)</span>
              </label>
              <input
                {...register("space", { valueAsNumber: true })}
                type="number"
                placeholder="أدخل المساحة"
                className="input input-bordered w-full"
              />
              {errors.space && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <MdWarning />
                    {errors.space.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Additional Details */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdDescription className="text-info text-2xl" />
            تفاصيل إضافية
          </h3>

          {/* Address */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">العنوان التفصيلي</span>
            </label>
            <input
              {...register("address")}
              type="text"
              placeholder="مثال: بجوار الجامعة، قريب من المترو"
              className="input input-bordered w-full"
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <MdWarning />
                  {errors.address.message}
                </span>
              </label>
            )}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">الوصف الكامل</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="أضف وصفاً تفصيلياً للعقار: التشطيب، المميزات، حالة العقار، القرب من الخدمات..."
              className="textarea textarea-bordered h-32 w-full"
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <MdWarning />
                  {errors.description.message}
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="divider"></div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdPhone className="text-success text-2xl" />
            معلومات التواصل
          </h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">رقم الواتساب</span>
            </label>
            <Controller
              name="whatsappNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="أدخل رقم به واتساب"
                  defaultCountry="EG"
                  international
                  autoComplete="tel"
                  countryCallingCodeEditable={false}
                  className="input input-bordered w-full"
                />
              )}
            />
            {errors.whatsappNumber && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <MdWarning />
                  {errors.whatsappNumber.message}
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="divider"></div>

        {/* Images Upload */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MdImage className="text-warning text-2xl" />
            صور العقار
          </h3>
          <ImageUpload
            images={images}
            setImages={setImages}
            defaultImages={ad.images}
            deletedImages={deletedImages}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={isPending}
        >
          {isPending ? (
            <span>
              <span className="loading loading-spinner"></span>
              جارٍ تعديل الإعلان...
            </span>
          ) : (
            <span>تعديل الإعلان</span>
          )}
        </button>
      </form>
    </div>
  );
}
