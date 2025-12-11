"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { AdCard, AdCardsLoading } from "./index";
import { useGetAds } from "@/hooks/ad";
import dynamic from "next/dynamic";

const Pagination = dynamic(() => import("@/components/ad/Shared/Pagination"));

interface AdsViewProps {
  mine?: boolean;
}

export default function AdsView({ mine = false }: AdsViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isFetching } = useGetAds(mine, currentPage);

  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

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
