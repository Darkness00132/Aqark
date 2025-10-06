import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";
class CreditsLog extends Model {
}
CreditsLog.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(16),
    },
    userId: { type: DataTypes.STRING, allowNull: false },
    adId: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING, allowNull: false },
    transactionId: { type: DataTypes.STRING },
    type: {
        type: DataTypes.ENUM("purchase", "spend", "refund", "gift"),
        allowNull: false,
    },
    credits: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "CreditsLog",
    tableName: "credits_logs",
    timestamps: true,
    indexes: [{ fields: ["userId"] }],
});
export default CreditsLog;
//# sourceMappingURL=creditsLog.model.js.map