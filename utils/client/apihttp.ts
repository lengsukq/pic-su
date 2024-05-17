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
export async function addToken(params: {
    usageLimit: number;
    tokenName: string;
    description: string;
    expiresAt: string;
    status: string
}) {
    return post(`/api/tokenManage/addToken`, params);
}
// 修改token
interface editTokenParams {
    tokenId: number,
    expiresAt: string,
    tokenName: string,
    status: string,
    usageLimit: number,
    description: string
}
export async function editToken(params:editTokenParams) {
    return post(`/api/tokenManage/editToken`, params);
}
// 删除token
interface deleteTokenParams {
    tokenId: number,
}
export async function deleteToken(params:deleteTokenParams) {
    return post(`/api/tokenManage/deleteToken`, params);
}

export async function getAlbumList(params:{
    albumName?:string,
    current:number,
    pageSize:number
}) {
    return post(`/api/albumManage/getList`, params);
}