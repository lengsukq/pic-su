'use client'
import type { ProColumns } from '@ant-design/pro-components';
import {
    EditableProTable,
    ProCard,
    ProFormField,
    ProFormRadio,
} from '@ant-design/pro-components';
import React, {useState,useRef} from 'react';
import {addToken, deleteToken, editToken, getTokensList} from "@/utils/client/apihttp";
import {message} from "antd";

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
type ParamsType = {
    current: number,
    pageSize: number,
    tokenName: string,
}

const Page: React.FC = () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
        'top',
    );
    const [pageSize, setPageSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const actionRef = useRef<any>();
    const columns: ProColumns<DataSourceType>[] = [
        {
            title: 'token名称',
            dataIndex: 'token_name',
            formItemProps: () => {
                return {
                    rules:[{ required: true, message: '请输入token名称' }]
                };
            },
            width: '15%',
        },
        {
            title: 'token',
            dataIndex: 'token',
            tooltip: '只读，使用form.getFieldValue可以获取到值',
            readonly: true,
            width: '15%',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            valueType: 'select',
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
        },
        {
            title: '剩余次数',
            dataIndex: 'usage_limit',
            valueType: 'digit',
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
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'date',
            readonly: true,
        },
        {
            title: '到期时间',
            dataIndex: 'expires_at',
            valueType: 'date',
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

                        action?.startEditable?.(record.token_id);
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
                        position: position as 'top',
                        record: () => ({ token_id: (Math.random() * 1000000).toFixed(0) }),
                    }
                }
                loading={false}
                toolBarRender={() => [
                    <ProFormRadio.Group
                        key="render"
                        fieldProps={{
                            value: position,
                            onChange: (e) => setPosition(e.target.value),
                        }}
                        options={[
                            {
                                label: '添加到顶部',
                                value: 'top',
                            },
                            {
                                label: '添加到底部',
                                value: 'bottom',
                            },
                            {
                                label: '隐藏',
                                value: 'hidden',
                            },
                        ]}
                    />,
                ]}
                columns={columns}
                pagination={{ pageSize:pageSize,current:current,showSizeChanger:true}}
                params={{tokenName:''}}
                request={async (
                    // 第一个参数 params 查询表单和 params 参数的结合
                    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                    params
                ) => {
                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    const res = await getTokensList(params as ParamsType);
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
                        console.log('onSave',rowKey, data, row);
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