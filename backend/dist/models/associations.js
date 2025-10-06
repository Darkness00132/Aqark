import User from "./user.model.js";
import CreditsLogs from "./creditsLog.model.js";
import Review from "./review.model.js";
import AdLogs from "./adLogs.model.js";
import Ad from "./ad.model.js";
import CreditsPlan from "./creditsPlan.js";
import Transaction from "./Transaction.model.js";
//ad model
Ad.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Ad, { foreignKey: "userId", as: "ads" });
//review model
Review.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId" });
Review.belongsTo(User, { as: "reviewedUser", foreignKey: "reviewedUserId" });
User.hasMany(Review, { as: "givenReviews", foreignKey: "reviewerId" });
User.hasMany(Review, { as: "receivedReviews", foreignKey: "reviewedUserId" });
//transaction model
User.hasMany(CreditsLogs, { as: "creditLogs", foreignKey: "userId" });
CreditsLogs.belongsTo(User, { as: "user", foreignKey: "userId" });
CreditsLogs.belongsTo(Ad, { as: "ad", foreignKey: "adId" });
//adLogs model
AdLogs.belongsTo(User, { as: "user", foreignKey: "userId" });
AdLogs.belongsTo(Ad, { as: "ad", foreignKey: "adId" });
Ad.hasMany(AdLogs, { foreignKey: "adId", onDelete: "CASCADE" });
Ad.hasMany(CreditsLogs, { as: "creditLogs", foreignKey: "adId" });
//credits plan model
CreditsPlan.belongsTo(User, { as: "user", foreignKey: "userId" });
//transaction model
Transaction.belongsTo(User, { as: "user", foreignKey: "userId" });
Transaction.belongsTo(CreditsPlan, { as: "plan", foreignKey: "planId" });
User.hasMany(Transaction, { as: "transactions", foreignKey: "userId" });
CreditsLogs.belongsTo(Transaction, {
    as: "transaction",
    foreignKey: "transactionId",
});
export { User, Ad, AdLogs, CreditsLogs, Transaction, CreditsPlan, Review };
//# sourceMappingURL=associations.js.map