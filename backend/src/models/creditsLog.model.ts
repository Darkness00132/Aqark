import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";

interface CreditsLogAttributes {
  id?: string;
  userId: string;
  transactionId?: string;
  adId?: string;
  type: "purchase" | "spend" | "refund" | "gift";
  description: string;
  credits: number;
}

class CreditsLog
  extends Model<CreditsLogAttributes>
  implements CreditsLogAttributes
{
  declare id?: string;
  declare userId: string;
  declare adId?: string;
  declare transactionId?: string;
  declare type: "purchase" | "spend" | "refund" | "gift";
  declare description: string;
  declare credits: number;
}

CreditsLog.init(
  {
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
  },
  {
    sequelize,
    modelName: "CreditsLog",
    tableName: "creditsLogs",
    timestamps: true,
    indexes: [{ fields: ["userId"] }],
  }
);

export default CreditsLog;
