import {
    ModalForm,
    ProForm,
    ProFormDateRangePicker,
    ProFormText,
} from '@ant-design/pro-components';
import {  Form, message } from 'antd';
import React, {FormEventHandler, useEffect, useRef} from "react";
import type { ProFormInstance } from '@ant-design/pro-components';
import {UserInfoInter} from '@/app'
const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const UserInfo: React.FC<{
    openUserInfo: boolean,
    setOpenUserInfo: Function,
    userInfo:UserInfoInter
}> = ({openUserInfo,setOpenUserInfo,userInfo})=>{
    console.log('userInfo',userInfo)
    const [form] = Form.useForm<UserInfoInter>();
    const formRef = useRef<ProFormInstance>();
    useEffect(()=>{
        formRef?.current?.setFieldsValue({
            username: userInfo.username,
            email: userInfo.email,
        });
    },[userInfo])
    const onOpenChange = (e:boolean)=>{
        setOpenUserInfo(e)
    }
    return (
        <ModalForm<UserInfoInter>
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
                await waitTime(2000);
                console.log(values);
                message.success('提交成功');
                return true;
            }}
        >
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="username"
                    label="用户名"
                    tooltip="最长为 24 位"
                    placeholder="请输入用户名"
                />

                <ProFormText
                    width="md"
                    name="email"
                    label="用户邮箱"
                    placeholder="请输入名称"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="contract"
                    label="合同名称"
                    placeholder="请输入名称"
                />
                <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
            </ProForm.Group>
        </ModalForm>
    );
};
export default UserInfo;