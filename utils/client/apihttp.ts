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
