"use client";

import { UseFormRegister } from "react-hook-form";
import { FaTag } from "react-icons/fa";
import type { z } from "zod";
import { AdfiltersSchema } from "@/validation/adValidates";

type AdFiltersForm = z.infer<typeof AdfiltersSchema>;

interface SortFilterProps {
  register: UseFormRegister<AdFiltersForm>;
}

export default function SortFilter({ register }: SortFilterProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-base-300">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-300">
        <FaTag className="text-primary w-4 h-4" />
        <h3 className="font-semibold text-base-content">الترتيب</h3>
      </div>

      <select
        {...register("order")}
        className="select select-bordered w-full focus:outline-primary"
        defaultValue="DESC"
      >
        <option value="DESC">الأحدث أولاً</option>
        <option value="ASC">الأقدم أولاً</option>
        <option value="lowPrice">السعر الأقل</option>
        <option value="highPrice">السعر الأعلى</option>
      </select>
    </div>
  );
}

