'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { verifyAuth } from "@/utils/auth/auth";
import * as crypto from "crypto";
import { tokens } from "@/utils/SeqDb"; // 假设 tokens 表模型已经定义

export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req);
        const jsonData = await req.json();
        const { tokenName, status, usageLimit, expiresAt, description, albumPermissions } = jsonData;

        // 参数有效性检查
        if (!tokenName || !status || !expiresAt) {
            return BizResult.validateFailed('', '参数不完整');
        } else if (status !== 'enable' && status !== 'disable') {
            return BizResult.validateFailed('', '状态不正确');
        }

        // 生成随机的Token
        const generateRandomToken = (length: number): string => {
            return crypto.randomBytes(length).toString('hex');
        }

        // 调用函数，生成一个32字节长度的token
        const token = generateRandomToken(32);

        // 确保 albumPermissions 是一个数组，如果为空则赋值为一个空数组
        const albumPermissionsArray = Array.isArray(albumPermissions) ? albumPermissions : [];

        // 插入数据到数据库
        const newToken = await tokens.create({
            user_id: userId,
            token: token,
            created_at: new Date(),
            expires_at: new Date(expiresAt),
            token_name: tokenName,
            status: status,
            usage_limit: usageLimit,
            description: description,
            album_permissions: albumPermissionsArray
        });

        return BizResult.success({ token_id: newToken.token_id }, '新增token成功');
    } catch (error) {
        console.error('系统异常:', error);
        return BizResult.fail('', '系统异常');
    }
}
