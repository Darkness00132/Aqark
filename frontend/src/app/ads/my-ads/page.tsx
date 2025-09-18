import AdFilters from "@/components/ad/AdFilters";
import AdsView from "@/components/ad/AdsView";

export default function MyAds() {
  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <AdFilters />
      </div>
      <AdsView mine />
    </div>
  );
}
