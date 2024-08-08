'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { verifyAuth } from "@/utils/auth/auth";
import { tokens } from "@/utils/SeqDb"; // 假设 tokens 表模型已经定义

export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req);
        const jsonData = await req.json();
        const { tokenId } = jsonData;

        // 参数有效性检查
        if (!tokenId) {
            return BizResult.validateFailed('', '参数不完整');
        }

        // 使用 Sequelize 删除记录
        const result = await tokens.destroy({
            where: {
                user_id: userId,
                token_id: tokenId
            }
        });

        if (result === 0) {
            return BizResult.fail('', '未找到匹配的 token');
        }

        return BizResult.success('', '删除token成功');
    } catch (error) {
        console.error('系统异常:', error);
        return BizResult.fail('', '系统异常');
    }
}
