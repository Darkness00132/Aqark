"use client";

import dynamic from "next/dynamic";

const AdFilters = dynamic(() => import("@/components/ad/Filters/AdFilters"), {
  loading: () => (
    <div className="skeleton h-24 w-full rounded-2xl mb-4" aria-hidden />
  ),
});

const AdsView = dynamic(() => import("@/components/ad/Display/AdsView"), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="skeleton h-56 w-full rounded-2xl" />
      ))}
    </div>
  ),
  ssr: false,
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
