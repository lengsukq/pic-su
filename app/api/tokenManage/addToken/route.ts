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
        const {tokenName, status, usageLimit} = jsonData;
        // 参数有效性检查
        if (!tokenName || !status || !usageLimit) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }

        // 生成随机的Token
        const generateRandomToken=(length:number)=> {
            return crypto.randomBytes(length).toString('hex');
        }

        // 调用函数，生成一个32字节长度的token
        const token = generateRandomToken(32);
        const result = await query(
            'INSERT INTO tokens(user_id, token, created_at, expires_at,token_name,status,usage_limit) VALUES($1, $2,NOW(), NOW(),$3,$4,$5) RETURNING token_id',
            [userId, token,tokenName, status,usageLimit]
        );

        return BizResult.success('', '新增token成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
