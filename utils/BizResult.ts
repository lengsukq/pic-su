import { NextResponse } from 'next/server';
import BizResultCode from './BaseResultCode';

/**
 * @author ycx
 * @description 统一返回结果
 */
class BizResult {
    /**
     * 返回code
     */
    code: number;
    /**
     * 返回消息
     */
    msg: string;
    /**
     * 返回数据
     */
    data: any;
    /**
     * 返回时间
     */
    time: number;

    /**
     *
     * @param code {number} 返回code
     * @param msg {string} 返回消息
     * @param data {any} 返回具体对象
     */
    constructor(code: number, msg: string, data: any) {
        this.code = code;
        this.msg = msg;
        this.data = data;
        this.time = Date.now();
    }
    // 工具方法用来创建NextResponse
    // 修改了工具方法的返回类型为NextResponse
    private static createResponse(bizResult: BizResult): NextResponse {
        return new NextResponse(JSON.stringify(bizResult),{
            status: bizResult.code
        })
    }

    /**
     * 成功
     * @param data {any} 返回对象
     * @param msg {string} 自定义message，默认为BizResultCode.SUCCESS.desc
     * @return {BizResult}
     */
    static success(data: any, msg: string = BizResultCode.SUCCESS.desc): NextResponse {
        return this.createResponse(new BizResult(BizResultCode.SUCCESS.code, msg, data))
    }

    /**
     * 失败
     */
    static fail(errData: any, msg: string = BizResultCode.FAILED.desc): NextResponse {
        return this.createResponse(new BizResult(BizResultCode.FAILED.code, msg, errData));
    }

    /**VALIDATE_FAILED
     * 参数校验失败
     */
    static validateFailed(param: any, msg: string = BizResultCode.VALIDATE_FAILED.desc): NextResponse {
        return this.createResponse(new BizResult(BizResultCode.VALIDATE_FAILED.code, msg, param));
    }
    /**API_NOT_FOUND
     * 接口不存在
     */
    static apinotfound(param: any, msg: string = BizResultCode.API_NOT_FOUND.desc): NextResponse {
        return this.createResponse(new BizResult(BizResultCode.API_NOT_FOUND.code, msg, param));
    }
    /**API_BUSY
     * 操作过于频繁
     */
    static apibusy(param: any, msg: string = BizResultCode.API_BUSY.desc): NextResponse {
        return this.createResponse(new BizResult(BizResultCode.API_BUSY.code, msg, param));
    }

    /**API_BUSY
     * 用户未登录
     */
    static authfailed(param: any, msg: string = BizResultCode.AUTH_FAILED.desc): NextResponse {
        return this.createResponse(new BizResult(BizResultCode.AUTH_FAILED.code, msg, param));
    }
}

export default BizResult;
