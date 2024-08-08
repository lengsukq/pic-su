'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server';
import { verifyAuth } from "@/utils/auth/auth";
import { tokens } from '@/utils/SeqDb';
import { Op } from 'sequelize';

export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req);
        const jsonData = await req.json();
        const { tokenName, current, pageSize } = jsonData;

        // 参数有效性检查
        if (!current || !pageSize) {
            return BizResult.validateFailed('', '参数不完整');
        }

        const offset = (current - 1) * pageSize; // 计算要跳过的记录数

        // 查询总记录数
        const totalResult = await tokens.count({
            where: {
                user_id: userId,
                token_name: {
                    [Op.iLike]: `%${tokenName || ''}%`
                }
            }
        });

        // 查询当前页数据
        const result = await tokens.findAll({
            where: {
                user_id: userId,
                token_name: {
                    [Op.iLike]: `%${tokenName || ''}%`
                }
            },
            order: [['token_id', 'DESC']],
            limit: pageSize,
            offset: offset
        });

        return BizResult.success({
            record: result,
            total: totalResult
        }, '查询token列表成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
