"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { MdHome, MdWarning } from "react-icons/md";
import { PROPERTY_TYPES } from "@/lib/data";

interface FormPropertyDetailsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  showRoomsInput?: boolean;
}

export default function FormPropertyDetailsSection({
  register,
  errors,
  showRoomsInput = false,
}: FormPropertyDetailsSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MdHome className="text-accent text-2xl" />
        تفاصيل العقار
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Property Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">نوع العقار</span>
          </label>
          <select
            {...register("propertyType")}
            className="select select-bordered w-full"
          >
            <option value="">اختر نوع العقار</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.propertyType && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <MdWarning />
                {errors.propertyType.message as string}
              </span>
            </label>
          )}
        </div>

        {/* Ad Type */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">نوع الإعلان</span>
          </label>
          <select {...register("type")} className="select select-bordered w-full">
            <option value="">اختر نوع الإعلان</option>
            <option value="تمليك">تمليك</option>
            <option value="إيجار">إيجار</option>
          </select>
          {errors.type && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <MdWarning />
                {errors.type.message as string}
              </span>
            </label>
          )}
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">السعر (جنيه)</span>
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
              e.currentTarget.blur()
            }
            placeholder="أدخل السعر"
            className="input input-bordered w-full"
          />
          {errors.price && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <MdWarning />
                {errors.price.message as string}
              </span>
            </label>
          )}
        </div>

        {/* Rooms */}
        {showRoomsInput && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">عدد الغرف</span>
            </label>
            <input
              {...register("rooms", {
                valueAsNumber: true,
                setValueAs: (v) =>
                  v === "" || isNaN(v) ? undefined : parseInt(v),
              })}
              type="number"
              onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                e.currentTarget.blur()
              }
              placeholder="أدخل عدد الغرف"
              className="input input-bordered w-full"
            />
            {errors.rooms && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <MdWarning />
                  {errors.rooms.message as string}
                </span>
              </label>
            )}
          </div>
        )}

        {/* Space */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">المساحة (م²)</span>
          </label>
          <input
            {...register("space", { valueAsNumber: true })}
            type="number"
            placeholder="أدخل المساحة"
            onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
              e.currentTarget.blur()
            }
            className="input input-bordered w-full"
          />
          {errors.space && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <MdWarning />
                {errors.space.message as string}
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

