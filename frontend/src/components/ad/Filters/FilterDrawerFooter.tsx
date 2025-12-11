"use client";

import { UseFormReset, UseFormHandleSubmit } from "react-hook-form";
import useAd from "@/store/useAd";
import type { z } from "zod";
import { AdfiltersSchema } from "@/validation/adValidates";

type AdFiltersForm = z.infer<typeof AdfiltersSchema>;

interface FilterDrawerFooterProps {
  reset: UseFormReset<AdFiltersForm>;
  handleSubmit: UseFormHandleSubmit<AdFiltersForm>;
  onSubmit: (data: AdFiltersForm) => void;
}

export default function FilterDrawerFooter({
  reset,
  handleSubmit,
  onSubmit,
}: FilterDrawerFooterProps) {
  const setFilters = useAd((state) => state.setFilters);

  return (
    <div className="sticky bottom-0 bg-base-100 p-4 border-t border-base-300 shadow-lg">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setFilters({});
            reset({
              city: undefined,
              area: undefined,
              propertyType: "",
              type: "",
              rooms: undefined,
              space: undefined,
              minPrice: undefined,
              maxPrice: undefined,
              order: "DESC",
            });
          }}
          className="btn btn-outline btn-secondary flex-1 hover:scale-105 transition-transform"
        >
          إعادة تعيين
        </button>
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="btn btn-primary flex-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );
}

