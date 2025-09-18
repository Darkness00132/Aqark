"use client";
import AdCard from "./AdCard";
import useGetAds from "@/hooks/ad/useGetAds";
import Loading from "@/app/loading";

export default function Adviews({ mine = false }: { mine?: boolean }) {
  const { data, isFetching, isLoading } = useGetAds(mine);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return <p className="text-center text-3xl py-10">لا توجد إعلانات</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((ad, i) => (
        <AdCard key={ad.slug} ad={ad} mine={mine} />
      ))}
    </div>
  );
}
