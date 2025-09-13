import sequelize from '../db/sql';
import { DataTypes, Model } from 'sequelize';
import User from './user.model';
import customeNanoId from '../utils/customeNanoId';

interface TransactionAttributes {
  id?: string;
  userId: string;
  type: 'purchase' | 'spend' | 'refund';
  amount: number;
  credits: number;
}

class Transaction
  extends Model<TransactionAttributes>
  implements TransactionAttributes
{
  declare id?: string;
  declare userId: string;
  declare type: 'purchase' | 'spend' | 'refund';
  declare amount: number;
  declare credits: number;
}

Transaction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => customeNanoId(25),
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('purchase', 'spend', 'refund'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    credits: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  { sequelize, schema: 'public', modelName: 'transaction', timestamps: true },
);

User.hasMany(Transaction, { as: 'transactions', foreignKey: 'userId' });
Transaction.belongsTo(User, { as: 'user', foreignKey: 'userId' });

export default Transaction;
