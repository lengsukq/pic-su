'use server'
import BizResult from '@/utils/BizResult';
import { NextRequest } from 'next/server'

interface ApiRequestConfig {
    url: string;                 // 请求的URL
    params: FormData;            // 请求参数，仅支持FormData
    headers?: Record<string, string>;  // 请求头配置
    valuePath?: string;          // 用于从响应中提取特定值的路径
}

async function fetchApiData(config: ApiRequestConfig): Promise<any> {
    const { url, params, headers, valuePath } = config;

    try {
        const options: RequestInit = {
            method: 'POST',
            headers: headers || {},
            body: params, // 直接使用FormData作为请求体
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data);

        if (valuePath) {
            return getNestedValue(data, valuePath);
        }

        return data;
    } catch (error) {
        console.error('Error fetching API data:', error);
        throw error;
    }
}

// 辅助函数：根据路径提取嵌套值
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
        const arrayMatch = part.match(/([a-zA-Z0-9_]+)\[(\d+)\]/);
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2], 10);
            return acc[arrayKey][arrayIndex];
        } else {
            return acc && acc[part];
        }
    }, obj);
}

export async function POST(req: NextRequest) {
    console.log('进入');
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return BizResult.fail('', '图片上传不正确');

        }

        const upData = new FormData();
        upData.append('image', file);
        upData.append('key', 'xxx');

        const imgUrl = await fetchApiData({
            url: 'https://api.imgbb.com/1/upload',
            params: upData,
            valuePath: 'data.url', // 根据API响应结构设置提取路径
        });

        console.log('imgUrl', imgUrl);

        return BizResult.success( { url: imgUrl },'图片上传成功');
    } catch (error) {
        console.log(error);
        return BizResult.fail('', '系统异常');
    }
}

