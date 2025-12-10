"use client";

import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaFilter,
  FaHome,
  FaRulerCombined,
  FaDollarSign,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { AdfiltersSchema } from "@/validation/adValidates";
import { CITIES, CITIES_WITH_AREAS, PROPERTY_TYPES } from "@/lib/data";
import type { z } from "zod";
import useAd from "@/store/useAd";

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

  const onSubmit = (data: AdFiltersForm) => {
    setFilters(data);
    const drawerCheckbox = document.getElementById(
      "filter-drawer"
    ) as HTMLInputElement;
    if (drawerCheckbox) drawerCheckbox.checked = false;
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#10b981" : "#e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(16, 185, 129, 0.1)" : "none",
      "&:hover": {
        borderColor: "#10b981",
      },
      minHeight: "2.75rem",
      padding: "0 0.25rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#10b981"
        : state.isFocused
        ? "#f0fdf4"
        : "white",
      color: state.isSelected ? "white" : "#334155",
      "&:active": {
        backgroundColor: "#10b981",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#94a3b8",
    }),
  };

  return (
    <>
      {/* Button to open drawer */}
      <label
        htmlFor="filter-drawer"
        className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
      >
        <FaFilter className="w-4 h-4" />
        <span className="font-medium">تصفية الإعلانات</span>
      </label>

      {/* Drawer structure */}
      <div className="drawer drawer-end fixed inset-0 pointer-events-none z-[9999]">
        <input id="filter-drawer" type="checkbox" className="drawer-toggle" />

        {/* Overlay */}
        <div className="drawer-side pointer-events-auto">
          <label htmlFor="filter-drawer" className="drawer-overlay"></label>

          {/* Drawer content */}
          <div className="w-96 h-full bg-gradient-to-b from-base-100 to-base-200 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-primary text-primary-content p-6 shadow-lg z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FaFilter className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">تصفية الإعلانات</h2>
                </div>
                <label
                  htmlFor="filter-drawer"
                  className="btn btn-sm btn-circle btn-ghost hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </label>
              </div>
            </div>

            {/* Form Content */}
            <form
              className="flex-1 overflow-y-auto p-6 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Location Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
                  <FaMapMarkerAlt className="text-primary w-4 h-4" />
                  <h3 className="font-semibold text-base-content">الموقع</h3>
                </div>

                <div className="space-y-3">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-1 block">
                          المحافظة
                        </label>
                        <Select
                          options={cityOptions}
                          placeholder="اختر المحافظة"
                          value={
                            cityOptions.find((o) => o.value === field.value) ||
                            null
                          }
                          onChange={(option) =>
                            field.onChange(option?.value ?? "")
                          }
                          onBlur={field.onBlur}
                          isClearable
                          instanceId="city-select"
                          styles={customSelectStyles}
                        />
                        {errors.city && (
                          <span className="text-error text-xs mt-1 flex items-center gap-1">
                            ⚠️ {errors.city.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-1 block">
                          المنطقة
                        </label>
                        <Select
                          options={areaOptions}
                          placeholder="اختر المنطقة"
                          value={
                            areaOptions.find((o) => o.value === field.value) ||
                            null
                          }
                          onChange={(option) =>
                            field.onChange(option?.value ?? "")
                          }
                          onBlur={field.onBlur}
                          isClearable
                          isDisabled={!selectedCity}
                          instanceId="area-select"
                          styles={customSelectStyles}
                        />
                        {errors.area && (
                          <span className="text-error text-xs mt-1 flex items-center gap-1">
                            ⚠️ {errors.area.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Property Details Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
                  <FaBuilding className="text-primary w-4 h-4" />
                  <h3 className="font-semibold text-base-content">
                    تفاصيل العقار
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-1 block">
                      نوع العقار
                    </label>
                    <select
                      {...register("propertyType")}
                      className="select select-bordered w-full focus:outline-primary"
                    >
                      <option value="">اختر نوع العقار</option>
                      {PROPERTY_TYPES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.propertyType && (
                      <span className="text-error text-xs mt-1 flex items-center gap-1">
                        ⚠️ {errors.propertyType.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-1 block">
                      نوع العرض
                    </label>
                    <select
                      {...register("type")}
                      className="select select-bordered w-full focus:outline-primary"
                    >
                      <option value="">اختر نوع العرض</option>
                      {types.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <span className="text-error text-xs mt-1 flex items-center gap-1">
                        ⚠️ {errors.type.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1 block">
                        عدد الغرف
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          {...register("rooms", {
                            setValueAs: (value) =>
                              value === "" || isNaN(value)
                                ? undefined
                                : Number.parseInt(value),
                          })}
                          className="input input-bordered w-full pr-10 focus:outline-primary"
                        />
                        <FaHome className="absolute top-3.5 right-3 text-base-content/40" />
                      </div>
                      {errors.rooms && (
                        <span className="text-error text-xs mt-1 flex items-center gap-1">
                          ⚠️ {errors.rooms.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1 block">
                        المساحة (م²)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          {...register("space", {
                            setValueAs: (value) =>
                              value === "" || isNaN(value)
                                ? undefined
                                : Number.parseInt(value),
                          })}
                          className="input input-bordered w-full pr-10 focus:outline-primary"
                        />
                        <FaRulerCombined className="absolute top-3.5 right-3 text-base-content/40" />
                      </div>
                      {errors.space && (
                        <span className="text-error text-xs mt-1 flex items-center gap-1">
                          ⚠️ {errors.space.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
                  <FaDollarSign className="text-primary w-4 h-4" />
                  <h3 className="font-semibold text-base-content">السعر</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-1 block">
                      الحد الأدنى
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        {...register("minPrice", {
                          setValueAs: (value) =>
                            value === "" || isNaN(value)
                              ? undefined
                              : Number.parseInt(value),
                        })}
                        className="input input-bordered w-full pr-10 focus:outline-primary"
                      />
                      <FaDollarSign className="absolute top-3.5 right-3 text-base-content/40" />
                    </div>
                    {errors.minPrice && (
                      <span className="text-error text-xs mt-1 flex items-center gap-1">
                        ⚠️ {errors.minPrice.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-1 block">
                      الحد الأقصى
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        {...register("maxPrice", {
                          setValueAs: (value) =>
                            value === "" || isNaN(value)
                              ? undefined
                              : Number.parseInt(value),
                        })}
                        className="input input-bordered w-full pr-10 focus:outline-primary"
                      />
                      <FaDollarSign className="absolute top-3.5 right-3 text-base-content/40" />
                    </div>
                    {errors.maxPrice && (
                      <span className="text-error text-xs mt-1 flex items-center gap-1">
                        ⚠️ {errors.maxPrice.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sort Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
                  <FaTag className="text-primary w-4 h-4" />
                  <h3 className="font-semibold text-base-content">الترتيب</h3>
                </div>

                <select
                  {...register("order")}
                  className="select select-bordered w-full focus:outline-primary"
                  defaultValue="DESC"
                >
                  <option value="DESC">الأحدث أولاً</option>
                  <option value="ASC">الأقدم أولاً</option>
                  <option value="lowPrice">السعر الأقل</option>
                  <option value="highPrice">السعر الأعلى</option>
                </select>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-base-100 p-4 border-t border-base-300 shadow-lg">
              <div className="flex gap-3">
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
                  className="btn btn-outline btn-secondary flex-1 hover:scale-105 transition-transform"
                >
                  إعادة تعيين
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="btn btn-primary flex-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
