import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sql.js";
class PlanDiscount extends Model {
}
PlanDiscount.init({
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    planId: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    percentage: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    startsAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endsAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, { sequelize, schema: "public", modelName: "plan_discount", timestamps: true });
export default PlanDiscount;
//# sourceMappingURL=creditsPlanDiscount.model.js.map