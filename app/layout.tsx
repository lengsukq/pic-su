import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import "@/style/antd.scss"
import React from "react";
import MenuContainer from "./index"

const inter = Inter({subsets: ["latin"]});
// 引入antd组件 https://ant-design.antgroup.com/docs/blog/why-not-static-cn
import {ConfigProvider, App} from 'antd';

export const metadata: Metadata = {
    title: "图床",
    description: "图床管理",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="cn">
        <body className={inter.className}>
        {/*b站图片显示meta*/}
        <meta name="referrer" content="no-referrer"/>
        <ConfigProvider>
            <App>
                <MenuContainer>
                    {children}
                </MenuContainer>
            </App>
        </ConfigProvider>

        </body>
        </html>
    );
}
