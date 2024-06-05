'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
export async function POST(req:NextRequest) {
    console.log('进入')
    try {
        const {user_id:userId} = await verifyAuth(req)

        // sql语句，获取users表中的对应user_id的数据
        const result = await query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );


        return BizResult.success(result.rows[0], '获取用户信息成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
