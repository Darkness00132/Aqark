"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { MdDescription, MdWarning } from "react-icons/md";

interface FormAdditionalDetailsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function FormAdditionalDetailsSection({
  register,
  errors,
}: FormAdditionalDetailsSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MdDescription className="text-info text-2xl" />
        تفاصيل إضافية
      </h3>

      {/* Address */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold">العنوان التفصيلي</span>
        </label>
        <input
          {...register("address")}
          type="text"
          placeholder="مثال: بجوار الجامعة، قريب من المترو"
          className="input input-bordered w-full"
        />
        {errors.address && (
          <label className="label">
            <span className="label-text-alt text-error flex items-center gap-1">
              <MdWarning />
              {errors.address.message as string}
            </span>
          </label>
        )}
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">الوصف الكامل</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="أضف وصفاً تفصيلياً للعقار: التشطيب، المميزات، حالة العقار، القرب من الخدمات..."
          className="textarea textarea-bordered h-32 w-full"
        />
        {errors.description && (
          <label className="label">
            <span className="label-text-alt text-error flex items-center gap-1">
              <MdWarning />
              {errors.description.message as string}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

