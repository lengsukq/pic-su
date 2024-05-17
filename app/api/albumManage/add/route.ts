'use server'
import BizResult from '@/utils/BizResult';
import {query} from "@/utils/db";
import {NextRequest} from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";

export async function POST(req: NextRequest) {
    try {
        const {user_id: userId} = await verifyAuth(req)
        const jsonData = await req.json();
        const {title, description} = jsonData;
        // 参数有效性检查
        if (!title || !description) {
            // 参数不完整
            return BizResult.validateFailed('', '参数不完整');
        }

        await query(
            `INSERT INTO albums(title, description, user_id, created_at, updated_at) VALUES ( $1, $2, $3, NOW(), NOW()) RETURNING album_id;`,
            [title, description, userId]
        );

        return BizResult.success('', '新增相册成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}
