"use client";
import StatusCard from "@/components/dashboard/StatusCard";
import UsersGrowthChart from "@/components/dashboard/UsersGrowthChart";
import useStatus from "@/hooks/useStatus";
import { FaUsers, FaBuilding, FaCoins, FaDollarSign } from "react-icons/fa";

export default function Home() {
  const { data, isFetching } = useStatus();

  const {
    ads = 0,
    userCount = 0,
    totalCreditsBought = 0,
    totalRevenue = 0,
    users = [],
  } = data || {};

  if (isFetching)
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots w-20"></span>
      </div>
    );

  return (
    <>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard icon={<FaUsers />} title="Users" value={userCount} />
        <StatusCard icon={<FaBuilding />} title="Ads" value={ads} />
        <StatusCard
          icon={<FaDollarSign />}
          title="Earnings"
          value={totalCreditsBought}
        />
        <StatusCard
          icon={<FaCoins />}
          title="Bought Credits"
          value={totalRevenue}
        />
      </div>
      <div className="p-4">
        <UsersGrowthChart users={users} />
      </div>
    </>
  );
}
