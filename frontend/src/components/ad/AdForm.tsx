"use client";

import Select, { SingleValue } from "react-select";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdSchema } from "@/lib/adValidates";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "@/lib/data";

export default function AdForm() {
  const [images, setImages] = useState<File[]>([]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof createAdSchema>>({
    resolver: zodResolver(createAdSchema),
  });

  const selectedCity = watch("city");
  const cityOptions = CITIES.map((city) => ({ value: city, label: city }));
  const areaOptions = selectedCity
    ? CITIES_WITH_AREAS[selectedCity].map((area) => ({
        value: area,
        label: area,
      }))
    : [];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: "image/webp",
          };
          return await imageCompression(file, options);
        })
      );
      setImages((prev) => [...prev, ...compressedFiles]);
    } catch (error) {
      console.error("Error compressing images:", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: z.infer<typeof createAdSchema>) => {
    console.log(data, images);
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
              placeholder="اختر المدينة"
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
          {...register("rooms", { valueAsNumber: true })}
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
          placeholder="المساحة (م²)"
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
          <option value="ايجار">إيجار</option>
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
      <div className="col-span-1 md:col-span-3">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer ${
            isDragActive
              ? "border-secondary bg-base-200"
              : "border-base-300 bg-base-100"
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-600">
            {isDragActive
              ? "ضع الصور هنا..."
              : "اسحب الصور هنا أو اضغط لاختيارها"}
          </p>
          <p className="text-sm text-gray-400 mt-1">يمكنك اختيار عدة صور</p>
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((file, idx) => (
              <div key={idx} className="card bg-base-100 shadow relative">
                <div className="aspect-[4/3] relative w-full overflow-hidden rounded-lg">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 btn btn-sm btn-circle btn-error text-white"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="col-span-1 md:col-span-3 mt-4 text-center">
        <button className="btn btn-primary w-full md:w-1/2">
          إنشاء الإعلان
        </button>
      </div>
    </form>
  );
}
