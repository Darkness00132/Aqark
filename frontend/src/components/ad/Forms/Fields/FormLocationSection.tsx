"use client";

import { Control, FieldErrors } from "react-hook-form";
import { MapPin } from "lucide-react";
import CitySelect from "../Selects/CitySelect";
import AreaSelect from "../Selects/AreaSelect";

interface FormLocationSectionProps {
  control: Control<any>;
  selectedCity?: string;
  selectedArea?: string;
  errors: FieldErrors<any>;
}

export default function FormLocationSection({
  control,
  selectedCity,
  selectedArea,
  errors,
}: FormLocationSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="text-secondary text-2xl" />
        الموقع
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CitySelect
          control={control}
          error={errors.city?.message as string | undefined}
        />
        <AreaSelect
          control={control}
          selectedCity={selectedCity}
          error={errors.area?.message as string | undefined}
        />
      </div>
    </div>
  );
}
