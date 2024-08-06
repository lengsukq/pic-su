'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {executeQuery} from "@/utils/SeqDb";
export async function POST(req:NextRequest) {
    console.log('进入')
    try {
        const {user_id:userId} = await verifyAuth(req)

        // sql语句，获取users表中的对应user_id的数据
        const result = await executeQuery(
            'SELECT * FROM users WHERE user_id = ?',
            [userId]
        );
        const userInfo = result[0][0];
        let options: { label: string; value: string; key: string; }[] = [];

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
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
