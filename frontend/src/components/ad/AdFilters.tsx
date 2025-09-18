"use client";

import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaFilter,
  FaHome,
  FaRulerCombined,
  FaDollarSign,
} from "react-icons/fa";
import { AdfiltersSchema } from "@/lib/adValidates";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "@/lib/data";
import type { z } from "zod";

// Types
type AdFiltersForm = z.infer<typeof AdfiltersSchema>;
type Option = { value: string; label: string };

export default function AdFilters() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AdFiltersForm>({
    resolver: zodResolver(
      AdfiltersSchema.transform((data) =>
        Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v === "" ? undefined : v])
        )
      )
    ),
    defaultValues: {
      city: "",
      area: "",
      propertyType: "",
      type: undefined,
      rooms: undefined,
      space: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      orderBy: "",
    },
  });

  const selectedCity = watch("city");

  const cityOptions: Option[] = CITIES.map((c) => ({ value: c, label: c }));
  const areaOptions: Option[] = selectedCity
    ? (CITIES_WITH_AREAS[selectedCity] || []).map((a) => ({
        value: a,
        label: a,
      }))
    : [];

  const types = ["تمليك", "ايجار"];
  const orderOptions = ["تاريخ الإضافة", "السعر"];
  const inputClass = "input input-bordered w-full";

  const onSubmit = (data: AdFiltersForm) => console.log("Filters:", data);

  return (
    <div className="drawer drawer-end">
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="filter-drawer" className="btn btn-primary btn-circle">
          <FaFilter />
        </label>
      </div>

      <div className="drawer-side z-9999">
        <label htmlFor="filter-drawer" className="drawer-overlay"></label>
        <div className="w-80 h-full bg-base-100 p-5 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-primary mb-3 border-b pb-2">
            تصفية الإعلانات
          </h2>

          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* City */}
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <div>
                  <Select<Option, false>
                    options={cityOptions}
                    placeholder="اختر المحافظة"
                    value={
                      cityOptions.find((o) => o.value === field.value) || null
                    }
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    onBlur={field.onBlur}
                    isClearable
                    instanceId="city-select"
                  />
                  {errors.city && (
                    <span className="text-red-500 text-sm">
                      {errors.city.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Area */}
            <Controller
              name="area"
              control={control}
              render={({ field }) => (
                <div>
                  <Select<Option, false>
                    options={areaOptions}
                    placeholder="اختر المنطقة"
                    value={
                      areaOptions.find((o) => o.value === field.value) || null
                    }
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    onBlur={field.onBlur}
                    isClearable
                    isDisabled={!selectedCity}
                    instanceId="area-select"
                  />
                  {errors.area && (
                    <span className="text-red-500 text-sm">
                      {errors.area.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Property Type */}
            <div>
              <select {...register("propertyType")} className={inputClass}>
                <option value="" disabled>
                  اختر نوع العقار
                </option>
                {PROPERTY_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.propertyType && (
                <span className="text-red-500 text-sm">
                  {errors.propertyType.message}
                </span>
              )}
            </div>

            {/* Type */}
            <div>
              <select {...register("type")} className={inputClass}>
                <option value="" disabled>
                  اختر نوع العرض
                </option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && (
                <span className="text-red-500 text-sm">
                  {errors.type.message}
                </span>
              )}
            </div>

            {/* Rooms & Space */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="عدد الغرف"
                  {...register("rooms", {
                    setValueAs: (value) =>
                      value === "" || isNaN(value)
                        ? undefined
                        : Number.parseInt(value),
                  })}
                  className={`${inputClass} pl-8`}
                />
                <FaHome className="absolute top-2 left-2 text-gray-400" />
                {errors.rooms && (
                  <span className="text-red-500 text-sm">
                    {errors.rooms.message}
                  </span>
                )}
              </div>

              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="المساحة"
                  {...register("space", {
                    setValueAs: (value) =>
                      value === "" || isNaN(value)
                        ? undefined
                        : Number.parseInt(value),
                  })}
                  className={`${inputClass} pl-8`}
                />
                <FaRulerCombined className="absolute top-2 left-2 text-gray-400" />
                {errors.space && (
                  <span className="text-red-500 text-sm">
                    {errors.space.message}
                  </span>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="الحد الأدنى"
                  {...register("minPrice", {
                    setValueAs: (value) =>
                      value === "" || isNaN(value)
                        ? undefined
                        : Number.parseInt(value),
                  })}
                  className={`${inputClass} pl-8`}
                />
                <FaDollarSign className="absolute top-2 left-2 text-gray-400" />
                {errors.minPrice && (
                  <span className="text-red-500 text-sm">
                    {errors.minPrice.message}
                  </span>
                )}
              </div>

              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="الحد الأقصى"
                  {...register("maxPrice", {
                    setValueAs: (value) =>
                      value === "" || isNaN(value)
                        ? undefined
                        : Number.parseInt(value),
                  })}
                  className={`${inputClass} pl-8`}
                />
                <FaDollarSign className="absolute top-2 left-2 text-gray-400" />
                {errors.maxPrice && (
                  <span className="text-red-500 text-sm">
                    {errors.maxPrice.message}
                  </span>
                )}
              </div>
            </div>

            {/* Order By */}
            <div>
              <select {...register("orderBy")} className={inputClass}>
                <option value="">ترتيب حسب</option>
                {orderOptions.map((o) => (
                  <option key={o} value={o === "السعر" ? "price" : "createdAt"}>
                    {o}
                  </option>
                ))}
              </select>
              {errors.orderBy && (
                <span className="text-red-500 text-sm">
                  {errors.orderBy.message}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary flex-1">
                تطبيق
              </button>
              <label htmlFor="filter-drawer" className="btn btn-outline flex-1">
                إغلاق
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
