import {
  FaChartLine,
  FaCoins,
  FaEdit,
  FaGift,
  FaTrash,
  FaPercent,
} from "react-icons/fa";
import { type Plan } from "@/app/credits/page";
import useDeleteCreditsPlan from "@/hooks/credits/useDeleteCreditsPlan";

export default function CreditsPlans({ plans }: { plans: Plan[] }) {
  const { mutate } = useDeleteCreditsPlan();

  function handelDeletePlan(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan?"
    );
    if (confirmed) mutate(id);
  }
  if (!plans?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const hasBonus = !!plan.bonus;
        const hasDiscount = plan.discount && plan.discount > 0;

        // Calculate discounted price
        const finalPrice = hasDiscount
          ? plan.price - plan.price * ((plan.discount ?? 0) / 100)
          : plan.price;

        const totalCredits = plan.credits + (plan.bonus || 0);
        const costPerCredit = (finalPrice / totalCredits).toFixed(2);

        return (
          <div
            key={plan.id}
            className="relative rounded-2xl border border-secondary bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-md transition-all duration-300 "
          >
            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 rounded-md bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium shadow-sm flex items-center gap-1">
                <FaPercent className="text-yellow-600" />-{plan.discount}%
              </div>
            )}

            {/* Bonus badge */}
            {hasBonus && (
              <div className="absolute top-4 right-4 flex items-center gap-1 rounded-md bg-green-100 text-green-800 px-2 py-1 text-xs font-medium shadow-sm">
                <FaGift className="text-green-600" /> +{plan.bonus}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white">
                <FaCoins className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Credits</p>
                <p className="text-2xl font-bold">{plan.credits}</p>
              </div>
            </div>

            {/* Bonus info */}
            {hasBonus && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 mb-4 text-sm">
                <div className="flex items-center gap-2 font-medium text-green-700 dark:text-green-300">
                  <FaGift className="text-green-500" /> Total with bonus:
                </div>
                <div className="text-gray-800 dark:text-gray-100 font-semibold">
                  {totalCredits} credits
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2 mb-4">
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg line-through text-gray-400">
                    {plan.price}
                  </span>
                  <span className="text-3xl font-semibold text-blue-600">
                    {finalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">EGP</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-blue-600">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500">EGP</span>
                </div>
              )}

              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <FaChartLine className="text-blue-500" />
                {costPerCredit} EGP / credit
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button className="flex items-center gap-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1.5 transition">
                <FaEdit /> Edit
              </button>
              <button
                className="flex items-center gap-1 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-sm font-medium px-3 py-1.5 transition"
                onClick={() => handelDeletePlan(plan.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
