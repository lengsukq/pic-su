import { UserJwtPayload } from "@/utils/auth/auth";
import {randomImages} from "@/utils/third-party-tools";

// 定义文件数据的接口
interface FileData {
    file: any;
    bedType: "SM" | "BilibiliDaily" | "BilibiliCover" | "IMGBB" | "TG";
    base64?: string;
}

let userInfoApi: UserJwtPayload;

// 上传图片主函数，根据不同的图床类型选择相应的上传函数
export async function upImgMain(fileData: FileData, userInfo: UserJwtPayload) {
    userInfoApi = userInfo;
    const upImgObj: Record<string, (fileData: FileData) => Promise<any>> = {
        "SM": upImgBySM,
        "BilibiliDaily": upImgByBilibiliDaily,
        "BilibiliCover": upImgByBilibiliCover,
        "IMGBB": upImgByImgBB,
        "TG": upImgByTelegraph,
    };

    const uploadFunction = upImgObj[fileData.bedType];
    return uploadFunction ? await uploadFunction(fileData) : { msg: '无效的bedType', url: '' };
}

// 通用的上传请求函数
async function fetchUpload(url: string, formData: FormData, headers: HeadersInit = {}): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            throw new Error('上传失败');
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

// 上传图片到SM图床
async function upImgBySM({ file }: FileData) {
    const formData = new FormData();
    formData.append('smfile', file);
    formData.append('format', 'json');

    const data = await fetchUpload('https://sm.ms/api/v2/upload', formData, {
        "Authorization": userInfoApi.SM_TOKEN,
    });

    return data ? { msg: '上传成功', url: data.data.url } : { msg: '上传失败，请检查SM图床Token是否有效', url: await randomImages() };
}

// 上传图片到哔哩哔哩动态/专栏
async function upImgByBilibiliDaily({ file }: FileData) {
    const formData = new FormData();
    formData.append('file_up', file);
    formData.append('biz', 'article');
    formData.append('csrf', userInfoApi.BILIBILI_CSRF);

    const data = await fetchUpload('https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs', formData, {
        "cookie": `SESSDATA=${userInfoApi.BILIBILI_SESSDATA}`,
    });

    return data ? { msg: '上传成功', url: data.data.image_url } : { msg: '上传失败，请检查哔哩哔哩动态/专栏图片参数是否有效', url: await randomImages() };
}

// 上传图片到哔哩哔哩视频封面
async function upImgByBilibiliCover({ base64 }: FileData) {
    const formData = new FormData();
    formData.append('cover', base64!);
    formData.append('csrf', userInfoApi.BILIBILI_CSRF);

    const data = await fetchUpload('https://member.bilibili.com/x/vu/web/cover/up', formData, {
        "cookie": `SESSDATA=${userInfoApi.BILIBILI_SESSDATA}`,
    });

    return data ? { msg: '上传成功', url: data.data.url } : { msg: '上传失败，请检查哔哩哔哩视频封面参数是否有效', url: await randomImages() };
}

// 上传到imgBB图床
async function upImgByImgBB({ file }: FileData) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', userInfoApi.IMGBB_API);

    const data = await fetchUpload('https://api.imgbb.com/1/upload', formData);

    return data ? { msg: '上传成功', url: data.data.url } : { msg: '上传失败，请检查imgBB图床API是否有效', url: await randomImages() };
}

// 上传图片到Telegraph图床
async function upImgByTelegraph({ file }: FileData) {
    const formData = new FormData();
    formData.append('file', file);

    let proxyUrl = userInfoApi.TG_URL;
    if (!proxyUrl.endsWith('/')) {
        proxyUrl += '/';
    }

    const data = await fetchUpload(`${proxyUrl}https://telegra.ph/upload`, formData);

    return data ? { msg: '上传成功', url: `${proxyUrl}https://telegra.ph/${data[0].src}` } : { msg: '上传失败，请检查Telegraph图床URL是否有效', url: await randomImages() };
}
