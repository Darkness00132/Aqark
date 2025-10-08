import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
class Transaction extends Model {
}
Transaction.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: nanoid(16),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    planId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cardLast4: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gatewayFee: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("purchase", "refund"),
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    paymentStatus: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
    },
}, {
    sequelize,
    schema: "public",
    modelName: "transactions",
    timestamps: true,
});
export default Transaction;
//# sourceMappingURL=Transaction.model.js.map