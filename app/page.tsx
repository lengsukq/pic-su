"use client";
import React, {useEffect, useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {GetProp, UploadFile, UploadProps} from 'antd';
import {Button, Image, message, Modal, Upload} from 'antd';
import BedNameRadio from "@/components/bedNameRadio";
import {compressFile} from "@/utils/compressionFile";
import {PageContainer} from "@ant-design/pro-components";

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
        // newFileList.forEach(async (item)=>{
        //     console.log('处理',item)
        //     if (item.percent===0){
        //     }
        // })
        setFileList(newFileList);

    }
    // 图片压缩
    const beforeUpload= async (file:File) => {
        return await compressFile(file, 'image/jpeg')
    }

    const showUploadList = {
            showDownloadIcon: true,
            downloadIcon: 'copy',
    }
    const onDownload = (file:UploadFile)=>{
        if (file.response.code===200){
            navigator.clipboard.writeText(file.response.data.url).then();
            message.success('复制图片地址成功').then();
        }
    }
    const [bedType, setBedType]= useState('');
    useEffect(()=>{
        setBedType(process.env["NEXT_PUBLIC_DEFAULT_BED"])
    },[])
    return (
        <>
            <PageContainer
                extra={
                    <BedNameRadio bedType={bedType} onChange={(e)=>setBedType((e.target as HTMLInputElement).value)}/>
                }
            >
                <Upload
                    beforeUpload={beforeUpload}
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
            </PageContainer>



            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <Image alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default App;