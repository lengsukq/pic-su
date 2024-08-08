'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { verifyAuth } from "@/utils/auth/auth";
import { users } from '@/utils/SeqDb'; // 引入 users 模型

export async function POST(req: NextRequest) {
    console.log('进入');
    try {
        const { user_id: userId } = await verifyAuth(req);

        // 获取 users 表中对应 user_id 的数据
        const user = await users.findOne({ where: { user_id: userId } });

        if (!user) {
            return BizResult.fail('', '用户不存在');
        }

        return BizResult.success(user, '获取用户信息成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
