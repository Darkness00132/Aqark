import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";

interface TransactionAttributes {
  id?: string;
  userId: string;
  type: "purchase" | "spend" | "refund";
  description: string;
  planName?: string;
  amount?: number;
  adId?: string;
  credits: number;
}

class Transaction
  extends Model<TransactionAttributes>
  implements TransactionAttributes
{
  declare id?: string;
  declare publicId?: string;
  declare userId: string;
  declare adId?: string;
  declare type: "purchase" | "spend" | "refund";
  declare description: string;
  declare planName?: string;
  declare amount?: number;
  declare credits: number;
}

Transaction.init(
  {
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
  },
  { sequelize, schema: "public", modelName: "transaction", timestamps: true }
);

export default Transaction;
