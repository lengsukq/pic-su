'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
export async function POST(req:NextRequest) {
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {albumId,current, pageSize} = jsonData;
        // 参数有效性检查
        if (!current || !pageSize || !albumId) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }
        const offset = (current - 1) * pageSize; // 计算要跳过的记录数
        const totalResult = await query(
            'SELECT COUNT(*) FROM images WHERE user_id = $1 AND album_id = $2;',
            [userId,albumId]
        );
        console.log('totalResult',totalResult)
        // 查询当前页数据
        const result = await query(
            'SELECT * FROM images WHERE user_id = $1 AND album_id = $2 ORDER BY album_id ASC LIMIT $3 OFFSET $4;',
            [userId, albumId, pageSize, offset] // 使用参数化查询防止 SQL 注入
        );
        // console.log('result',result)
        return BizResult.success({
            record: result.rows,
            total: Number(totalResult.rows[0].count)
        }, '查询相册图片列表成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
