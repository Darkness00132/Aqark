"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DollarSign } from "lucide-react";
import type { z } from "zod";
import { AdfiltersSchema } from "@/validation/adValidates";

type AdFiltersForm = z.infer<typeof AdfiltersSchema>;

interface PriceFilterProps {
  register: UseFormRegister<AdFiltersForm>;
  errors: FieldErrors<AdFiltersForm>;
}

export default function PriceFilter({ register, errors }: PriceFilterProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
        <DollarSign className="text-primary w-4 h-4" />
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
            <DollarSign className="absolute top-3.5 right-3 text-base-content/40" />
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
            <DollarSign className="absolute top-3.5 right-3 text-base-content/40" />
          </div>
          {errors.maxPrice && (
            <span className="text-error text-xs mt-1 flex items-center gap-1">
              ⚠️ {errors.maxPrice.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
