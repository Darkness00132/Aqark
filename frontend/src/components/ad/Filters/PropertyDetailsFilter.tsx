"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FaBuilding, FaHome, FaRulerCombined } from "react-icons/fa";
import { PROPERTY_TYPES } from "@/lib/data";
import type { z } from "zod";
import { AdfiltersSchema } from "@/validation/adValidates";

type AdFiltersForm = z.infer<typeof AdfiltersSchema>;

interface PropertyDetailsFilterProps {
  register: UseFormRegister<AdFiltersForm>;
  errors: FieldErrors<AdFiltersForm>;
}

const types = ["تمليك", "إيجار"];

export default function PropertyDetailsFilter({
  register,
  errors,
}: PropertyDetailsFilterProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
        <FaBuilding className="text-primary w-4 h-4" />
        <h3 className="font-semibold text-base-content">تفاصيل العقار</h3>
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
  );
}

