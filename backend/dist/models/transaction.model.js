import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";
class Transaction extends Model {
}
Transaction.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(16),
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adId: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    planName: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM("purchase", "spend", "refund"),
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize, schema: "public", modelName: "transaction", timestamps: true });
export default Transaction;
//# sourceMappingURL=transaction.model.js.map