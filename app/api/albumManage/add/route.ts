'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import { verifyAuth } from "@/utils/auth/auth";
import { randomImages } from "@/utils/third-party-tools";
import { albums } from "@/utils/SeqDb";
export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req);
        const jsonData = await req.json();
        let { albumName, description, albumCover } = jsonData;

        // 参数有效性检查
        if (!albumName || !description) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }

        // 查询 albumName 是否有重复的
        const albumNameResult = await albums.findAll({
            where: {
                album_name: albumName,
                user_id: userId
            }
        });

        if (albumNameResult.length > 0) {
            // 相册名称重复
            return BizResult.fail('', '相册名称重复');
        }

        albumCover = albumCover || await randomImages();

        // 插入新相册
        const newAlbum = await albums.create({
            album_name: albumName,
            description: description,
            user_id: userId,
            album_cover: albumCover,
            created_at: new Date(),
            updated_at: new Date()
        });

        return BizResult.success('', '新增相册成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}