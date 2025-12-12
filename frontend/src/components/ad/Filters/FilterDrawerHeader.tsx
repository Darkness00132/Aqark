"use client";

import { Sliders, X } from "lucide-react";

export default function FilterDrawerHeader() {
  return (
    <div className="sticky top-0 bg-primary text-primary-content p-6 shadow-lg z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold">تصفية الإعلانات</h2>
        </div>
        <label
          htmlFor="filter-drawer"
          className="btn btn-sm btn-circle btn-ghost hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </label>
      </div>
    </div>
  );
}
