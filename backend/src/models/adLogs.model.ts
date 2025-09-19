import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";

interface adLogsAttributes {
  id?: string;
  userId: string;
  adId: string;
  action: "delete" | "update" | "create";
  description?: string;
}

class AdLogs extends Model<adLogsAttributes> implements adLogsAttributes {
  declare id?: string;
  declare userId: string;
  declare adId: string;
  declare action: "delete" | "update" | "create";
  declare description?: string;
}

AdLogs.init(
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
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("delete", "update", "create"),
      allowNull: false,
    },
    description: { type: DataTypes.TEXT },
  },
  { sequelize, schema: "public", tableName: "adLogs", timestamps: true }
);

export default AdLogs;
