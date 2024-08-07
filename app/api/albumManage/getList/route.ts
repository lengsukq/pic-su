'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { verifyAuth } from "@/utils/auth/auth";
import { albums, images, sequelize } from "@/utils/SeqDb";
import {Op, Sequelize} from "sequelize";

export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req);
        const jsonData = await req.json();
        const { albumName = "", current, pageSize } = jsonData;

        // 参数有效性检查
        if (!current || !pageSize) {
            return BizResult.validateFailed('', '参数不完整');
        }

        const offset = (current - 1) * pageSize; // 计算要跳过的记录数

        // 计算总数
        const totalResult = await albums.count({
            where: {
                user_id: userId,
                album_name: {
                    [Op.iLike]: `%${albumName}%`
                }
            }
        });
        const allAttributes = Object.keys(albums.getAttributes());
        // 使用 Sequelize 模型方法进行查询
        const result = await albums.findAll({
            attributes: [
                ...allAttributes,
                [Sequelize.literal(`(SELECT COUNT(*) FROM images WHERE images.album_id = albums.album_id)`), 'image_count']
            ],
            include: [
                {
                    as: 'images',
                    model: images,
                    attributes: [],
                    required: false // 如果相册可能没有图片，则设置为 false
                }
            ],
            where: {
                user_id: userId,
                album_name: {
                    [Op.iLike]: `%${albumName}%`
                }
            },
            order: [['created_at', 'ASC']],
            limit: pageSize,
            offset: offset,
            group: ['albums.album_id']
        });

        console.log('相册列表查询', result);

        return BizResult.success({
            record: result,
            total: totalResult
        }, '查询相册列表成功');
    } catch (error) {
        console.error('系统异常:', error);
        return BizResult.fail('', '系统异常');
    }
}
