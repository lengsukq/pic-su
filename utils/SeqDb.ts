import { Sequelize } from 'sequelize';
import pg from 'pg';
import initModels from '@/models/init-models'; // 引入初始化模型的函数

const dbConfig = {
    username: process.env.DB_USER,   // 用户名
    host: process.env.DB_HOST,      // 数据库服务器IP
    password: process.env.DB_PASSWORD,     // 数据库密码
    database: process.env.DB_NAME,      // 数据库名
    port: process.env.DB_PORT || 5432,    // 数据库端口，默认为5432
};

if (!dbConfig.username || !dbConfig.host || !dbConfig.password || !dbConfig.database) {
    throw new Error('Missing database configuration environment variables');
}

const pgsqlUrl = `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
const sequelize = new Sequelize(pgsqlUrl, {
    dialect: 'postgres',
    dialectModule: pg,
    define: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: false,
        freezeTableName: true,
    }
}); // Postgres 示例

// 初始化模型
const models = initModels(sequelize);
const { albums, images, tokens, users } = models;

export async function connect() {

    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

export async function executeQuery(text: string, params?: any[]) {
    try {
        const start = Date.now();

        // 使用Sequelize执行原生SQL查询
        const result: any = await sequelize.query(text, {
            replacements: params,
        });

        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: result.length });
        // console.log('result---',result)
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

// 导出 sequelize 和模型
export { sequelize, albums, images, tokens, users };
