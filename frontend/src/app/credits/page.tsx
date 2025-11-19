import { FaClock, FaCheck, FaFire } from "react-icons/fa";
import formatDateFromNow from "@/lib/formatDateFromNow";
import Link from "next/link";

const plans = [
  { id: 1, credits: 20, price: 150, bonus: 0 },
  { id: 2, credits: 50, price: 350, bonus: 10 },
  { id: 3, credits: 100, price: 650, bonus: 20 },
  { id: 4, credits: 250, price: 1500, bonus: 60 },
];

const discounts = [
  {
    planId: 2,
    percentage: 15,
    startsAt: "2025-02-01T00:00:00Z",
    endsAt: "2026-02-10T00:00:00Z",
  },
  {
    planId: 3,
    percentage: 20,
    startsAt: "2025-02-03T00:00:00Z",
    endsAt: "2026-02-06T00:00:00Z",
  },
];

export default function Credits() {
  const now = new Date();

  const getActiveDiscount = (planId: number) =>
    discounts.find(
      (d) =>
        d.planId === planId &&
        new Date(d.startsAt) <= now &&
        new Date(d.endsAt) >= now
    );

  const calculatePrice = (
    original: number,
    discount: { percentage: number } | undefined
  ) =>
    discount ? original - (original * discount.percentage) / 100 : original;

  const formatEgp = (amount: number) =>
    `${amount.toLocaleString("ar-EG")} جنيه`;

  return (
    <div className="mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">اختر باقتك</h1>
        <p className="text-lg opacity-70">
          اختر الباقة المناسبة لك واحصل على رصيدك فوراً
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 sm:gap-7">
        {plans.map((plan) => {
          const discount = getActiveDiscount(plan.id);
          const finalPrice = calculatePrice(plan.price, discount);
          const totalCredits = plan.credits + plan.bonus;

          return (
            <div
              key={plan.id}
              className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-visible ${
                discount
                  ? "border-4 border-warning ring-4 ring-warning/30 scale-105"
                  : ""
              }`}
            >
              <div className="card-body">
                {/* Discount Badge */}
                {discount && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="badge badge-warning badge-lg gap-2 px-6 py-4 shadow-lg animate-pulse">
                      <FaFire className="text-orange-600" />
                      <span className="font-bold text-base">
                        خصم {discount.percentage}%
                      </span>
                    </div>
                  </div>
                )}

                <h2 className="card-title text-3xl font-bold justify-center mb-2 mt-4">
                  {plan.credits} رصيد
                </h2>

                {/* Bonus Badge */}
                {plan.bonus > 0 ? (
                  <div className="badge badge-success badge-lg gap-2 mb-4 mx-auto">
                    <FaCheck className="text-xs" />+{plan.bonus} بونص
                  </div>
                ) : (
                  <div className="badge badge-ghost badge-lg mb-4 mx-auto">
                    بدون بونص
                  </div>
                )}

                {/* Pricing */}
                <div className="my-6 text-center">
                  {discount ? (
                    <div className="space-y-2">
                      <div className="text-xl line-through opacity-50">
                        {formatEgp(plan.price)}
                      </div>
                      <div className="text-5xl font-bold text-warning">
                        {formatEgp(finalPrice)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm bg-warning/20 text-warning-content px-4 py-2 rounded-lg mt-3 border border-warning/40">
                        <FaClock />
                        <span className="font-semibold">
                          ينتهي {formatDateFromNow(discount.endsAt)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-5xl font-bold">
                      {formatEgp(plan.price)}
                    </div>
                  )}
                </div>

                <div className="divider my-2"></div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="text-success" />
                    <span>إجمالي {totalCredits} رصيد</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="text-success" />
                    <span>يضاف فوراً</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="text-success" />
                    <span>لا ينتهي أبداً</span>
                  </div>
                </div>

                <Link
                  href={`/credits/checkout?planId=${plan.id}`}
                  className={`btn btn-lg w-full ${
                    discount
                      ? "btn-warning text-warning-content font-bold"
                      : "btn-primary"
                  }`}
                >
                  {discount ? "🔥 اشترِ الآن وفّر!" : "اشترِ الآن"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
