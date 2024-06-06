'use server'
import BizResult from "@/utils/BizResult";
import {upImgMain} from "@/utils/imageTools";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";

export async function POST(req:NextRequest) {
    try {
        const userInfo = await verifyAuth(req)

        //multipart/form-data;
        const formData = await req.formData();
        const file:File = <File>formData.get('file');
        const base64 :string= <string>formData.get('base64');
        const bedType = <"SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB">formData.get('bedType') || process.env.NEXT_PUBLIC_DEFAULT_BED;
        // 参数有效性检查
        if (!bedType) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }


        const fileData = {file, base64,bedType}
        // console.log('图片上传接口',fileData)
        const {msg, url} = await upImgMain(fileData,userInfo);
        return BizResult.success({url: url}, msg);
    } catch (err) {
        console.log('err', err)
        return BizResult.fail("图片上传失败");

    }
}
