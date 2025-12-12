"use client";

import { Sliders } from "lucide-react";

export default function FilterButton() {
  return (
    <label
      htmlFor="filter-drawer"
      className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
    >
      <Sliders className="w-4 h-4" />
      <span className="font-medium">تصفية الإعلانات</span>
    </label>
  );
}
