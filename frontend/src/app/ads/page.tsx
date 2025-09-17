import AdFilters from "@/components/ad/AdFilters";
import AdsView from "@/components/ad/AdsView";

export default function Ad() {
  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <AdFilters />
      </div>
      <AdsView />
    </div>
  );
}
