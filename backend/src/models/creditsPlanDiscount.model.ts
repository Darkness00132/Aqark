import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sql.js";

interface PlanDiscountAttributes {
  id: number;
  userId: number;
  planId: number;
  percentage: number;
  startsAt: Date;
  endsAt: Date;
  isDeleted?: boolean;
}

class PlanDiscount extends Model<PlanDiscountAttributes> {
  declare id: number;
  declare userId: string;
  declare planId: number;
  declare percentage: number;
  declare startsAt: Date;
  declare endsAt: Date;
  declare isDeleted?: boolean;
}

PlanDiscount.init(
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
    planId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    percentage: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, schema: "public", modelName: "plan_discount", timestamps: true }
);

export default PlanDiscount;
