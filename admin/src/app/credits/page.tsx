"use client";
import CreatePlanForm from "@/components/credits/CreatePlan";
import CreditsPlans from "@/components/credits/CreditsPlans";
import useGetCreditsPlans from "@/hooks/credits/useGetCreditsPlans";
import { FaCoins, FaGift, FaTag } from "react-icons/fa";

export interface Plan {
  id: string;
  credits: number;
  price: number;
  bonus?: number;
  discount?: number;
}

export default function Credits() {
  const { data: plans } = useGetCreditsPlans();

  return (
    <div className="px-6 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-content text-primary p-4 rounded-full">
            <FaCoins className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Credits Management</h1>
            <p className="opacity-90 mt-1 text-sm sm:text-base">
              Manage your credit plans, pricing, and bonus offers if you are
            </p>
          </div>
        </div>
      </div>

      {Array.isArray(plans) && plans.length > 0 && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold opacity-70">
                    Total Plans
                  </h3>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {plans.length}
                  </p>
                  <p className="text-sm opacity-60 mt-1">
                    Active credit packages
                  </p>
                </div>
                <FaCoins className="text-4xl text-primary opacity-80" />
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold opacity-70">
                    Price Range
                  </h3>
                  <p className="text-3xl font-bold text-secondary mt-1">
                    {Math.min(...plans?.map((p) => p.price))} -{" "}
                    {Math.max(...plans?.map((p) => p.price))}
                  </p>
                  <p className="text-sm opacity-60 mt-1">EGP</p>
                </div>
                <FaTag className="text-4xl text-secondary opacity-80" />
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold opacity-70">
                    Bonus Plans
                  </h3>
                  <p className="text-3xl font-bold text-accent mt-1">
                    {plans?.filter((p) => p.bonus).length}
                  </p>
                  <p className="text-sm opacity-60 mt-1">Plans with bonuses</p>
                </div>
                <FaGift className="text-4xl text-accent opacity-80" />
              </div>
            </div>
          </div>

          {/* Existing Plans */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Available Plans</h2>
              <p className="text-sm opacity-70">
                Review, edit, or remove existing credit packages
              </p>
            </div>
            <CreditsPlans plans={plans} />
          </section>
        </>
      )}

      {/* New Plan Form */}
      <section>
        <CreatePlanForm />
      </section>
    </div>
  );
}
