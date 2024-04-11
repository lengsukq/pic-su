import { NextRequest } from 'next/server'

export function cookieTools(request:NextRequest) {
    const cookie = request.cookies.get('cookie');
    if (cookie&&cookie.hasOwnProperty('value')){
        // 解密cookie的value
        console.log('解密cookie的value',decryptData(cookie.value))
        return decryptData(cookie.value)
    }else{
        throw new Error('cookie不存在')
    }

}
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || 'lengsukq/pic-su';
// 加密函数
export function encryptData(data:string) {
    return jwt.sign(data, secretKey);
}

// 解密函数
export function decryptData(cookie:string) {
    try {
        return jwt.verify(cookie, secretKey);
    } catch (err) {
        console.error('解密失败：', err);
        return null;
    }
}
