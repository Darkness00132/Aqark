import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";

interface TransactionAttributes {
  id?: string;
  userId: string;
  planId: string;
  paymentId: string;
  paymobTransactionId?: string;
  cardLast4?: string;
  type: "purchase" | "refund";
  totalCredits: number;
  price: number;
  finalPrice: number;
  discount?: number;
  failureReason?: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod?: string;
  gatewayfee: number;
  netRevenue: number;
}

class Transaction extends Model<TransactionAttributes> {
  declare id?: string;
  declare userId: string;
  declare planId: string;
  declare paymentId: string;
  declare cardLast4?: string;
  declare paymentStatus: "pending" | "completed" | "failed";
  declare paymentMethod?: string;
  declare paymobTransactionId?: string;
  declare type: "purchase" | "refund";
  declare totalCredits: number;
  declare price: number;
  declare finalPrice: number;
  declare discount?: number;
  declare failureReason?: string;
  declare gatewayfee: number;
  declare netRevenue: number;
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
    paymobTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardLast4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
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
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
    },
    netRevenue: {
      type: DataTypes.FLOAT,
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
