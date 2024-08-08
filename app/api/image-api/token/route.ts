'use server'
import BizResult from "@/utils/BizResult";
import { upImgMain } from "@/utils/imageTools";
import { NextRequest } from 'next/server';
import { sequelize, tokens, albums, users, images } from "@/utils/SeqDb";
import { Op } from 'sequelize';

export async function POST(req: NextRequest) {
    try {
        // multipart/form-data;
        const formData = await req.formData();
        const token: string = (formData.get('token') as string) || (req.headers.get('Authorization') as string);
        const file: File = formData.get('file') as File;
        let albumId = formData.get('albumId') as string;
        const albumName = formData.get('albumName') as string;
        const base64: string = formData.get('base64') as string;
        const bedType = formData.get('bedType') as "SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB";

        // 参数有效性检查
        if (!bedType || !token || !(albumName || albumId) || !(file || base64)) {
            return BizResult.validateFailed('', '参数不完整');
        }

        // 查询token是否存在
        const tokenRecord = await tokens.findOne({ where: { token } });
        if (!tokenRecord) {
            return BizResult.authfailed('', 'token不存在');
        }

        // 日期判断，包含当天
        const currentDate = new Date();
        const tokenExpiryDate = new Date(tokenRecord.expires_at);
        tokenExpiryDate.setHours(23, 59, 59, 999); // 设置为过期日的最后一刻
        if (currentDate.getTime() > tokenExpiryDate.getTime()) {
            return BizResult.fail("token已失效");
        }
        if (tokenRecord.status !== 'enable') return BizResult.fail("token已禁用");
        if (tokenRecord.usage_limit <= 0) return BizResult.fail("token次数已用完");

        // 如果只填了album_name，则通过album_name、user_id查询相册album_id
        if (albumName) {
            const albumRecord = await albums.findOne({ where: { album_name: albumName, user_id: tokenRecord.user_id } });
            if (!albumRecord) {
                return BizResult.fail("相册不存在");
            } else {
                albumId = albumRecord.album_id;
                console.log('获取到相册id', albumId);
            }
        }

        // album_permissions为[]时，不限制上传相册id
        if (tokenRecord.album_permissions.length !== 0 && !tokenRecord.album_permissions.includes(Number(albumId))) {
            console.log('token无权限上传该相册', tokenRecord.album_permissions, albumId);
            return BizResult.fail("token无权限上传该相册");
        }

        // 通过album_id、album_name、user_id查询相册是否存在
        const albumExistRecord = await albums.findOne({
            where: {
                [Op.or]: [
                    { album_id: albumId },
                    { album_name: albumName }
                ],
                user_id: tokenRecord.user_id
            }
        });
        if (!albumExistRecord) {
            return BizResult.fail("相册不存在");
        }

        const fileData = { file, base64, bedType };
        const userRecord = await users.findOne({ where: { user_id: tokenRecord.user_id } });
        const { msg, url } = await upImgMain(fileData, userRecord);

        // 上传失败返回失败信息
        if (msg !== '上传成功') {
            return BizResult.fail(msg);
        }

        // 更新使用的token，tokens表中的usage_limit 减1 current_usage加1
        await tokens.update(
            { usage_limit: sequelize.literal('usage_limit - 1'), current_usage: sequelize.literal('current_usage + 1') },
            { where: { token } }
        );

        // 向images表中插入数据 user_id,url,created_at,token_id,album_id,updated_at
        await images.create({
            user_id: tokenRecord.user_id,
            url,
            token_id: tokenRecord.token_id,
            album_id: albumId,
            created_at: new Date(),
            updated_at: new Date()
        });

        return BizResult.success({ url }, msg);
    } catch (err) {
        console.error('错误:', err);
        return BizResult.fail("图片上传失败");
    }
}
