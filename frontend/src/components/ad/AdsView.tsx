"use client";
import { useState } from "react";
import AdCard from "./AdCard";
import useGetAds from "@/hooks/ad/useGetAds";
import Pagination from "./Pagination";

export default function AdsView({ mine = false }: { mine?: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetAds(mine, currentPage);

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!data || data.ads.length === 0) {
    return (
      <div className="alert alert-info justify-center">
        <span>لا توجد إعلانات</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.ads.map((ad) => (
          <AdCard key={ad.slug} ad={ad} mine={mine} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
