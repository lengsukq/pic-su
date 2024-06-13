'use client'
import React, {useState, useEffect} from 'react';
import {Image, Card, App, Popconfirm, Divider, List, Skeleton} from 'antd';
import {deletePic, getAlbumPics} from "@/utils/client/apihttp";
import {useSearchParams} from "next/navigation";
import {convertDateFormat, copyToClipboard} from "@/utils/client/tools";
import {CopyTwoTone, DeleteTwoTone} from "@ant-design/icons";
import InfiniteScroll from 'react-infinite-scroll-component';

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
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        getAlbumPicsAct().then();
    }, []); // 空数组表示这个effect只在组件挂载时运行一次
    // 使用fetch API获取数据
    const getAlbumPicsAct = async () => {
        console.log('getAlbumPicsAct')
        try {
            if (loading) {
                return;
            }
            const res = await getAlbumPics({
                albumId: searchParams.get('albumId') as string,
                current: current,
                pageSize: 20
            })
            if (res.code === 200) {
                setCurrent(current + 1)
                setData([...data, ...res.data.record]);
                if (res.data.record.length < 20) {
                    setLoading(true);
                }

            }

        } catch (error) {
            setLoading(true);
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
            <InfiniteScroll
                dataLength={data.length}
                next={getAlbumPicsAct}
                hasMore={!loading}
                loader={<Skeleton paragraph={{ rows: 1 }}  />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    dataSource={data}
                    grid={{
                        // gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6,
                    }}
                    renderItem={(item) => (
                        <Card
                            className={'m-2'}
                            hoverable
                            cover={
                                <Image alt={item.created_at} src={item.url} className={'object-cover'}
                                       height={120}/>
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
                                <div
                                    className={'cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap'}
                                    onClick={() => clickToCopy(item.url)}>
                                    {item.url}
                                </div>
                            }/>
                        </Card>
                    )}
                />

            </InfiniteScroll>
        </>
    );
};

export default Page;