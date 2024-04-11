import BizResult from "@/utils/BizResult";
import {cookieTools} from "@/utils/cookieTools";
import {cookies} from "next/headers";
import { NextRequest } from 'next/server'

// 退出接口
export async function GET(req:NextRequest) {
    try {
        const {email} = await cookieTools(req);
        cookies().delete(email);
        const oneDay = 24 * 60 * 60 * 1000
        return Response.json(BizResult.success('', '退出成功'),{
            headers: {'Set-Cookie': 'cookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'}
        })
    } catch (error) {
        console.log(error);
        return Response.json(BizResult.fail('','用户未登录'))
    }
}