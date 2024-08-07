'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import {images} from "@/utils/SeqDb";
export async function POST(req:NextRequest) {
    try {
        const {user_id:userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {imageId} = jsonData;
        // 参数有效性检查
        if (!imageId) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }

        // 使用 Sequelize 模型方法进行删除操作
        const result = await images.destroy({
            where: {
                user_id: userId,
                image_id: imageId
            }
        });

        if (result === 0) {
            return BizResult.fail('', '图片不存在或已被删除');
        }
        return BizResult.success('', '删除图片成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
