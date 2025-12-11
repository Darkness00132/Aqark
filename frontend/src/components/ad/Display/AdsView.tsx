"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useMemo } from "react";
import AdCard from "./AdCard";
import AdCardsLoading from "./AdCardSkeleton";
import useGetAds from "@/hooks/ad/useGetAds";
import Pagination from "@/components/ad/Shared/Pagination";

interface AdsViewProps {
  mine?: boolean;
}

export default function AdsView({ mine = false }: AdsViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isFetching, isLoading } = useGetAds(mine, currentPage);

  // ⚠️ ADDED: Memoize ads to prevent unnecessary re-renders
  const ads = useMemo(() => data?.ads || [], [data?.ads]);

  const setCurrentPage = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`, { scroll: true });
    });
  };

  if (isLoading) {
    return <AdCardsLoading />;
  }

  if (ads.length === 0) {
    return (
      <div className="alert alert-info justify-center">
        <span>لا توجد إعلانات</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loading indicator */}
      {(isFetching || isPending) && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg rounded-full px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm" />
            <span className="text-sm">جاري التحميل...</span>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        style={{
          opacity: isPending ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {ads.map((ad, index) => (
          <AdCard key={ad.id} ad={ad} mine={mine} priority={index < 4} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages || 1}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
