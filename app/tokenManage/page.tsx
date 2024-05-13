'use client'
import type { ProColumns } from '@ant-design/pro-components';
import {
    EditableProTable,
    ProCard,
    ProFormField,
} from '@ant-design/pro-components';
import React, {useState,useRef} from 'react';
import {addToken, deleteToken, editToken, getTokensList} from "@/utils/client/apihttp";
import {Form, Input, App} from "antd";

type DataSourceType = {
    token_id: React.Key,
    token?: string,
    created_at?: string,
    expires_at?: string,
    token_name?: string,
    description?: string,
    status?: string,
    usage_limit?: number,
    current_usage?: number
};
const Page: React.FC = () => {
    const {message} = App.useApp();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const actionRef = useRef<any>();
    const [searchTokenName, setSearchTokenName] = useState<string>('');
    const columns: ProColumns<DataSourceType>[] = [
        {
            title: 'token名称',
            dataIndex: 'token_name',
            formItemProps: () => {
                return {
                    placeholder: '请输入token名称查询',
                    rules:[{ required: true, message: '请输入token名称' }]
                };
            },
            width: '15%',
        },
        {
            title: 'token',
            dataIndex: 'token',
            tooltip: '请勿随意泄漏你的token',
            readonly: true,
            width: '15%',
            hideInSearch: true,
            render: (text, record) => [
                <a  key='token'
                    onClick={() => {
                        // 点击事件处理逻辑
                        copyToClipboard(record.token as string)
                    }}
                >
                    {record.token}
                </a>,
            ],
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            valueType: 'select',
            hideInSearch: true,
            valueEnum: {
                enable: {
                    text: '启用',
                    status: 'enable',
                },
                disable: {
                    text: '禁用',
                    status: 'disable',
                },
            },
            formItemProps: () => {
                return {
                    rules:[{ required: true, message: '请选择状态' }]
                };
            },
        },
        {
            title: '描述',
            dataIndex: 'description',
            hideInSearch: true,
        },
        {
            title: '剩余次数',
            dataIndex: 'usage_limit',
            valueType: 'digit',
            hideInSearch: true,
            formItemProps: () => {
                return {
                    rules:[{ required: true, message: '请填写剩余次数' }]
                };
            },
        },
        {
            title: '使用次数',
            dataIndex: 'current_usage',
            readonly: true,
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'date',
            readonly: true,
            hideInSearch: true,
        },
        {
            title: '到期时间',
            dataIndex: 'expires_at',
            valueType: 'date',
            hideInSearch: true,
            formItemProps: () => {
                return {
                    rules:[{ required: true, message: '请选择到期时间' }]
                };
            },
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        actionRef.current.startEditable(record.token_id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={async () => {
                        if (record.token){
                            await deleteToken({tokenId: record.token_id as number}).then(res=>{
                                if(res.code==200){
                                    message.success(res.msg);
                                    action?.reload();
                                }
                            })
                        }else{
                            setDataSource(dataSource.filter((item) => item.token_id !== record.token_id));
                            message.success('删除成功');
                        }

                    }}
                >
                    删除
                </a>,
            ],
        },
    ];
    // 传入val值复制到剪贴板
    const copyToClipboard = (val: string) => {
        const input = document.createElement('input');
        input.value = val;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        message.success('复制成功')
    };
    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="token_id"
                headerTitle="Token管理"
                maxLength={11}
                scroll={{
                    x: 960,
                }}
                recordCreatorProps={
                    {
                        position: 'top',
                        record: () => ({ token_id: (Math.random() * 1000000).toFixed(0) }),
                    }
                }
                loading={false}
                toolBarRender={() => [
                    <Form>
                        <Form.Item name="search">
                            <Input.Search
                                placeholder="请输入token名称"
                                onSearch={(value) => {
                                    setSearchTokenName(value)
                                    // 手动触发搜索
                                    actionRef.current.reload();
                                }}
                                enterButton
                            />
                        </Form.Item>
                    </Form>,
                ]}
                columns={columns}
                pagination={{ pageSize:pageSize,current:current,showSizeChanger:true}}
                params={{
                    tokenName:searchTokenName,
                }}
                request={async (
                    // 第一个参数 params 查询表单和 params 参数的结合
                    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                    params
                ) => {
                    console.log('params',params)
                    let paramsData = {
                        tokenName:params.tokenName as string,
                        pageSize:params.pageSize as number,
                        current:params.current as number,
                    }

                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    // console.log('params',params)
                    const res = await getTokensList(paramsData);
                    if (res.code === 200){
                        setPageSize(params.pageSize as number);
                        setCurrent(params.current as number);

                    }
                    return {
                        data: res.data.record,
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: res.code === 200,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: res.data.total,
                    };
                }}
                actionRef={actionRef}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        // console.log('onSave',rowKey, data, row);
                        if (data.token){
                            await editToken({
                                tokenId: row.token_id as number,
                                tokenName: data.token_name as string,
                                description: data.description as string,
                                expiresAt: data.expires_at as string,
                                status: data.status as string,
                                usageLimit: data.usage_limit as number
                            }).then(res=>{
                                if(res.code === 200){
                                    message.success('编辑成功');
                                }
                            });
                        }else{
                            await addToken({
                                tokenName: data.token_name as string,
                                description: data.description as string || "",
                                expiresAt: data.expires_at as string,
                                status: data.status as string,
                                usageLimit: data.usage_limit as number
                            }).then(res=>{
                                if(res.code === 200){
                                    message.success(res.msg);
                                    actionRef.current.reload();
                                }
                            })
                        }

                    },
                    onChange: setEditableRowKeys,
                }}
            />
            <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
                <ProFormField
                    ignoreFormItem
                    fieldProps={{
                        style: {
                            width: '100%',
                        },
                    }}
                    mode="read"
                    valueType="jsonCode"
                    text={JSON.stringify(dataSource)}
                />
            </ProCard>
        </>
    );
};
export default Page;