import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.SQL_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
});
export default sequelize;
//# sourceMappingURL=sql.js.map