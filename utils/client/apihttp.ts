import {get, post} from "./fetchUtil";
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
    status: string;
    albumPermissions:string | null
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
    description: string,
    albumPermissions:string | null
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

// 获取相册图片
export interface getAlbumPicsParams {
    albumId?:string,
    current:number,
    pageSize:number
}
export async function getAlbumPics(params:getAlbumPicsParams) {
    return post(`/api/albumManage/getAlbumPics`, params);
}
// 删除token
interface deletePicParams {
    imageId: number,
}
// 删除图片
export async function deletePic(params:deletePicParams) {
    return post(`/api/albumManage/deletePic`, params);
}
// 获取用户信息
export async function getUserInfo() {
    return post(`/api/user/getUserInfo`);
}
export interface UserInfoInter {
    username: string;
    email: string;
    created_at:string;
    updated_at:string;
    SM_TOKEN:string | null;
    BILIBILI_SESSDATA:string | null;
    BILIBILI_CSRF:string | null;
    IMGBB_API:string | null;
    TG_URL:string | null;
}
// 修改用户信息
export async function editUserInfo(params:UserInfoInter) {
    return post(`/api/user/editUserInfo`, params);
}
// 获取所有启用的图床
export async function getImageHosting() {
    return post(`/api/image-api/getImageHosting`);
}