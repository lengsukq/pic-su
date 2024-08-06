import { Sequelize } from 'sequelize';
import pg from 'pg';

const dbConfig = {
    username: process.env.DB_USER,   // 用户名
    host: process.env.DB_HOST,      // 数据库服务器IP
    password: process.env.DB_PASSWORD,     // 数据库密码
    database: process.env.DB_NAME,      // 数据库名
};

if (!dbConfig.username || !dbConfig.host || !dbConfig.password || !dbConfig.database) {
    throw new Error('Missing database configuration environment variables');
}

const pgsqlUrl = `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;
const sequelize = new Sequelize(pgsqlUrl, {
    dialect: 'postgres',
    dialectModule: pg
}); // Postgres 示例

export async function connect() {
    console.log(pgsqlUrl)

    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

export { sequelize };