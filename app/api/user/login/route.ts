'use server';
import BizResult from '@/utils/BizResult';
import { users } from "@/utils/SeqDb";
import { Op } from 'sequelize';
import {NextRequest} from 'next/server'
import {setUserCookie} from "@/utils/auth/auth";

export async function POST(req: NextRequest) {
    try {
        const jsonData = await req.json();
        const { username, password } = jsonData;
        // 参数有效性检查
        if (!username || !password) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }
        // 通过用户名或邮箱查找用户
        const user = await users.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });
        console.log('通过用户名或邮箱查找用户',user.user_id,user,)
        if (!user) {
            // 用户不存在
            return BizResult.fail('', '用户不存在');
        }
        const userPassword = user.password;
        // 比对密码，这里假定您在数据库存储的是明文密码。实际操作请确保密码在存储时进行过哈希处理。
        if (userPassword !== password) {
            // 密码错误
            return BizResult.fail('', '密码错误');
        }
        // 登录成功
        const userObject = user.toJSON(); // 确保传递的是一个普通对象
        return setUserCookie(BizResult.success('', '登录成功'), userObject);
    } catch (error) {
        console.error(error);
        // 系统异常处理
        return BizResult.fail('');
    }
}
