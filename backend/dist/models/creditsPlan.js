import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";
class CreditsPlan extends Model {
}
CreditsPlan.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(16),
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bonus: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize, schema: "public", modelName: "creditsPlans", timestamps: false });
export default CreditsPlan;
//# sourceMappingURL=creditsPlan.js.map