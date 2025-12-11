import AdsView from "@/components/ad/Display/AdsView";
import AdFilters from "@/components/ad/Filters/AdFilters";
import { Metadata } from "next";

export const metadata: Metadata = {};

export const revalidate = 60;

export default function Ads() {
  return (
    <div className="min-h-screen px-4">
      <div className="mb-4">
        <AdFilters />
      </div>
      <AdsView />
    </div>
  );
}
