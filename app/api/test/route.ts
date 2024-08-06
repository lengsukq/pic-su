'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {connect} from "@/utils/SeqDb";
export async function POST(req:NextRequest) {
    console.log('进入')
    try {
        await connect();
        return BizResult.success('获取用户信息成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
