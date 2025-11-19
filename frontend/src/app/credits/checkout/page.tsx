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

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const planId = (await searchParams).planId;
  const plan = plans.find((p) => p.id === Number(planId));
  return <div>Checkout Page</div>;
}
