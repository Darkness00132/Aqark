import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";

interface EventAttributes {
  id: string;
  user_id?: string;
  ip_address: string;
  session_id?: string;
  page_url: string;
  event_type: string;
  event_value: string;
}

class EventInstance extends Model<EventAttributes> implements EventAttributes {
  declare id: string;
  declare user_id?: string;
  declare ip_address: string;
  declare session_id?: string;
  declare page_url: string;
  declare event_type: string;
  declare event_value: string;
}

EventInstance.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: nanoid(16),
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    page_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    schema: "public",
    modelName: "Event",
    timestamps: true,
  }
);
