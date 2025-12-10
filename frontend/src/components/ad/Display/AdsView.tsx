"use client";
import dynamic from "next/dynamic";
import { useState, memo } from "react";
import { Pagination, AdCardsLoading } from "./index";
import { useGetAds } from "@/hooks/ad";

const AdCard = dynamic(() => import("./AdCard"), {
  ssr: false,
  loading: () => <AdCardsLoading />,
});

interface AdsViewProps {
  mine?: boolean;
}

function AdsView({ mine = false }: AdsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetAds(mine, currentPage);

  if (isFetching) {
    return <AdCardsLoading />;
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
        {data.ads.map((ad, index) => (
          <AdCard key={ad.id} ad={ad} mine={mine} priority={index === 0} />
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

// Memoize to prevent unnecessary re-renders
export default memo(AdsView);
