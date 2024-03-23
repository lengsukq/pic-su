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

    /**
     * 成功
     * @param data {any} 返回对象
     * @param msg {string} 自定义message，默认为BizResultCode.SUCCESS.desc
     * @return {BizResult}
     */
    static success(data: any, msg: string = BizResultCode.SUCCESS.desc): BizResult {
        return new BizResult(BizResultCode.SUCCESS.code, msg, data);
    }

    /**
     * 失败
     */
    static fail(errData: any, msg: string = BizResultCode.FAILED.desc): BizResult {
        return new BizResult(BizResultCode.FAILED.code, msg, errData);
    }

    /**
     * 参数校验失败
     */
    static validateFailed(param: any, msg: string = BizResultCode.VALIDATE_FAILED.desc): BizResult {
        return new BizResult(BizResultCode.VALIDATE_FAILED.code, msg, param);
    }
}

export default BizResult;
