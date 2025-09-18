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
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
if (!global.sequelize)
    global.sequelize = sequelize;
export default sequelize;
//# sourceMappingURL=sql.js.map