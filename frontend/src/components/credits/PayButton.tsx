"use client";
import useBuyCredits from "@/hooks/credits/buyCredits";

export default function PayButton({
  discount,
  planId,
}: {
  discount: { percentage: number } | undefined;
  planId: number;
}) {
  const { mutate: buyCredits, isPending } = useBuyCredits();
  return (
    <button
      onClick={() => buyCredits(planId)}
      className={`btn btn-lg w-full ${
        discount ? "btn-warning text-warning-content font-bold" : "btn-primary"
      }`}
      disabled={isPending}
    >
      {discount ? "🔥 اشترِ الآن وفّر!" : "اشترِ الآن"}
    </button>
  );
}
