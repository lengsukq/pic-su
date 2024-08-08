'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { users } from '@/utils/SeqDb'; // 引入 users 模型
import { Op } from 'sequelize'; // 用于 Sequelize 运算符

export async function POST(req: NextRequest) {
    
    try {
        const jsonData = await req.json();
        const { username, password, email } = jsonData;

        // 参数有效性检查
        if (!username || !password || !email) {
            return BizResult.validateFailed('', '参数不完整');
        }

        // 检查用户名或邮箱是否已被占用
        const existingUser = await users.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            // 用户名或邮箱已存在
            return BizResult.fail('', '用户名或邮箱已被占用');
        }

        // 创建用户
        await users.create({
            username: username,
            password: password, // 明文密码存储
            email: email,
            created_at: new Date(),
            updated_at: new Date()
        });

        return BizResult.success('', '创建账号成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
