import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";

interface CreditsPlanAttributes {
  id?: string;
  userId?: string;
  credits: number;
  price: number;
  name: string;
  bonus: number;
}

class CreditsPlan
  extends Model<CreditsPlanAttributes>
  implements CreditsPlanAttributes
{
  declare id?: string;
  declare userId?: string;
  declare credits: number;
  declare price: number;
  declare name: string;
  declare bonus: number;
}

CreditsPlan.init(
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
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bonus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, schema: "public", modelName: "credits_plans", timestamps: true }
);

export default CreditsPlan;
