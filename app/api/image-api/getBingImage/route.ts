'use server'
import BizResult from "@/utils/BizResult";
import { NextRequest } from 'next/server'

// 获取bing的每日一图
export async function POST(req: NextRequest) {
    try {
        const response = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const url = `https://cn.bing.com${data.images[0].url}`;
        return BizResult.success({ url: url });
    } catch (err) {
        console.error('Error fetching Bing image:', err);
        return BizResult.fail("图片上传失败");
    }
}