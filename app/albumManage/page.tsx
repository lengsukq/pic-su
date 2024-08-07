'use client'
import React, {useState, useEffect, useRef} from 'react';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Card, Image} from 'antd';
import {addAlbum, addAlbumInter, getAlbumList} from "@/utils/client/apihttp";
import {Col, Row, Statistic,Tooltip} from 'antd';
import {useRouter} from "next/navigation";
import {convertDateFormat} from "@/utils/client/tools";
import {PageContainer, ProFormInstance} from "@ant-design/pro-components";
import {ModalForm, ProFormText,ProFormTextArea} from '@ant-design/pro-components';
import {Button, message} from 'antd';

const {Meta} = Card;

// 假设你的数据类型是这样的
interface Item {
    image_count: string;
    album_name: string;
    description: string;
    album_id: string;
    cover_image_url: string | null,
    createdAt: string,
    updated_at: string,
    album_cover: string,
}

const Page: React.FC = () => {
    const router = useRouter()

    const [data, setData] = useState<Item[]>([]);
    const checkPics = (item: { album_id: string }) => {
        router.push(`/albumManage/albumPics?albumId=${item.album_id}`)
    }
    useEffect(() => {
        getAlbumListAct();
    }, []); // 空数组表示这个effect只在组件挂载时运行一次
    const getAlbumListAct = async () => {
        try {
            const res = await getAlbumList({current: 1, pageSize: 1000})
            if (res.code === 200) {
                setData(res.data.record);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const formRef = useRef<ProFormInstance>();
    // 如果数据还没有加载，显示加载信息
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <PageContainer
            extra={
                <ModalForm
                    title="新增相册"
                    trigger={<Button type="primary">新增相册</Button>}
                    submitter={{
                        searchConfig: {
                            submitText: '确认',
                            resetText: '取消',
                        },
                    }}
                    formRef={formRef}
                    onFinish={async (values:addAlbumInter) => {
                        return await addAlbum(values).then(res => {
                            if (res.code === 200) {
                                message.success('提交成功');
                                getAlbumListAct();
                                formRef.current?.resetFields();
                                return true; // 在这里返回 true
                            } else {
                                // 如果 addAlbum 失败，可以在这里处理错误
                                message.error('提交失败');
                                return false;
                            }
                        });
                    }}
                >
                    <ProFormText
                        width="md"
                        name="albumCover"
                        label="相册封面图片链接"
                        tooltip={'若不输入，则随机生成封面'}
                        placeholder="请输相册封面图片链接"
                    />
                    <ProFormText
                        width="md"
                        name="albumName"
                        label="相册名称"
                        placeholder="请输相册入名称"
                        rules={[{ required: true, message: '请输入相册名称' }]}
                    />

                    <ProFormTextArea
                        width="md"
                        name="description"
                        label="相册描述"
                        placeholder="请输入相册描述"
                        rules={[{ required: true, message: '请输入相册描述' }]}
                    />
                </ModalForm>
            }>
            <Row gutter={[16, 16]}>
                {data.map(item => (
                    <Col className="gutter-row" span={4} key={item.album_id} xs={24} md={12} lg={8} xl={4}>
                        <Card onClick={() => checkPics(item)}
                            // style={{width: 300, marginBottom: 20}}
                              cover={
                                  <Image alt={item.createdAt} src={item.album_cover} className={'object-cover'}
                                         height={120}/>
                              }
                              actions={[
                                  <SettingOutlined key="setting"/>,
                                  <EditOutlined key="edit"/>,
                                  <EllipsisOutlined key="ellipsis"/>,
                              ]}
                        >
                            <Meta
                                avatar={
                                    <Statistic title={convertDateFormat(item.createdAt)} value={item.image_count}
                                               valueStyle={{fontSize: '16px'}} suffix="/无限" prefix={<></>}/>
                                }
                                title={item.album_name} // 使用列表项的数据
                                description={
                                    <Tooltip title={item.description}>
                                        <span className={'cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap'}>{item.description}</span>
                                    </Tooltip>

                                } // 使用列表项的数据
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </PageContainer>
    );
};

export default Page;