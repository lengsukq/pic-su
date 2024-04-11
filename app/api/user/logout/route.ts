import BizResult from "@/utils/BizResult";
import {NextRequest, NextResponse} from 'next/server'
import {expireUserCookie} from "@/utils/auth/auth";

// 退出接口
export async function GET(req:NextRequest) {
    try {
        return expireUserCookie(BizResult.success('', '退出成功'));
    } catch (error) {
        console.log(error);
        return Response.json(BizResult.fail('','用户未登录'))
    }
}
