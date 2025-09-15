import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";

export interface ReviewAttributes {
  id?: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment: string;
  loves?: number;
}

class Review extends Model<ReviewAttributes> implements ReviewAttributes {
  declare id: string;
  declare reviewerId: string;
  declare reviewedUserId: string;
  declare rating: number;
  declare comment: string;
  declare loves?: number;

  public toJSON() {
    return {
      id: this.id,
      rating: this.rating,
      comment: this.comment,
    };
  }
}
Review.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => nanoid(16),
      primaryKey: true,
    },
    reviewerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewedUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    loves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    schema: "public",
    tableName: "reviews",
    timestamps: true,
    indexes: [{ unique: true, fields: ["reviewerId", "reviewedUserId"] }],
  }
);

export default Review;
