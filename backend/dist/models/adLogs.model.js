import { DataTypes, Model } from "sequelize";
import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
class AdLogs extends Model {
}
AdLogs.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(16),
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.ENUM("delete", "update", "create"),
        allowNull: false,
    },
}, { sequelize, schema: "public", tableName: "adLogs", timestamps: true });
export default AdLogs;
//# sourceMappingURL=adLogs.model.js.map