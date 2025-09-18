"use client";

import Select, { SingleValue } from "react-select";
import { z } from "zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdSchema } from "@/lib/adValidates";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "@/lib/data";
import useCreateAd from "@/hooks/ad/useCreateAd";
import ImageUpload from "./ImagesUpload";

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
    defaultValues: {
      rooms: undefined,
    },
  });

  const selectedCity = watch("city");
  const cityOptions = CITIES.map((city) => ({ value: city, label: city }));
  const areaOptions = selectedCity
    ? CITIES_WITH_AREAS[selectedCity].map((area) => ({
        value: area,
        label: area,
      }))
    : [];

  const { mutate, isPending } = useCreateAd();

  const onSubmit = (data: z.infer<CreateAdSchema>) => {
    mutate({ images, data });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
    >
      {/* Title */}
      <div className="col-span-1 md:col-span-3 form-control">
        <input
          {...register("title")}
          type="text"
          placeholder="عنوان الإعلان"
          className="input input-bordered w-full"
        />
        {errors.title && (
          <label className="label">
            <span className="label-text-alt text-red-500">
              {errors.title.message}
            </span>
          </label>
        )}
      </div>

      {/* City */}
      <div className="form-control">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Select
              options={cityOptions}
              placeholder="اختر المحافظة"
              value={
                cityOptions.find((option) => option.value === field.value) ||
                null
              }
              onChange={(
                option: SingleValue<{ value: string; label: string }>
              ) => field.onChange(option?.value)}
              onBlur={field.onBlur}
              instanceId="city-select"
            />
          )}
        />
        {errors.city && (
          <span className="text-red-500 mt-1">{errors.city.message}</span>
        )}
      </div>

      {/* Area */}
      <div className="form-control">
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <Select
              options={areaOptions}
              placeholder="اختر المنطقة"
              value={
                areaOptions.find((option) => option.value === field.value) ||
                null
              }
              onChange={(
                option: SingleValue<{ value: string; label: string }>
              ) => field.onChange(option?.value)}
              onBlur={field.onBlur}
              instanceId="area-select"
              isDisabled={!selectedCity}
            />
          )}
        />
        {errors.area && (
          <span className="text-red-500 mt-1">{errors.area.message}</span>
        )}
      </div>

      {/* Rooms */}
      <div className="form-control">
        <input
          {...register("rooms", {
            setValueAs: (value) =>
              value === "" || isNaN(value) ? undefined : parseInt(value),
          })}
          type="number"
          placeholder="عدد الغرف"
          className="input input-bordered w-full"
        />
        {errors.rooms && (
          <span className="text-red-500 mt-1">{errors.rooms.message}</span>
        )}
      </div>

      {/* Space */}
      <div className="form-control">
        <input
          {...register("space", { valueAsNumber: true })}
          type="number"
          placeholder="المساحة بمتر او بقيراط"
          className="input input-bordered w-full"
        />
        {errors.space && (
          <span className="text-red-500 mt-1">{errors.space.message}</span>
        )}
      </div>

      {/* Property Type */}
      <div className="form-control">
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
          <span className="text-red-500 mt-1">
            {errors.propertyType.message}
          </span>
        )}
      </div>

      {/* Ad Type */}
      <div className="form-control">
        <select {...register("type")} className="select select-bordered w-full">
          <option value="">اختر نوع الإعلان</option>
          <option value="تمليك">تمليك</option>
          <option value="إيجار">إيجار</option>
        </select>
        {errors.type && (
          <span className="text-red-500 mt-1">{errors.type.message}</span>
        )}
      </div>

      {/* Price */}
      <div className="form-control">
        <input
          {...register("price", { valueAsNumber: true })}
          type="number"
          placeholder="السعر"
          className="input input-bordered w-full"
        />
        {errors.price && (
          <span className="text-red-500 mt-1">{errors.price.message}</span>
        )}
      </div>

      {/* Whatsapp */}
      <div className="form-control">
        <input
          {...register("whatsappNumber")}
          type="text"
          placeholder="رقم الواتساب"
          className="input input-bordered w-full"
        />
        {errors.whatsappNumber && (
          <span className="text-red-500 mt-1">
            {errors.whatsappNumber.message}
          </span>
        )}
      </div>

      {/* Address */}
      <div className="col-span-1 md:col-span-3 form-control">
        <input
          {...register("address")}
          type="text"
          placeholder="العنوان التفصيلي"
          className="input input-bordered w-full"
        />
        {errors.address && (
          <span className="text-red-500 mt-1">{errors.address.message}</span>
        )}
      </div>

      {/* Description */}
      <div className="col-span-1 md:col-span-3 form-control">
        <textarea
          {...register("description")}
          placeholder="وصف العقار"
          className="textarea textarea-bordered w-full h-32"
        />
        {errors.description && (
          <span className="text-red-500 mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Images Upload */}
      <ImageUpload setImages={setImages} images={images} />
      {/* Submit */}
      <div className="col-span-1 md:col-span-3 mt-4 text-center">
        <button
          className={`btn btn-primary w-full md:w-1/2 ${
            isPending && "btn-disabled"
          }`}
          disabled={isPending}
        >
          إنشاء الإعلان
        </button>
      </div>
    </form>
  );
}
