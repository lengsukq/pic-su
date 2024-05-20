'use client'
import React, {useState, useEffect} from 'react';
import {Image, Card, App, Popconfirm} from 'antd';
import {deletePic, getAlbumPics} from "@/utils/client/apihttp";
import {Col, Row} from 'antd';
import {useSearchParams} from "next/navigation";
import {convertDateFormat, copyToClipboard} from "@/utils/client/tools";
import {CopyTwoTone, DeleteTwoTone} from "@ant-design/icons";

const {Meta} = Card;

// 假设你的数据类型是这样的
interface Item {
    album_id: number;
    image_id: number,
    url: string,
    created_at: string,
    updated_at: string
}

const Page: React.FC = () => {
    const [data, setData] = useState<Item[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        getAlbumPicsAct();
    }, []); // 空数组表示这个effect只在组件挂载时运行一次
    // 使用fetch API获取数据
    const getAlbumPicsAct = async () => {
        try {
            const res = await getAlbumPics({albumId: searchParams.get('albumId') as string,current: 1, pageSize: 10})
            if (res.code === 200) {
                // console.log('getAlbumList', res)
                setData(res.data.record);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deletePicAct = async (item: Item) => {
        try {
            const res = await deletePic({imageId: item.image_id})
            if (res.code === 200) {
                message.success('删除成功')
                await getAlbumPicsAct()
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const {message} = App.useApp();

    const clickToCopy = (val: string) => {
        copyToClipboard(val)
        message.success('复制成功')
    };
    // 如果数据还没有加载，显示加载信息
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Row gutter={[16,16]}>
                {data.map(item => (

                    <Col className="gutter-row" span={4} key={item.image_id} xs={24} md={12} lg={8} xl={4}>
                        <Card
                            hoverable
                            cover={
                            <Image alt={item.created_at} src={item.url} className={'object-cover'} height={120} />
                        }
                            actions={[
                                <CopyTwoTone key="copy" onClick={() => clickToCopy(item.url)}/>,
                                <Popconfirm
                                    key="delete"
                                    title="提示"
                                    description="确定删除该图片吗？"
                                    onConfirm={() => deletePicAct(item)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <DeleteTwoTone/>
                                </Popconfirm>
                            ]}
                        >
                            <Meta
                                title={`上传于-${convertDateFormat(item.created_at)}`} description={
                                <div className={'cursor-pointer text-ellipsis overflow-hidden'} onClick={() => clickToCopy(item.url)}>
                                    {item.url}
                                </div>
                            }/>
                        </Card>
                    </Col>

                ))}
            </Row>
        </>
    );
};

export default Page;