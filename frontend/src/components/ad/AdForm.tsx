"use client";
import Select, { SingleValue } from "react-select";
import { createAdSchema } from "@/lib/adValidates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "@/lib/data";

export default function AdForm() {
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

  const onSubmit = (data: z.infer<typeof createAdSchema>) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Title */}
      <div className="col-span-2">
        <input
          {...register("title")}
          type="text"
          placeholder="عنوان الإعلان"
          className="input input-bordered w-full"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      {/* City */}
      <div className="mb-4">
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
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
      </div>

      {/* Area */}
      <div className="mb-4">
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
        {errors.area && <p className="text-red-500">{errors.area.message}</p>}
      </div>

      {/* Rooms & Space */}
      <div>
        <input
          {...register("rooms", { valueAsNumber: true })}
          type="number"
          placeholder="عدد الغرف"
          className="input input-bordered w-full"
        />
        {errors.rooms && <p className="text-red-500">{errors.rooms.message}</p>}
      </div>

      <div>
        <input
          {...register("space", { valueAsNumber: true })}
          type="number"
          placeholder="المساحة (م²)"
          className="input input-bordered w-full"
        />
        {errors.space && <p className="text-red-500">{errors.space.message}</p>}
      </div>

      {/* Property Type & Ad Type */}
      <div>
        <select
          {...register("propertyType")}
          className="input input-bordered w-full"
        >
          <option value="">اختر نوع العقار</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p className="text-red-500">{errors.propertyType.message}</p>
        )}
      </div>

      <div>
        <select {...register("type")} className="input input-bordered w-full">
          <option value="">اختر نوع الإعلان</option>
          <option value="تمليك">تمليك</option>
          <option value="ايجار">إيجار</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      {/* Address */}
      <div className="col-span-2">
        <input
          {...register("address")}
          type="text"
          placeholder="العنوان التفصيلي"
          className="input input-bordered w-full"
        />
        {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="col-span-2">
        <textarea
          {...register("description")}
          placeholder="وصف العقار"
          className="textarea textarea-bordered w-full h-32"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price & Whatsapp */}
      <div>
        <input
          {...register("price", { valueAsNumber: true })}
          type="number"
          placeholder="السعر"
          className="input input-bordered w-full"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <input
          {...register("whatsappNumber")}
          type="text"
          placeholder="رقم الواتساب"
          className="input input-bordered w-full"
        />
        {errors.whatsappNumber && (
          <p className="text-red-500">{errors.whatsappNumber.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="col-span-2">
        <label className="block mb-2 font-medium">صور العقار</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="file-input file-input-bordered w-full"
        />
      </div>

      {/* Submit */}
      <div className="col-span-2 text-center">
        <button type="submit" className="btn btn-primary w-full sm:w-1/2">
          إنشاء الإعلان
        </button>
      </div>
    </form>
  );
}
