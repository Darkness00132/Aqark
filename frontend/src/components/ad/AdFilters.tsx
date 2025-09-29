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
import { FiX } from "react-icons/fi";
import { AdfiltersSchema } from "@/lib/adValidates";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "@/lib/data";
import type { z } from "zod";
import useAd from "@/store/useAd";

// Types
type AdFiltersForm = z.infer<typeof AdfiltersSchema>;
type Option = { value: string; label: string };

export default function AdFilters() {
  const setFilters = useAd((state) => state.setFilters);
  const filters = useAd((state) => state.filters);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdFiltersForm>({
    resolver: zodResolver(
      AdfiltersSchema.transform((data) =>
        Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v === "" ? undefined : v])
        )
      )
    ),
    defaultValues: filters,
  });

  const selectedCity = watch("city");

  const cityOptions: Option[] = CITIES.map((c) => ({ value: c, label: c }));
  const areaOptions: Option[] = selectedCity
    ? (CITIES_WITH_AREAS[selectedCity] || []).map((a) => ({
        value: a,
        label: a,
      }))
    : [];

  const types = ["تمليك", "إيجار"];
  const inputClass = "input input-bordered w-full";

  const onSubmit = (data: AdFiltersForm) => {
    setFilters(data);
    //close drawer
    const drawerCheckbox = document.getElementById(
      "filter-drawer"
    ) as HTMLInputElement;
    if (drawerCheckbox) drawerCheckbox.checked = false;
  };

  return (
    <div className="drawer drawer-end">
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="filter-drawer" className="btn btn-primary">
          <FaFilter />
          <span>تصفية الإعلانات</span>
        </label>
      </div>

      <div className="drawer-side z-[9999]">
        <label htmlFor="filter-drawer" className="drawer-overlay"></label>
        <div className="w-80 h-full bg-base-100 p-5 flex flex-col gap-4 overflow-y-auto relative">
          {/* Close Button */}
          <label
            htmlFor="filter-drawer"
            className="absolute top-4 left-3 btn btn-sm btn-circle btn-ghost"
          >
            <FiX className="w-5 h-5" />
          </label>

          <h2 className="text-xl font-bold text-primary mb-3 border-b pb-2 text-center">
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
                    aria-label="اختر المحافظة"
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
                    aria-label="اختر المنطقة"
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
              <select {...register("propertyType")} className="select w-full">
                <option value="">اختر نوع العقار</option>
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
              <select {...register("type")} className="select w-full">
                <option value="">اختر نوع العرض</option>
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
              <select
                {...register("order")}
                className="select w-full"
                defaultValue="DESC"
              >
                <option value="DESC">الأحدث أولاً</option>
                <option value="ASC">الأقدم أولاً</option>
                <option value="lowPrice">السعر الأقل</option>
                <option value="highPrice">السعر الأعلى</option>
              </select>
              {errors.order && (
                <span className="text-red-500 text-sm">
                  {errors.order.message}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-[50%]"
              >
                تطبيق
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters({});
                  reset({
                    city: undefined,
                    area: undefined,
                    propertyType: "",
                    type: "",
                    rooms: undefined,
                    space: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    order: "DESC",
                  });
                }}
                className="btn btn-secondary w-full sm:w-[50%]"
              >
                إعادة تعيين
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
