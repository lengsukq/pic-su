'use client'
import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormText,
} from '@ant-design/pro-components';
import { Tabs, message, theme } from 'antd';
import React, { useState } from 'react';
import { Modal } from 'antd';
type LoginType = 'register' | 'account';

const Login = () => {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('account');


    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
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
                                name="mobile"
                                placeholder={'手机号'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入手机号！',
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: '手机号格式错误！',
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder={'请输入验证码'}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} 获取验证码`;
                                    }
                                    return '获取验证码';
                                }}
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入验证码！',
                                    },
                                ]}
                                onGetCaptcha={async () => {
                                    message.success('获取验证码成功！验证码为：1234');
                                }}
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