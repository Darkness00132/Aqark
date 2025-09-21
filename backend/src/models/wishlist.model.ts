import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sql.js";
import { nanoid } from "nanoid";

interface WishlistAttributes {
  id?: string;
  userId: string;
  AdId: string;
}

class Wishlist extends Model<WishlistAttributes> implements WishlistAttributes {
  declare id?: string;
  declare userId: string;
  declare AdId: string;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => nanoid(),
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AdId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
  }
);

export default Wishlist;
