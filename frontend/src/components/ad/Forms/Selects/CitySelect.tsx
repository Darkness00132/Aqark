"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Select from "react-select";
import { CITIES } from "@/lib/data";

interface CitySelectProps<T extends FieldValues> {
  control: Control<T>;
  error?: string;
}

export default function CitySelect<T extends FieldValues>({
  control,
  error,
}: CitySelectProps<T>) {
  const cityOptions = CITIES.map((city) => ({ value: city, label: city }));

  return (
    <div className="form-control">
      <Controller
        name={"city" as Path<T>}
        control={control}
        render={({ field }) => (
          <Select
            options={cityOptions}
            placeholder="اختر المحافظة"
            value={cityOptions.find((opt) => opt.value === field.value) || null}
            onChange={(opt) => field.onChange(opt?.value)}
            onBlur={field.onBlur}
            instanceId="city-select"
          />
        )}
      />
      {error && <span className="text-red-500 mt-1">{error}</span>}
    </div>
  );
}
