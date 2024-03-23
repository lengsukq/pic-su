'use server'
import BizResult from "@/utils/BizResult";
import {upImgMain} from "@/utils/imageTools";


export async function POST(req:Request) {
    try {
        //multipart/form-data;
        const formData = await req.formData();
        const file:File = <File>formData.get('file');
        const bedType = <"SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB">formData.get('bedType') || process.env.DEFAULT_BED;
        const base64 :string= <string>formData.get('base64');
        const fileData = {file, base64,bedType}
        // console.log('图片上传接口',fileData)
        const {msg, url} = await upImgMain(fileData);
        return Response.json(BizResult.success({url: url}, msg))
    } catch (err) {
        console.log('err', err)
        return Response.json(BizResult.fail("图片上传失败"))

    }
}
