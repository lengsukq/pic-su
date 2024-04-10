'use server';
import BizResult from '@/utils/BizResult';
import { query } from "@/utils/db";

export async function POST(req: Request) {
    console.log('进入');
    try {
        const jsonData = await req.json();
        const { username, password } = jsonData;
        console.log('jsonData', { username, password });

        // 通过用户名或邮箱查找用户
        const user = await query('SELECT password FROM users WHERE username = $1 OR email = $1', [username]);

        if (user.rowCount === 0) {
            // 用户不存在
            return new Response(JSON.stringify(BizResult.fail('', '用户不存在')), {
                headers: {'Content-Type': 'application/json'}
            });
        }

        const userPassword = user.rows[0].password;
        // 比对密码，这里假定您在数据库存储的是明文密码。实际操作请确保密码在存储时进行过哈希处理。
        if (userPassword !== password) {
            // 密码错误
            return new Response(JSON.stringify(BizResult.fail('', '密码错误')), {
                headers: {'Content-Type': 'application/json'}
            });
        }

        // 登录成功
        return new Response(JSON.stringify(BizResult.success('', '登录成功')), {
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error(error);
        // 系统异常处理
        return new Response(JSON.stringify(BizResult.fail('', '系统异常')), {
            headers: {'Content-Type': 'application/json'}
        });
    }
}
