'use client'
import {
    LockOutlined, MailOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProConfigProvider,
    ProFormText,
} from '@ant-design/pro-components';
import { Tabs, message, theme } from 'antd';
import React, {useEffect} from 'react';
import { useState } from 'react';
import {getBingImage, loginApi, userRegister} from "@/utils/client/apihttp";
import {useRouter} from "next/navigation";

type LoginType = 'register' | 'account';


const Page = () => {
    const [loginType, setLoginType] = useState<LoginType>('account');
    const router = useRouter()

    const register =async (val:any)=>{
        userRegister(val).then((res)=>{
            if (res.code===200){
                message.success(res.msg);
                setLoginType('account')
            }
        })
    }
    const login = async (val:any)=>{
        loginApi(val).then((res)=>{
            if (res.code===200){
                message.success(res.msg);
                router.push('/')

            }
        })
    }
    const [backgroundImage,setBackgroundImage] = useState('')
    useEffect(()=>{
        getBingImage().then(res=>{
            setBackgroundImage(res.data.url)
        })
    },[])
    const { token } = theme.useToken();
    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
                height: '100vh',
            }}
        >
            <LoginFormPage
                onFinish={loginType==='account'?(val)=>login(val):(val)=>register(val)}
                backgroundImageUrl={backgroundImage}
                logo="https://i.ibb.co/bKN1t8J/b-39d762806a8d59b0015a4c98927abaf8.jpg"
                // backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                title="Pic-Su"
                subTitle="一站式图片管理平台"
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
            </LoginFormPage>
        </div>
    );
};

export default function User() {
    return (
        <ProConfigProvider>
            <Page />
        </ProConfigProvider>
    );
};