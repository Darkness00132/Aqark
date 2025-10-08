"use client";
import StatusCard from "@/components/dashboard/StatusCard";
import useStatus from "@/hooks/useStatus";
import { FaUsers, FaBuilding, FaCoins, FaDollarSign } from "react-icons/fa";

export default function Home() {
  const { data, isFetching } = useStatus();
  const {
    ads = 0,
    users = 0,
    totalCreditsBought = 0,
    totalRevenue = 0,
  } = data || {};

  if (isFetching) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard icon={<FaUsers />} title="Users" value={users} />
      <StatusCard icon={<FaBuilding />} title="Ads" value={ads} />
      <StatusCard
        icon={<FaDollarSign />}
        title="Earnings"
        value={totalCreditsBought}
      />
      <StatusCard
        icon={<FaCoins />}
        title="Bought Credits"
        value={"$" + totalRevenue}
      />
    </div>
  );
}
