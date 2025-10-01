import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import { DataTypes, Model } from "sequelize";
class EventInstance extends Model {
}
EventInstance.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: nanoid(16),
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    session_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    page_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    event_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    event_value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    schema: "public",
    modelName: "Event",
    timestamps: true,
});
//# sourceMappingURL=event.route.js.map