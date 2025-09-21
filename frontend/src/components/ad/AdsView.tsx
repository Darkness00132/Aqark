"use client";
import AdCard from "./AdCard";
import useGetAds from "@/hooks/ad/useGetAds";

export default function Adviews({ mine = false }: { mine?: boolean }) {
  const { data, isFetching } = useGetAds(mine);

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots w-20"></span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-center text-3xl py-10">لا توجد إعلانات</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data?.map((ad) => (
        <AdCard key={ad.slug} ad={ad} mine={mine} />
      ))}
    </div>
  );
}
