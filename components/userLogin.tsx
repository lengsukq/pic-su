'use client'
import {
    LockOutlined,
    MailOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormText,
} from '@ant-design/pro-components';
import { Tabs, message, theme } from 'antd';
import React, { useState } from 'react';
import { Modal } from 'antd';
import {loginApi, userRegister} from "@/utils/client/apihttp";
type LoginType = 'register' | 'account';

const Login: React.FC<{login:Function}> = ({login}) => {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('account');
    const register =async (val:any)=>{
        userRegister(val).then((res)=>{
            if (res.code===200){
                message.success(res.msg);
                setLoginType('account')
            }
        })
    }
    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    onFinish={loginType==='account'?(val)=>login(val):(val)=>register(val)}
                    logo="https://i.ibb.co/bKN1t8J/b-39d762806a8d59b0015a4c98927abaf8.jpg"
                    title="Pic-Su"
                    subTitle="一站式图片管理平台"
                    submitter={{ searchConfig: { submitText: loginType==='account'?'登录': '注册', }}}
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                    >
                        <Tabs.TabPane key={'account'} tab={'登录'} />
                        <Tabs.TabPane key={'register'} tab={'注册'} />
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'请输入用户名或邮箱'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名或邮箱!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'register' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                name="username"
                                placeholder={'用户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名！',
                                    },
                                ]}
                            />
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MailOutlined className={'prefixIcon'} />,
                                }}
                                name="email"
                                placeholder={'邮箱'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入邮箱！',
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/,
                                        message: '邮箱格式错误！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                name="password"
                                placeholder={'密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                            />
                        </>
                    )}
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};



const UserLogin: React.FC<{
    openLogin: boolean,
    onChange:Function
}> = ({openLogin,onChange}) => {
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            onChange(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        onChange(false);
    };
    const login = async (val:any)=>{
        loginApi(val).then((res)=>{
            if (res.code===200){
                message.success(res.msg);
                onChange(false);
            }
        })

    }

    return (
        <>
            <Modal
                footer={null}
                title=""
                open={openLogin}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Login login={login}/>
            </Modal>
        </>
    );
};

export default UserLogin;