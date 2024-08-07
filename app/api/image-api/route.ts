'use server'
import BizResult from "@/utils/BizResult";
import {upImgMain} from "@/utils/imageTools";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {executeQuery} from "@/utils/SeqDb";

export async function POST(req:NextRequest) {
    try {
        const userInfo = await verifyAuth(req)

        //multipart/form-data;
        const formData = await req.formData();
        let albumId = formData.get('albumId');
        const file:File = <File>formData.get('file');
        const base64 :string= <string>formData.get('base64');
        const bedType = <"SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB">formData.get('bedType');
        // 参数有效性检查
        if (!bedType) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }


        const fileData = {file, base64,bedType}
        // console.log('图片上传接口',fileData)
        const {msg, url} = await upImgMain(fileData,userInfo);
        // 上传到相册
        if (albumId){
            // 通过album_id、album_name、user_id查询相册是否存在
            const albumExistResult = await executeQuery(
                `SELECT * FROM albums WHERE album_id = ? AND user_id = ?`,
                [albumId, userInfo.user_id]
            );
            if (!albumExistResult[0].length) {
                return BizResult.fail("相册不存在");
            }
            // 向images表中插入数据 user_id,url,created_at,token_id,album_id,updated_at
            await executeQuery(
                `INSERT INTO images (user_id, url, created_at, album_id, updated_at) VALUES (?, ?, NOW(), ?, NOW())`,
                [userInfo.user_id, url, albumId]
            );
        }

        return BizResult.success({url: url}, msg);
    } catch (err) {
        console.log('err', err)
        return BizResult.fail("图片上传失败");

    }
}
