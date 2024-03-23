"use client";
import React, {useEffect, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Modal, Upload, Button, Card, Image, message} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import BedNameRadio from "@/components/bedNameRadio";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const App: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
    ]);
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };


    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>{
        newFileList.forEach((item)=>{
            console.log('处理',item)
        })
        setFileList(newFileList);

    }


    const uploadButton = (

        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    const showUploadList = {
            showDownloadIcon: true,
            downloadIcon: 'copy',
    }
    const onDownload = (file:UploadFile)=>{
        if (file.response.code===200){
            navigator.clipboard.writeText(file.response.data.url);
            message.success('复制图片地址成功');
        }
    }
    const [bedType, setBedType]= useState('');
    useEffect(()=>{
        setBedType(process.env["NEXT_PUBLIC_DEFAULT_BED"])
    },[])
    return (
        <>
            <BedNameRadio bedType={bedType} onChange={(e)=>setBedType((e.target as HTMLInputElement).value)}/>
            <Upload
                onDownload={onDownload}
                showUploadList={showUploadList}
                className="upload-list-inline"
                accept=".png, .jpg, .jpeg"
                action="/api/image-api"
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                data={{bedType:bedType}}
            >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>

                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default App;