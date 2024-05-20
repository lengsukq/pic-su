'use server'
import BizResult from "@/utils/BizResult";
import {upImgMain} from "@/utils/imageTools";
import {NextRequest} from 'next/server'
import {query} from "@/utils/db";

export async function POST(req: NextRequest) {
    try {
        //multipart/form-data;
        const formData = await req.formData();
        const token: string = <string>formData.get('token');
        const file: File = <File>formData.get('file');
        let albumId = formData.get('albumId');
        const albumName = formData.get('albumName');
        const base64: string = <string>formData.get('base64');
        const bedType = <"SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB">formData.get('bedType') || process.env.NEXT_PUBLIC_DEFAULT_BED;
        // 参数有效性检查
        if (!bedType || !token || !(albumName|| albumId) || !(file || base64)) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }
        // 查询token是否存在
        const result = await query(
            `SELECT * FROM tokens WHERE token = $1`,
            // `SELECT EXISTS(SELECT 1 FROM tokens WHERE token = $1 AND expires_at <= NOW() AND status <> 'disable' AND usage_limit > 0 );`,
            [token]
        );
        // console.log('token 存在', result.rows);
        if (!result.rows.length) {
            return BizResult.authfailed('', 'token不存在');
        }
        const info = result.rows[0];
        // 日期判断
        const expiresAtString = info.expires_at;
        // 将字符串转换为Date对象
        const expiresAt = new Date(expiresAtString);
        // 获取当前日期
        const currentDate = new Date();
        // console.log('当前日期', currentDate, expiresAt)
        if (currentDate > expiresAt) return BizResult.fail("token已失效");
        if (info.status !== 'enable') return BizResult.fail("token已禁用");
        if (info.usage_limit <= 0) return BizResult.fail("token次数已用完");
        // album_permissions为[]时，不限制上传相册id
        if (info.album_permissions.length!==0){
            if (albumName){
                // 通过album_name、user_id查询相册album_id
                const albumResult = await query(
                    `SELECT * FROM albums WHERE album_name = $1 AND user_id = $2`,
                    [albumName, info.user_id]
                );
                if (!albumResult.rows.length) {
                    return BizResult.fail("相册不存在");
                }else{
                    albumId = albumResult.rows[0].album_id;
                }
            }
            if (!info.album_permissions.includes(Number(albumId))) {
                console.log('token无权限上传该相册',info.album_permissions,albumId)
                return BizResult.fail("token无权限上传该相册");
            }
        }else{
            // 通过album_id、album_name、user_id查询相册是否存在
            const albumExistResult = await query(
                `SELECT * FROM albums WHERE (album_id = $1 OR album_name = $2) AND user_id = $3`,
                [albumId,albumName, info.user_id]
            );
            if (!albumExistResult.rows.length) {
                return BizResult.fail("相册不存在");
            }
        }
        const fileData = {file, base64, bedType}
        // console.log('图片上传接口',fileData)
        const {msg, url} = await upImgMain(fileData);
        // 上传失败返回失败信息
        if (msg !== '上传成功') {
            return BizResult.fail(msg);
        }
        // 更新使用的token，tokens表中的usage_limit 减1 current_usage加1
        await query(
            `UPDATE tokens SET usage_limit = usage_limit - 1, current_usage = current_usage + 1 WHERE token = $1`,
            [token]
        );
        // 向images表中插入数据 user_id,url,created_at,token_id,album_id,update_at
        await query(
            `INSERT INTO images (user_id, url, created_at, token_id, album_id, update_at) VALUES ($1, $2, NOW(), $3, $4, NOW())`,
            [info.user_id, url, info.token_id, albumId]
        );
        return BizResult.success({url: url}, msg);
    } catch (err) {
        console.log('err', err)
        return BizResult.fail("图片上传失败");
    }
}
