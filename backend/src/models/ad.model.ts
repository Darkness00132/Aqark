import { DataTypes, Model } from 'sequelize';
import { ulid } from 'ulid';
import { CITIES, AREAS, PROPERTY_TYPES } from '../db/data.js';
import sequelize from '../db/sql.js';
import User from './user.model.js';
import customeNanoId from '../utils/customeNanoId.js';

interface AdAttributes {
  id?: string;
  publicId?: bigint;
  userId: string;
  title: string;
  city: string;
  area: string;
  rooms: number;
  space: number;
  propertyType: string;
  address: string;
  type: string;
  description: string;
  images?: any[];
  price: number;
  whatsappNumber: string;
  viewsCount?: number;
  whatsappClicksCount?: number;
  costInCredits?: number;
}

interface AdMethods {
  toJSON: () => Record<string, any>;
}

class Ad extends Model<AdAttributes> implements AdAttributes, AdMethods {
  declare id?: string;
  declare publicId?: bigint;
  declare userId: string;
  declare title: string;
  declare city: string;
  declare area: string;
  declare rooms: number;
  declare space: number;
  declare propertyType: string;
  declare address: string;
  declare type: string;
  declare description: string;
  declare images?: any[];
  declare price: number;
  declare whatsappNumber: string;
  declare viewsCount?: number;
  declare whatsappClicksCount?: number;
  declare costInCredits?: number;

  public toJSON() {
    const { userId, id, ...values } = this.get({ plain: true });
    return values;
  }
}

Ad.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => ulid(),
      primaryKey: true,
    },
    publicId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: () => customeNanoId(12),
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
      type: DataTypes.ENUM(...AREAS),
      allowNull: false,
    },
    rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.ENUM('تمليك', 'إيجار'),
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
  },
  {
    sequelize,
    schema: 'public',
    tableName: 'ads',
    timestamps: true,
    indexes: [{ fields: ['city', 'area'] }, { fields: ['type'] }],
  },
);

Ad.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Ad, { foreignKey: 'userId', as: 'ads' });

export default Ad;
