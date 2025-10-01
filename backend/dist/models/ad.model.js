import { DataTypes, Model } from "sequelize";
import { CITIES, AREAS, PROPERTY_TYPES } from "../db/data.js";
import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
class Ad extends Model {
    toJSON() {
        const values = { ...this.get() };
        delete values.userId;
        delete values.costInCredits;
        delete values.isDeleted;
        if (this.user) {
            const { slug, name, avatar, avgRating, totalReviews } = this.user;
            values.user = { slug, name, avatar, avgRating, totalReviews };
        }
        return values;
    }
}
Ad.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: () => nanoid(16),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.ENUM(...CITIES),
        allowNull: false,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [AREAS] },
    },
    rooms: { type: DataTypes.INTEGER },
    space: { type: DataTypes.INTEGER, allowNull: false },
    propertyType: {
        type: DataTypes.ENUM(...PROPERTY_TYPES),
        allowNull: false,
    },
    address: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("تمليك", "إيجار"), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    images: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        defaultValue: [],
    },
    price: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    whatsappNumber: { type: DataTypes.STRING, allowNull: false },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    whatsappClicksCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    costInCredits: { type: DataTypes.INTEGER, defaultValue: 1 },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    slug: { type: DataTypes.STRING, allowNull: false },
}, {
    sequelize,
    schema: "public",
    tableName: "ads",
    timestamps: true,
    indexes: [{ fields: ["city", "area"] }, { fields: ["type"] }],
});
Ad.beforeValidate((ad) => {
    if (!ad.slug) {
        const parts = [
            ad.title,
            ad.propertyType,
            ad.city,
            ad.area,
            ad.rooms ? `${ad.rooms}غ` : null,
            ad.space ? `${ad.space}م` : null,
        ].filter((x) => Boolean(x));
        // Clean each part: trim, normalize, replace spaces, remove special chars
        const cleanedParts = parts.map((p) => p
            .trim()
            .normalize("NFKD")
            .replace(/\s+/g, "-")
            .replace(/[^\p{L}\p{N}-]/gu, ""));
        const baseSlug = cleanedParts.join("-");
        ad.slug = `${baseSlug}-${nanoid(10)}`;
    }
});
export default Ad;
//# sourceMappingURL=ad.model.js.map