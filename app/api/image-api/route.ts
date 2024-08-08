'use server'
import BizResult from "@/utils/BizResult";
import {upImgMain} from "@/utils/imageTools";
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {albums,images} from "@/utils/SeqDb";

export async function POST(req: NextRequest) {
    try {
        const userInfo = await verifyAuth(req);

        // multipart/form-data;
        const formData = await req.formData();
        let albumId = formData.get('albumId');
        const file: File = <File>formData.get('file');
        const base64: string = <string>formData.get('base64');
        const bedType = <"SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB">formData.get('bedType');

        // 参数有效性检查
        if (!bedType) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }

        const fileData = { file, base64, bedType };
        const { msg, url } = await upImgMain(fileData, userInfo);

        // 上传到相册
        if (albumId) {
            // 通过 album_id 和 user_id 查询相册是否存在
            const albumExistResult = await albums.findOne({ where: { album_id: albumId, user_id: userInfo.user_id } });
            if (!albumExistResult) {
                return BizResult.fail("相册不存在");
            }
            // 向 images 表中插入数据
            await images.create({
                user_id: userInfo.user_id,
                url: url,
                album_id: albumId
            });
        }

        return BizResult.success({ url: url }, msg);
    } catch (err) {
        console.log('err', err);
        return BizResult.fail("图片上传失败");
    }
}