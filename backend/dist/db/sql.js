import { Sequelize } from "sequelize";
await import("pg");
// Only create a new instance if it doesn’t already exist
const sequelize = global.sequelize ??
    new Sequelize(process.env.SQL_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
        benchmark: false,
        pool: {
            max: 20,
            min: 5,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true,
        },
    });
if (!global.sequelize)
    global.sequelize = sequelize;
export default sequelize;
//# sourceMappingURL=sql.js.map