'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {images} from "@/utils/SeqDb";
export async function POST(req:NextRequest) {
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {albumId,current, pageSize} = jsonData;
        // 参数有效性检查
        if (!current || !pageSize || !albumId) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }
        const offset = (current - 1) * pageSize; // 计算要跳过的记录数
        // 使用 Sequelize 模型方法进行查询
        const totalResult = await images.count({
            where: {
                user_id: userId,
                album_id: albumId
            }
        });

        const result = await images.findAll({
            where: {
                user_id: userId,
                album_id: albumId
            },
            order: [['created_at', 'ASC']],
            limit: pageSize,
            offset: offset
        });

        return BizResult.success({
            record: result,
            total: totalResult
        }, '查询相册图片列表成功');

    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
