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
        const {tokenName, status, usageLimit,expiresAt,description,tokenId} = jsonData;
        // 参数有效性检查
        if (!tokenName || !status || !usageLimit || !expiresAt) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }else if (status!=='enable' && status!=='disable'){
            return BizResult.validateFailed('', '状态不正确');
        }

        const result = await query(
            'UPDATE tokens SET expires_at = $3, token_name = $4, status = $5, usage_limit = $6, description = $7 WHERE user_id = $1 AND token_id = $2',
            [userId,tokenId, expiresAt, tokenName, status, usageLimit, description]
        );

        return BizResult.success('', '修改token信息成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
