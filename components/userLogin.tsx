'use client'
import {
    LockOutlined,
    MobileOutlined,
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

const Login = () => {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('account');
    const login = async (val:any)=>{
        loginApi(val).then((res)=>{
            if (res.code===200){
                message.success(res.msg);
            }
        })
    }
    const register =async (val:any)=>{
        userRegister(val).then((res)=>{
            if (res.code===200){
                message.success(res.msg);
            }
        })
    }

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    onFinish={loginType==='account'?login:register}
                    logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
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
                                placeholder={'用户名: admin or user'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                    strengthText:
                                        'Password should contain numbers, letters and special characters, at least 8 characters long.',
                                    statusRender: (value) => {
                                        const getStatus = () => {
                                            if (value && value.length > 12) {
                                                return 'ok';
                                            }
                                            if (value && value.length > 6) {
                                                return 'pass';
                                            }
                                            return 'poor';
                                        };
                                        const status = getStatus();
                                        if (status === 'pass') {
                                            return (
                                                <div style={{ color: token.colorWarning }}>
                                                    强度：中
                                                </div>
                                            );
                                        }
                                        if (status === 'ok') {
                                            return (
                                                <div style={{ color: token.colorSuccess }}>
                                                    强度：强
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ color: token.colorError }}>强度：弱</div>
                                        );
                                    },
                                }}
                                placeholder={'密码: ant.design'}
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
                                    prefix: <MobileOutlined className={'prefixIcon'} />,
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
                                    prefix: <MobileOutlined className={'prefixIcon'} />,
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
                                    prefix: <MobileOutlined className={'prefixIcon'} />,
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
                <Login/>
            </Modal>
        </>
    );
};

export default UserLogin;