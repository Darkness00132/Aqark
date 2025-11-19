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
        type: DataTypes.SMALLINT,
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
    gatewayfee: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("purchase", "refund"),
        allowNull: false,
    },
    totalCredits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    finalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discount: {
        type: DataTypes.SMALLINT,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
    },
    paymentStatus: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
    },
    netRevenue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize,
    schema: "public",
    modelName: "transactions",
    timestamps: true,
});
export default Transaction;
//# sourceMappingURL=transaction.model.js.map