import User from "./user.model.js";
import CreditsLog from "./creditsLog.model.js";
import Review from "./review.model.js";
import AdLogs from "./adLogs.model.js";
import Ad from "./ad.model.js";
import Transaction from "./transaction.model.js";
import CreditsPlan from "./creditsPlan.model.js";
import PlanDiscount from "./planDiscount.model.js";

//ad model
Ad.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Ad, { foreignKey: "userId", as: "ads" });

//review model
Review.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId" });
Review.belongsTo(User, { as: "reviewedUser", foreignKey: "reviewedUserId" });

User.hasMany(Review, { as: "givenReviews", foreignKey: "reviewerId" });
User.hasMany(Review, { as: "receivedReviews", foreignKey: "reviewedUserId" });

//transaction model
User.hasMany(CreditsLog, { as: "creditLogs", foreignKey: "userId" });
CreditsLog.belongsTo(User, { as: "user", foreignKey: "userId" });
CreditsLog.belongsTo(Ad, { as: "ad", foreignKey: "adId" });

//adLogs model
AdLogs.belongsTo(User, { as: "user", foreignKey: "userId" });
AdLogs.belongsTo(Ad, { as: "ad", foreignKey: "adId" });
Ad.hasMany(AdLogs, { foreignKey: "adId", onDelete: "CASCADE" });
Ad.hasMany(CreditsLog, { as: "creditLogs", foreignKey: "adId" });

//credits plan model
CreditsPlan.belongsTo(User, { as: "user", foreignKey: "userId" });

//transaction model
Transaction.belongsTo(User, { as: "user", foreignKey: "userId" });
Transaction.belongsTo(CreditsPlan, { as: "plan", foreignKey: "planId" });
User.hasMany(Transaction, { as: "transactions", foreignKey: "userId" });
CreditsLog.belongsTo(Transaction, {
  as: "transaction",
  foreignKey: "transactionId",
});

//plan model
CreditsPlan.hasMany(PlanDiscount, { foreignKey: "planId", as: "discounts" });
PlanDiscount.belongsTo(CreditsPlan, { foreignKey: "planId", as: "plan" });

export {
  User,
  Ad,
  AdLogs,
  CreditsLog,
  Transaction,
  CreditsPlan,
  PlanDiscount,
  Review,
};
