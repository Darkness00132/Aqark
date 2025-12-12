"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AlertCircle, Edit } from "lucide-react";

interface FormTitleSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function FormTitleSection({
  register,
  errors,
}: FormTitleSectionProps) {
  return (
    <div className="form-control">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Edit className="text-primary text-xl" />
        عنوان الإعلان
      </h3>
      <input
        {...register("title")}
        type="text"
        placeholder="مثال: شقة للبيع في الزمالك"
        className="input input-bordered input-lg w-full"
      />
      {errors.title && (
        <label className="label">
          <span className="label-text-alt text-error flex items-center gap-1">
            <AlertCircle />
            {errors.title.message as string}
          </span>
        </label>
      )}
    </div>
  );
}
