import StatusCard from "@/components/dashboard/StatusCard";
import { FaUsers, FaBuilding, FaCoins, FaDollarSign } from "react-icons/fa";

export default function Home() {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard icon={<FaUsers />} title="Users" value="1,245" />
      <StatusCard icon={<FaBuilding />} title="Ads" value="320" />
      <StatusCard icon={<FaDollarSign />} title="Earnings" value="$4,200" />
      <StatusCard icon={<FaCoins />} title="Bought Credits" value="890" />
    </div>
  );
}
