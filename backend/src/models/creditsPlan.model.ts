import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";

interface CreditsPlanAttributes {
  id?: number;
  userId: string;
  credits: number;
  price: number;
  discount?: number;
  bonus?: number;
}
class CreditsPlan
  extends Model<CreditsPlanAttributes>
  implements CreditsPlanAttributes
{
  declare id?: number;
  declare userId: string;
  declare credits: number;
  declare price: number;
  declare discount?: number;
  declare bonus?: number;
}

CreditsPlan.init(
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
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
    bonus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { sequelize, schema: "public", modelName: "creditsPlans", timestamps: true }
);

export default CreditsPlan;
