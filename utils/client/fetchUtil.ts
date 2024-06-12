'use client'
import {message} from "antd";
interface ErrorWithResponse extends Error {
    response?: Response;
}
const checkStatus = (res:Response) => {
    if (res.status === 401){
        window.location.href = '/user/login'
    }
    if (res.status === 200) {
        return res;
    }
    res.json().then(value => {
        message.error(`${value.msg}`);

    })
    const error:ErrorWithResponse = new Error(res.statusText);
    error.response = res;
    throw error;
};

/**
 *  捕获成功登录过期状态码等
 * @returns {*}
 * @param res
 */
const judgeOkState = async (res:Response) => {
    const cloneRes = await res.clone().json();
    // console.log('judgeOkState', cloneRes)
    // if (cloneRes.msg=== '登录过期'){
    // }
    // 可以在这里管控全局请求
    if (!!cloneRes.code && cloneRes.code !== 200) {
        message.error(`${cloneRes.msg}`);

    }
    return res;
};
interface ResponseError {
    code: number;
    data: boolean;
}
/**
 * 捕获失败
 * @param error
 */
const handleError = (error: Error): ResponseError => {
    message.error(`网络请求失败,${error}`);
    return {   //防止页面崩溃，因为每个接口都有判断res.code以及data
        code: -1,
        data: false,
    };
};
interface optionsInterface {
    type?: string;
    method?: string;
    body?:any;
}
interface DefaultOptions {
    credentials: string;
    mode: string;
    headers: {
        token: null | string;
        Authorization: null | string;
        'Content-Type'?: string; // 这里添加 Content-Type 属性，并使其可选
    };
}
class http {
    /**
     *静态的fetch请求通用方法
     * @param url
     * @param options
     * @returns {Promise<unknown>}
     */
    static async staticFetch(url = '', options:optionsInterface = {}) {

        const defaultOptions:DefaultOptions = {
            /*允许携带cookies*/
            credentials: 'include',
            /*允许跨域**/
            mode: 'cors',
            headers: {
                token: null,
                Authorization: null,
                // 当请求方法是POST，如果不指定content-type是其他类型的话，默认为如下，要求参数传递样式为 key1=value1&key2=value2，但实际场景以json为多
                // 'content-type': 'application/x-www-form-urlencoded',
            },
        };

        // 无headers配置 使用默认请求头，当上传类型为FormData时，默认不设置请求头，否则报错
        if ((options.method === 'POST' || 'PUT') && options.type!=='FormData' ) {
            defaultOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        return fetch(url, { ...defaultOptions, ...options } as RequestInit)
            .then(checkStatus)
            .then(judgeOkState)
            .then(res => res.json())
            .catch(handleError);
    }

    /**
     *post请求方式
     * @param url
     * @param params
     * @param option
     * @returns {Promise<unknown>}
     */
    post(url:string, params = {}, option:optionsInterface = {}) {
        const options = Object.assign({ method: 'POST' }, option);
        // 判断params中是否有值
        if (Object.keys(params).length > 0) {
            //可以是上传键值对形式，也可以是文件，使用append创造键值对数据
            if (options.type === 'FormData' && typeof options.body === 'object') {
                let params = new FormData();
                for (let key of Object.keys(options.body)) {
                    params.append(key, options.body[key]);
                }
                options.body = params;
            }else{
                //一般我们常用场景用的是json，所以需要在headers加Content-Type类型
                options.body = JSON.stringify(params);
            }
        }

        return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
    }

    /**
     * put方法
     * @param url
     * @param params
     * @param option
     * @returns {Promise<unknown>}
     */
    put(url:string, params = {}, option:optionsInterface = {}) {
        const options = Object.assign({ method: 'PUT' }, option);
        options.body = JSON.stringify(params);
        return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
    }

    /**
     * get请求方式
     * @param url
     * @param option
     */
    async get(url:string, option = {}) {
        const options = Object.assign({ method: 'GET' }, option);
        return await http.staticFetch(url, options);
    }

    /**
     * delete请求方式
     * @param url
     * @param option
     */
    deleteAct(url:string, option = {}) {
        const options = Object.assign({method: 'DELETE'}, option);
        return http.staticFetch(url, options);
    }
}

const requestFun = new http(); //new生成实例
export const {post, get, deleteAct} = requestFun;
export default requestFun;
