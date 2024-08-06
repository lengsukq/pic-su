'use server'
import BizResult from '@/utils/BizResult';
import {NextRequest} from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import * as crypto from "crypto";
import {executeQuery} from "@/utils/SeqDb";

export async function POST(req: NextRequest) {
    try {
        const {user_id: userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {tokenName, status, usageLimit, expiresAt, description,albumPermissions} = jsonData;
        // 参数有效性检查
        if (!tokenName || !status || !expiresAt) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        } else if (status !== 'enable' && status !== 'disable') {
            return BizResult.validateFailed('', '状态不正确');
        }

        // 生成随机的Token
        const generateRandomToken = (length: number) => {
            return crypto.randomBytes(length).toString('hex');
        }
        // 调用函数，生成一个32字节长度的token
        const token = generateRandomToken(32);
        await executeQuery(
            `INSERT INTO tokens(user_id, token, created_at, expires_at, token_name, status, usage_limit, description, album_permissions)
                VALUES(?, ?, NOW(), ?, ?, ?, ?, ?, ?)
                RETURNING token_id`,
            [userId, token, expiresAt, tokenName, status, usageLimit, description, JSON.stringify(albumPermissions).replace('[', '{').replace(']', '}') || {}]
        );

        return BizResult.success('', '新增token成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
