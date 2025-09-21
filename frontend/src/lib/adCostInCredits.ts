export default function adCostInCredits({
  type,
  price,
}: {
  type: "ايجار" | "تمليك";
  price: number;
}) {
  let cost = 0;
  if (type === "ايجار") {
    cost += 1;
    if (price >= 10000) {
      cost += 1;
    }
    if (price >= 20000) {
      cost += 1;
    }
  } else {
    cost += 2;
    if (price >= 5000000) {
      cost += 2;
    }
    if (price >= 10000000) {
      cost += 2;
    }
  }
  return cost;
}
