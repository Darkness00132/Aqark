import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sql.js";
import { nanoid } from "nanoid";

interface WishlistAttributes {
  id?: string;
  userId: string;
  adId: string;
}

class Wishlist extends Model<WishlistAttributes> implements WishlistAttributes {
  declare id?: string;
  declare userId: string;
  declare adId: string;
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
    adId: {
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
