import sequelize from '../db/sql';
import { DataTypes, Model } from 'sequelize';
import User from './user.model';
import customeNanoId from '../utils/customeNanoId';
class Transaction extends Model {
}
Transaction.init({
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
}, { sequelize, schema: 'public', modelName: 'transaction', timestamps: true });
User.hasMany(Transaction, { as: 'transactions', foreignKey: 'userId' });
Transaction.belongsTo(User, { as: 'user', foreignKey: 'userId' });
export default Transaction;
//# sourceMappingURL=transaction.model.js.map