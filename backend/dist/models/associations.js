import User from "./user.model.js";
import Transaction from "./transaction.model.js";
import Review from "./review.model.js";
import AdLogs from "./adLogs.model.js";
import Ad from "./ad.model.js";
import CreditsPlan from "./creditsPlan.js";
//ad model
Ad.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Ad, { foreignKey: "userId", as: "ads" });
//review model
Review.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId" });
Review.belongsTo(User, { as: "reviewedUser", foreignKey: "reviewedUserId" });
User.hasMany(Review, { as: "givenReviews", foreignKey: "reviewerId" });
User.hasMany(Review, { as: "receivedReviews", foreignKey: "reviewedUserId" });
//transaction model
User.hasMany(Transaction, { as: "transactions", foreignKey: "userId" });
Transaction.belongsTo(User, { as: "user", foreignKey: "userId" });
Transaction.belongsTo(Ad, { as: "ad", foreignKey: "adId" });
//adLogs model
AdLogs.belongsTo(User, { as: "user", foreignKey: "userId" });
AdLogs.belongsTo(Ad, { as: "ad", foreignKey: "adId" });
Ad.hasMany(AdLogs, { foreignKey: "adId", onDelete: "CASCADE" });
export { User, Ad, AdLogs, Transaction, CreditsPlan, Review };
//# sourceMappingURL=associations.js.map