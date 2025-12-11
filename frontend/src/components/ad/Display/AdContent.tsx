"use client";
import type { Ad } from "@/store/useAd";
import AdImagesSwiper from "./AdImagesSwiper";
import AdMainInfo from "./AdMainInfo";
import AdDescription from "./AdDescription";
import AdUserSidebar from "./AdUserSidebar";

export default function AdContent({ ad }: { ad: Ad }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <AdImagesSwiper images={ad.images} alt={ad.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AdMainInfo ad={ad} />
            <AdDescription description={ad.description} />
          </div>

          <AdUserSidebar user={ad.user} createdAt={ad.createdAt} />
        </div>
      </div>
    </div>
  );
}
