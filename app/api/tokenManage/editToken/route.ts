'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'
import { verifyAuth } from "@/utils/auth/auth";
import { tokens } from '@/utils/SeqDb';  // 假设你已经定义好了 Sequelize 的 Token 模型

export async function POST(req: NextRequest) {
    try {
        const { user_id: userId } = await verifyAuth(req)
        const jsonData = await req.json();
        const { tokenName, status, usageLimit, expiresAt, description, tokenId, albumPermissions } = jsonData;

        // 参数有效性检查
        if (!tokenName || !status || !usageLimit || !expiresAt) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        } else if (status !== 'enable' && status !== 'disable') {
            return BizResult.validateFailed('', '状态不正确');
        }

        // 确保 albumPermissions 是一个数组，如果为空则赋值为一个空数组
        const albumPermissionsArray = Array.isArray(albumPermissions) ? albumPermissions : [];

        const updateData = {
            expires_at: expiresAt,
            token_name: tokenName,
            status: status,
            usage_limit: usageLimit,
            description: description,
            album_permissions: albumPermissionsArray
        };

        const result = await tokens.update(updateData, {
            where: {
                user_id: userId,
                token_id: tokenId
            }
        });

        if (result[0] > 0) {  // result[0] 表示受影响的行数
            return BizResult.success('', '修改token信息成功');
        } else {
            return BizResult.fail('', '修改token信息失败');
        }
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
