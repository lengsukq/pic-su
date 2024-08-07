import { Sequelize,DataTypes } from 'sequelize';
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
    dialectModule: pg,
    define: {
        underscored: true
    }
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
export async function executeQuery(text: string, params?: any[]) {
    try {
        const start = Date.now();

        // 使用Sequelize执行原生SQL查询
        const result:any = await sequelize.query(text, {
            replacements: params,
        });

        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: result.length });
        // console.log('result---',result)
        return result ;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}
import initModels from '@/models/init-models';
// 初始化模型
const models = initModels(sequelize);

// 现在你可以使用 models 对象来访问你的模型
const { albums, images, tokens, users } = models;
export { sequelize,albums, images, tokens, users };