const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');
const pg = require("pg");
const path = require('path');
const initModels = require('../models/init-models'); // 引入初始化模型的函数

// 加载环境变量
const dotenvPath = path.resolve(__dirname, '../.env.local');
const result = dotenv.config({ path: dotenvPath });

if (result.error) {
    throw result.error;
}

const env = result.parsed;

const dbConfig = {
    username: env.DB_USER,   // 用户名
    host: env.DB_HOST,      // 数据库服务器IP
    password: env.DB_PASSWORD,     // 数据库密码
    database: env.DB_NAME,      // 数据库名
    port: process.env.DB_PORT || 5432,    // 数据库端口，默认为5432
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
        // 定义需要同步的模型名称
        const modelNames = ['users','albums','images','tokens' ];

        // 使用循环同步所有模型
        for (const modelName of modelNames) {
            if (models[modelName]) {
                await models[modelName].sync({ alter: true }); //这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
                console.log(`Model ${modelName} has been synchronized.`);
            } else {
                console.error(`Model ${modelName} is not defined.`);
            }
        }

        console.log('Database & tables created!');

    } catch (error) {
        console.error('Database connection and synchronization failed:', error);
    }
}

initializeDatabase();
