// db.ts
import { Pool } from 'pg';

interface Config {
    user?: string;
    host?: string;
    database?: string;
    password?: string;
    port?: number;
    connectionString?: string;
    ssl?: {
        rejectUnauthorized: boolean;
    };
}

let configs: Config = {};

// 如果DATABASE_URL环境变量存在，使用connectionString
if (process.env.DATABASE_URL) {
    configs = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // 如果你使用的是自签名证书或内部证书颁发机构，你可能需要设置这个选项为false
        }
    };
} else {
    configs = {
        user: process.env.DB_USER as string,
        host: process.env.DB_HOST as string,
        database: process.env.DB_NAME as string,
        password: process.env.DB_PASSWORD as string,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        ssl: {
            rejectUnauthorized: false // 如果你使用的是自签名证书或内部证书颁发机构，你可能需要设置这个选项为false
        }
    };
}

// 创建 PostgreSQL 连接池
const pool = new Pool(configs);

// 查询函数，可以在你的应用中任何需要进行数据库查询的地方使用
export async function query(text: string, params?: any[]) {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

// 连接池关闭函数
export async function closePool() {
    await pool.end();
}