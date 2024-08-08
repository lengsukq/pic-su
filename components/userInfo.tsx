// 'use client'
import {
    ModalForm,
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import {  Form, message } from 'antd';
import React, {useRef} from "react";
import { ProFormInstance,ProFormDatePicker} from '@ant-design/pro-components';
import {editUserInfo, UserInfoInter} from "@/utils/client/apihttp";

const UserInfo: React.FC<{
    openUserInfo: boolean,
    setOpenUserInfo: Function,
    userInfo:UserInfoInter
}> = ({openUserInfo,setOpenUserInfo,userInfo})=>{
    // console.log('userInfo',userInfo)
    const [form] = Form.useForm<UserInfoInter>();
    const formRef = useRef<ProFormInstance>();
    const onOpenChange = (e:boolean)=>{
        setOpenUserInfo(e)
    }
    return (
        <ModalForm<UserInfoInter>
            request={()=> Promise.resolve(userInfo)}
            formRef={formRef}
            title="用户信息"
            open={openUserInfo}
            onOpenChange={onOpenChange}
            form={form}
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
                editUserInfo(values).then(res=>{
                    if(res.code === 200){
                        message.success(res.msg);
                        return true;
                    }
                })
            }}
        >
            <ProForm.Group>
                <ProFormText
                    disabled
                    width="md"
                    name="username"
                    label="用户昵称"
                    placeholder="请输入用户昵称"
                />

                <ProFormText
                    disabled
                    width="md"
                    name="email"
                    label="用户邮箱"
                    placeholder="请输入名称"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormDatePicker
                    disabled
                    width="md"
                    label="注册时间"
                    name="created_at"
                />
                <ProFormDatePicker
                    disabled
                    width="md"
                    label="更新日期"
                    name="updated_at"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText.Password
                    width="md"
                    name="SM_TOKEN"
                    label="SM图床Token"
                    tooltip="为空则禁用"
                    placeholder="请输入SM图床Token"
                />

                <ProFormText.Password
                    width="md"
                    name="IMGBB_API"
                    label="IMGBB图床API"
                    tooltip="为空则禁用"
                    placeholder="请输入IMGBB图床API"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText.Password
                    width="md"
                    name="BILIBILI_SESSDATA"
                    label="B站登录SESSDATA"
                    tooltip="为空则禁用"
                    placeholder="请输入B站登录SESSDATA"
                />

                <ProFormText.Password
                    width="md"
                    name="BILIBILI_CSRF"
                    label="B站登录CSRF"
                    tooltip="为空则禁用"
                    placeholder="请输入B站登录CSRF"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText.Password
                    width="md"
                    name="TG_URL"
                    label="Telegra的（代理）地址"
                    tooltip="为空则使用原始地址"
                    placeholder="请输入Telegra的（代理）地址"
                />
            </ProForm.Group>
        </ModalForm>
    );
};
export default UserInfo;