'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import { NextRequest } from 'next/server'
import {setUserCookie, verifyAuth} from "@/utils/auth/auth";
export async function POST(req:NextRequest) {
    console.log('进入')
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const { SM_TOKEN, BILIBILI_SESSDATA,BILIBILI_CSRF,IMGBB_API,TG_URL } = jsonData;
        // sql语句，编辑users表中的对应user_id的数据
        await query(
            `UPDATE users SET "SM_TOKEN" = $1, "BILIBILI_SESSDATA" = $2, "BILIBILI_CSRF" = $3, "IMGBB_API" = $4, "TG_URL" = $5 ,updated_at = NOW() WHERE user_id = $6`,
            [SM_TOKEN, BILIBILI_SESSDATA,BILIBILI_CSRF,IMGBB_API,TG_URL,userId]
        )
        // 通过用户名或邮箱查找用户
        const user = await query('SELECT * FROM users WHERE user_id = $1', [userId]);

        return setUserCookie(BizResult.success('', '修改用户信息成功'),user.rows[0])
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
