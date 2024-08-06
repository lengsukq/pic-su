'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {executeQuery} from "@/utils/SeqDb";
export async function POST(req:NextRequest) {
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {imageId} = jsonData;
        // 参数有效性检查
        if (!imageId) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }

        await executeQuery(
            'DELETE FROM images WHERE user_id = ? AND image_id = ?',
            [userId,imageId]
        );

        return BizResult.success('', '删除图片成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
