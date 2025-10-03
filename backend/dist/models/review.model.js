import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";
class Review extends Model {
    toJSON() {
        return {
            id: this.id,
            rating: this.rating,
            comment: this.comment,
        };
    }
}
Review.init({
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
        allowNull: true,
    },
    loves: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize,
    schema: "public",
    tableName: "reviews",
    timestamps: true,
    indexes: [{ unique: true, fields: ["reviewerId", "reviewedUserId"] }],
});
export default Review;
//# sourceMappingURL=review.model.js.map