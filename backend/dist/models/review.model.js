import sequelize from '../db/sql';
import { DataTypes, Model } from 'sequelize';
import User from './user.model';
import customeNanoId from '../utils/customeNanoId';
class Review extends Model {
    id;
    reviewerId;
    reviewedUserId;
    rating;
    comment;
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
        defaultValue: () => customeNanoId(12),
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
}, {
    sequelize,
    schema: 'public',
    tableName: 'reviews',
    timestamps: true,
    indexes: [{ unique: true, fields: ['reviewerId', 'reviewedUserId'] }],
});
Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' });
Review.belongsTo(User, { as: 'reviewedUser', foreignKey: 'reviewedUserId' });
User.hasMany(Review, { as: 'givenReviews', foreignKey: 'reviewerId' });
User.hasMany(Review, { as: 'receivedReviews', foreignKey: 'reviewedUserId' });
export default Review;
//# sourceMappingURL=review.model.js.map