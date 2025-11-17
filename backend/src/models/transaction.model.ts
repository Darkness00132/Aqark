import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";

interface TransactionAttributes {
  id?: string;
  userId: string;
  planId: string;
  paymentId: string;
  cardLast4?: string;
  type: "purchase" | "refund";
  credits: number;
  price: number;
  description?: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  gatewayfee: number;
}

class Transaction extends Model<TransactionAttributes> {
  declare id?: string;
  declare userId: string;
  declare planId: string;
  declare paymentId: string;
  declare cardLast4?: string;
  declare paymentStatus: "pending" | "completed" | "failed";
  declare paymentMethod: string;
  declare type: "purchase" | "refund";
  declare credits: number;
  declare price: number;
  declare description?: string;
  declare gatewayfee: number;
}

Transaction.init(
  {
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
  },
  {
    sequelize,
    schema: "public",
    modelName: "transactions",
    timestamps: true,
  }
);

export default Transaction;
