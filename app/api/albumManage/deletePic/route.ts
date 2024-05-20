'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import * as crypto from "crypto";
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

        const result = await query(
            'DELETE FROM images WHERE user_id = $1 AND image_id = $2',
            [userId,imageId]
        );

        return BizResult.success('', '删除图片成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
