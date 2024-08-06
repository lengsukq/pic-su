'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {executeQuery} from "@/utils/SeqDb";
export async function POST(req:NextRequest) {
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {tokenName, status, usageLimit,expiresAt,description,tokenId,albumPermissions} = jsonData;
        // 参数有效性检查
        if (!tokenName || !status || !usageLimit || !expiresAt) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }else if (status!=='enable' && status!=='disable'){
            return BizResult.validateFailed('', '状态不正确');
        }
        console.log('albumPermissions',albumPermissions)
        await executeQuery(
            'UPDATE tokens SET expires_at = ?, token_name = ?, status = ?, usage_limit = ?, description = ?, album_permissions = ? WHERE user_id = ? AND token_id = ?',
            [expiresAt, tokenName, status, usageLimit, description,JSON.stringify(albumPermissions).replace('[', '{').replace(']', '}') || {}, userId, tokenId]
        );

        return BizResult.success('', '修改token信息成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
