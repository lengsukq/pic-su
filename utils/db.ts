// db.ts
import { Pool } from 'pg';

// 创建 PostgreSQL 连接池
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

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

