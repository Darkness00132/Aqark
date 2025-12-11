"use client";

import Select from "react-select";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CITIES, CITIES_WITH_AREAS } from "@/lib/data";
import type { z } from "zod";
import { AdfiltersSchema } from "@/validation/adValidates";

type AdFiltersForm = z.infer<typeof AdfiltersSchema>;
type Option = { value: string; label: string };

interface LocationFilterProps {
  control: Control<AdFiltersForm>;
  errors: FieldErrors<AdFiltersForm>;
  selectedCity?: string;
  customSelectStyles: any;
}

export default function LocationFilter({
  control,
  errors,
  selectedCity,
  customSelectStyles,
}: LocationFilterProps) {
  const cityOptions: Option[] = CITIES.map((c) => ({ value: c, label: c }));
  const areaOptions: Option[] = selectedCity
    ? (CITIES_WITH_AREAS[selectedCity] || []).map((a) => ({
        value: a,
        label: a,
      }))
    : [];

  return (
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
                  cityOptions.find((o) => o.value === field.value) || null
                }
                onChange={(option) => field.onChange(option?.value ?? "")}
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
                  areaOptions.find((o) => o.value === field.value) || null
                }
                onChange={(option) => field.onChange(option?.value ?? "")}
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
  );
}

