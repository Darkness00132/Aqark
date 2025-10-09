import CreditsPlans from "@/components/credits/CreditsPlans";
export default function Credits() {
  const plans = [
    { id: 1, credits: 100, price: 100 },
    { id: 2, credits: 200, price: 250, bonus: 50 },
    { id: 3, credits: 500, price: 600, bonus: 100 },
    { id: 4, credits: 1000, price: 1100, bonus: 200 },
  ];
  return (
    <div>
      <CreditsPlans plans={plans} />
    </div>
  );
}
