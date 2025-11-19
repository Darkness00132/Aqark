import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
class CreditsPlan extends Model {
}
CreditsPlan.init({
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bonus: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, { sequelize, schema: "public", modelName: "creditsPlans", timestamps: true });
export default CreditsPlan;
//# sourceMappingURL=creditsPlan.model.js.map