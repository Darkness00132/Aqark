"use client";

import AdsView from "@/components/ad/Display/AdsView";
import dynamic from "next/dynamic";

const AdFilters = dynamic(() => import("@/components/ad/Filters/AdFilters"), {
  loading: () => (
    <div className="skeleton h-24 w-full rounded-2xl mb-4" aria-hidden />
  ),
});

export default function Ads() {
  return (
    <div className="min-h-screen px-4">
      <div className="mb-4">
        <AdFilters />
      </div>
      <AdsView />
    </div>
  );
}
