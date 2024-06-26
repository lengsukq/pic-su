'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
export async function POST(req:NextRequest) {
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {tokenName,current, pageSize} = jsonData;
        // 参数有效性检查
        if (!current || !pageSize) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }
        const offset = (current - 1) * pageSize; // 计算要跳过的记录数
        const totalResult = await query(
            'SELECT COUNT(*) FROM tokens WHERE user_id = $1;',
            [userId]
        );
        // 查询当前页数据
        const result = await query(
            'SELECT * FROM tokens WHERE user_id = $1 AND ($2 = \'\' OR token_name ILIKE $2) ORDER BY token_id DESC LIMIT $3 OFFSET $4;',
            [userId, `%${tokenName || ""}%`, pageSize, offset] // 使用参数化查询防止 SQL 注入
        );
        // console.log('result',result)
        return BizResult.success({
            record: result.rows,
            total: Number(totalResult.rows[0].count)
        }, '查询token列表成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
