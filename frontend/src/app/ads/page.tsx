import AdFilters from "@/components/ad/Filters/AdFilters";
import AdsView from "@/components/ad/Display/AdsView";

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
