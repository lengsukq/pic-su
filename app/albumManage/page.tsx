'use client'
import React, {useState, useEffect} from 'react';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, Card} from 'antd';
import {getAlbumList} from "@/utils/client/apihttp";
import {Col, Row} from 'antd';

const {Meta} = Card;

// 假设你的数据类型是这样的
interface Item {
    album_name: string;
    description: string;
    album_id: string;
    cover_image_url: string | null,
    created_at: string,
    updated_at: string
}

const Page: React.FC = () => {
    const [data, setData] = useState<Item[]>([]);

    useEffect(() => {
        getAlbumListAct();
    }, []); // 空数组表示这个effect只在组件挂载时运行一次
    // 使用fetch API获取数据
    const getAlbumListAct = async () => {
        try {
            const res = await getAlbumList({current: 1, pageSize: 10})
            if (res.code === 200) {
                console.log('getAlbumList', res)
                setData(res.data.record);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // 如果数据还没有加载，显示加载信息
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Row gutter={[16,16]}>


                {data.map(item => (
                    <Col className="gutter-row" span={4} key={item.album_id} xs={24} md={12} lg={8} xl={4}>
                        <Card
                            // style={{width: 300, marginBottom: 20}}
                            cover={
                                <img
                                    alt="example"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                />
                            }
                            actions={[
                                <SettingOutlined key="setting"/>,
                                <EditOutlined key="edit"/>,
                                <EllipsisOutlined key="ellipsis"/>,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"/>}
                                title={item.album_name} // 使用列表项的数据
                                description={item.description} // 使用列表项的数据
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Page;