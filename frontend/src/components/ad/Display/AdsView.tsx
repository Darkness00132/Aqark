"use client";
import { useSearchParams, useRouter } from "next/navigation";
import AdCard from "./AdCard";
import AdCardsLoading from "./AdCardSkeleton";
import { useGetAds } from "@/hooks/ad";
import Pagination from "@/components/ad/Shared/Pagination";

interface AdsViewProps {
  mine?: boolean;
}

export default function AdsView({ mine = false }: AdsViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Use isLoading instead of isFetching!
  const { data, isFetching, isLoading } = useGetAds(mine, currentPage);

  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`); // Enable scroll to top
  };

  // Only show skeleton on INITIAL load, not on pagination
  if (isLoading) {
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
      {/* Show loading indicator without hiding content */}
      {isFetching && (
        <div className="flex justify-center py-2">
          <span className="loading loading-spinner loading-sm" />
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity ${
          isFetching ? "opacity-50" : ""
        }`}
      >
        {data.ads.map((ad, index) => (
          <AdCard key={ad.id} ad={ad} mine={mine} priority={index < 4} />
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
