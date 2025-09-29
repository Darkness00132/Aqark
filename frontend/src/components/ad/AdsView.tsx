"use client";
import { useState } from "react";
import AdCard from "./AdCard";
import useGetAds from "@/hooks/ad/useGetAds";
import Pagination from "./Pagination";

export default function AdsView({ mine = false }: { mine?: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetAds(mine, currentPage);
  console.log(data);

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-dots w-16"></span>
      </div>
    );
  }

  if (!data || data.ads.length === 0) {
    return <p className="text-center text-2xl py-10">لا توجد إعلانات</p>;
  }

  return (
    <div className="flex-1">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
