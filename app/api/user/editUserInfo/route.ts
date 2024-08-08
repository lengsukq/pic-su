'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { setUserCookie, verifyAuth } from "@/utils/auth/auth";
import { users } from '@/utils/SeqDb'; // 引入 users 模型

export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req);
        const jsonData = await req.json();
        const { SM_TOKEN, BILIBILI_SESSDATA, BILIBILI_CSRF, IMGBB_API, TG_URL } = jsonData;

        // 更新用户信息
        await users.update(
            {
                SM_TOKEN,
                BILIBILI_SESSDATA,
                BILIBILI_CSRF,
                IMGBB_API,
                TG_URL,
                updated_at: new Date() // 设置更新时间
            },
            { where: { user_id: userId } }
        );

        // 通过 user_id 查找用户
        const user = await users.findOne({ where: { user_id: userId } });

        // console.log('user', user.dataValues);
        if (!user) {
            return BizResult.fail('', '用户不存在');
        }
        const userObject = user.toJSON(); // 确保传递的是一个普通对象
        return setUserCookie(BizResult.success('', '修改用户信息成功'), userObject);
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
