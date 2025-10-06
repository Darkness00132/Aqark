export default function adCostInCredits({ type, price, }) {
    let cost = 0;
    if (type === "ايجار") {
        cost += 50;
        if (price >= 10000) {
            cost += 50;
        }
        if (price >= 20000) {
            cost += 50;
        }
    }
    else {
        cost += 100;
        if (price >= 5000000) {
            cost += 100;
        }
        if (price >= 10000000) {
            cost += 100;
        }
    }
    return cost;
}
//# sourceMappingURL=adCostInCredits.js.map