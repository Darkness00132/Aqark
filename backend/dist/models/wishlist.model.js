import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sql.js";
import { nanoid } from "nanoid";
class Wishlist extends Model {
}
Wishlist.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => nanoid(),
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    AdId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Wishlist",
});
export default Wishlist;
//# sourceMappingURL=wishlist.model.js.map