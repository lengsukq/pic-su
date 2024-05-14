// db.ts
import { Pool } from 'pg';
interface Config {
    user: string;
    host: string;
    database: string;
    password: string;
    port?: number;
}

let configs: Config = {
    user: process.env.DB_USER as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_NAME as string,
    password: process.env.DB_PASSWORD as string,
};
// 如果process.env.DB_PORT存在则使用process.env.DB_PORT，否则使用默认值5432
if (process.env.DB_PORT) configs={...configs, port: parseInt(process.env.DB_PORT, 10)};
// 创建 PostgreSQL 连接池
const pool = new Pool(configs);

// 查询函数，可以在你的应用中任何需要进行数据库查询的地方使用
export async function query(text: string, params?: any[]) {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        // await closePool();
        return res;
    }catch (e){
        console.log(e);
        throw e;
    }

}

// 连接池关闭函数
export async function closePool() {
    await pool.end();
}

