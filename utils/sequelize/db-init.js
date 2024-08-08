const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');
const pg = require("pg");
const path = require('path');
const initModels = require('../../models/init-models'); // 引入初始化模型的函数

// 加载环境变量
const dotenvPath = path.resolve(__dirname, '../../.env.local');
const result = dotenv.config({ path: dotenvPath });

if (result.error) {
    throw result.error;
}

const env = result.parsed;

const dbConfig = {
    username: env.DB_USER || process.env.DB_USER,   // 用户名
    host: env.DB_HOST || process.env.DB_HOST,      // 数据库服务器IP
    password: env.DB_PASSWORD || process.env.DB_PASSWORD,     // 数据库密码
    database: env.DB_NAME || process.env.DB_NAME,      // 数据库名
    port: process.env.DB_PORT || env.DB_PORT || 5432,    // 数据库端口，默认为5432
};

console.log('Database configuration:', dbConfig);

if (!dbConfig.username || !dbConfig.host || !dbConfig.password || !dbConfig.database) {
    throw new Error('Missing database configuration environment variables');
}

const pgsqlUrl = `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

async function initializeDatabase() {
    try {
        const sequelize = new Sequelize(pgsqlUrl, {
            dialect: 'postgres',
            dialectModule: pg,
        });

        // 初始化模型
        const models = initModels(sequelize);
        // 同步所有模型，优先同步users表
        await models.users.sync({ alter: true });
        await sequelize.sync({ force: false });
        console.log('Database & tables created!');

    } catch (error) {
        console.error('Database connection and synchronization failed:', error);
    }
}

initializeDatabase();
