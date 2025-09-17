import { DataTypes, Model } from "sequelize";
import { CITIES, AREAS, PROPERTY_TYPES } from "../db/data.js";
import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import slugify from "slugify";
class Ad extends Model {
    toJSON() {
        const { userId, id, ...values } = this.get({ plain: true });
        return values;
    }
}
Ad.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: () => nanoid(16),
        primaryKey: true,
    },
    publicId: {
        type: DataTypes.STRING,
        defaultValue: () => nanoid(12),
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
        validate: {
            isIn: [AREAS],
        },
    },
    rooms: {
        type: DataTypes.INTEGER,
    },
    space: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    propertyType: {
        type: DataTypes.ENUM(...PROPERTY_TYPES),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("تمليك", "إيجار"),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        defaultValue: [],
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
    },
    whatsappNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    viewsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    whatsappClicksCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    costInCredits: { type: DataTypes.INTEGER, defaultValue: 1 },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    schema: "public",
    tableName: "ads",
    timestamps: true,
    indexes: [{ fields: ["city", "area"] }, { fields: ["type"] }],
});
Ad.beforeSave((ad) => {
    const base = `${ad.propertyType}-${ad.city}-${ad.area}`;
    ad.slug = `${slugify(base, { lower: true, strict: true })}-${ad.publicId}`;
});
export default Ad;
//# sourceMappingURL=ad.model.js.map