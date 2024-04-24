import {deleteAct, get, post} from "./fetchUtil";
interface LoginParams {
    username: string;
    password: string;
}
// 登录接口
export async function loginApi(params:LoginParams) {
    return post(`/api/user/login`,params);
}
interface RegisterParams {
    username:string,
    password:string,
    email:string
}
// 用户注册
export async function userRegister(params:RegisterParams) {
    return post(`/api/user/register`, params);
}
export async function logout() {
    return get(`/api/user/logout`);
}
// 获取token列表
interface getTokensListParams {
    tokenName:string,
    current:number,
    pageSize:number
}
export async function getTokensList(params:getTokensListParams) {
    return post(`/api/tokenManage/getTokensList`, params);
}
// 添加token
interface addTokenParams {
    tokenName :string,
    status:string,
    usageLimit:number,
    expireTime:string,
}
export async function addToken(params:addTokenParams) {
    return post(`/api/tokenManage/addToken`, params);
}