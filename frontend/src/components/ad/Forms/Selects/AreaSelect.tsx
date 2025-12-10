"use client";

import Select, { SingleValue } from "react-select";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { CITIES_WITH_AREAS } from "@/lib/data";

type Option = { value: string; label: string };

interface AreaSelectProps<T extends FieldValues> {
  control: Control<T>;
  selectedCity?: string;
  error?: string;
}

export default function AreaSelect<T extends FieldValues>({
  control,
  selectedCity,
  error,
}: AreaSelectProps<T>) {
  const areaOptions: Option[] =
    selectedCity && CITIES_WITH_AREAS[selectedCity]
      ? CITIES_WITH_AREAS[selectedCity].map((area) => ({
          value: area,
          label: area,
        }))
      : [];

  return (
    <div className="form-control">
      <Controller
        name={"area" as Path<T>} // hardcoded like "city"
        control={control}
        render={({ field }) => (
          <Select
            options={areaOptions}
            placeholder="اختر المنطقة"
            value={areaOptions.find((opt) => opt.value === field.value) || null}
            onChange={(opt: SingleValue<Option>) => field.onChange(opt?.value)}
            onBlur={field.onBlur}
            instanceId="area-select"
            isDisabled={!selectedCity}
          />
        )}
      />
      {error && <span className="text-red-500 mt-1">{error}</span>}
    </div>
  );
}
