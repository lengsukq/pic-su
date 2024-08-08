'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {users} from "@/utils/SeqDb";
export async function POST(req: NextRequest) {
    
    try {
        const { user_id: userId } = await verifyAuth(req);

        // 使用 Sequelize 查询用户信息
        const userInfo = await users.findOne({ where: { user_id: userId } });
        console.log('userInfo',userInfo)
        let options: { label: string; value: string; key: string; }[] = [];

        if (userInfo) {
            const conditions = [
                { condition: userInfo.SM_TOKEN, label: 'SM图床', value: 'SM', key: 'SM' },
                { condition: userInfo.IMGBB_API, label: 'IMGBB图床', value: 'IMGBB', key: 'IMGBB' },
                { condition: userInfo.BILIBILI_SESSDATA && userInfo.BILIBILI_CSRF, label: 'B站图床', value: 'BilibiliDaily', key: 'BilibiliDaily' },
                { condition: userInfo.TG_URL, label: 'Telegra图床', value: 'TG', key: 'TG' },
            ];

            conditions.forEach(item => {
                if (item.condition) {
                    options.push({
                        label: item.label,
                        value: item.value,
                        key: item.key,
                    });
                }
            });

            return BizResult.success(options, '获取用户信息成功');
        } else {
            return BizResult.fail('', '用户不存在');
        }
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}