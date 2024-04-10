'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
export async function POST(req:Request) {
    console.log('进入')
    try {
        const jsonData = await req.json();
        const {username, password, email} = jsonData;
        console.log('{username, password, email}',username, password, email)
        // 创建用户
        // 检查用户名或邮箱是否已被占用
        const existingUser = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
        // !是非空断言
        if (existingUser.rowCount !> 0) {
            // 用户名或邮箱已存在
            return Response.json(BizResult.fail('', '户名或邮箱已被占用'))
        }
        const result = await query(
            'INSERT INTO users(username, password, email, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW()) RETURNING id',
            [username, password, email]
        );

        return Response.json(BizResult.success('', '创建账号成功'))
    } catch (error) {
        console.log(error);
        return Response.json(BizResult.fail('', '系统异常'))
    }
}
