//将ISO 8601格式的日期字符串转换为"年.月.日"的格式
export function convertDateFormat (isoDateString: string | Date) {
    // 创建一个新的Date对象，使用ISO 8601字符串作为参数
    const date = new Date(isoDateString);

    // 获取年份的最后两位数字
    const year = date.getFullYear().toString().slice(-2);

    // 获取月份和日期，并确保它们是两位数
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // 返回格式化的日期字符串
    return `${year}.${month}.${day}`;
}
// 传入val值复制到剪贴板
export function copyToClipboard (val: string)  {
    const input = document.createElement('input');
    input.value = val;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
};