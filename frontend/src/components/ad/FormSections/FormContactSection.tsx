"use client";

import { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { MdPhone, MdWarning } from "react-icons/md";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface FormContactSectionProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export default function FormContactSection({
  control,
  errors,
}: FormContactSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MdPhone className="text-success text-2xl" />
        معلومات التواصل
      </h3>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">رقم الواتساب</span>
        </label>
        <Controller
          name="whatsappNumber"
          control={control}
          render={({ field }) => (
            <PhoneInput
              {...field}
              placeholder="أدخل رقم به واتساب"
              defaultCountry="EG"
              international
              autoComplete="tel"
              countryCallingCodeEditable={false}
              className="input input-bordered w-full"
            />
          )}
        />
        {errors.whatsappNumber && (
          <label className="label">
            <span className="label-text-alt text-error flex items-center gap-1">
              <MdWarning />
              {errors.whatsappNumber.message as string}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

