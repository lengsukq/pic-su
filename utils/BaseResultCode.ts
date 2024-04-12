/**
 * @author ycx
 * @description 业务异常通用code
 */
class BaseResultCode {
    static SUCCESS = new BaseResultCode(200, '成功');
    static FAILED = new BaseResultCode(500, '系统异常');
    static VALIDATE_FAILED = new BaseResultCode(400, '参数校验失败');
    static AUTH_FAILED = new BaseResultCode(401, '用户未登录');
    static API_NOT_FOUND = new BaseResultCode(404, '接口不存在');
    static API_BUSY = new BaseResultCode(700, '操作过于频繁');


    code: number;
    desc: string;

    constructor(code: number, desc: string) {
        this.code = code;
        this.desc = desc;
    }
}

export default BaseResultCode;
