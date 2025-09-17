"use client";
import { mockAds } from "@/lib/mockData";
import AdCard from "./AdCard";

export default function Adviews() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockAds.map((ad, i) => (
        <AdCard key={i} ad={ad} />
      ))}
    </div>
  );
}
