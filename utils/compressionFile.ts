import { UploadFile } from 'antd';

const fileToDataURL = (file: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = (e) => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = dataURL;
    });
};

const canvasToFile = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> => {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
};

/**
 * 图片压缩方法
 * @param file 图片文件
 * @param type 想压缩成的文件类型
 * @param quality 压缩质量参数
 * @returns 压缩后的新图片
 */
export const compressFile = async (file: Blob, type = 'image/jpeg', quality = 0.5): Promise<File> => {
    const fileName = (file as File).name;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const base64 = await fileToDataURL(file);
    const img = await dataURLToImage(base64);
    canvas.width = img.width;
    canvas.height = img.height;
    context.clearRect(0, 0, img.width, img.height);
    context.drawImage(img, 0, 0, img.width, img.height);
    const blob = await canvasToFile(canvas, type, quality);
    return new File([blob!], fileName, { type });
};
