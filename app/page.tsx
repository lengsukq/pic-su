"use client";
import React, {useEffect, useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import type {GetProp, UploadFile, UploadProps} from 'antd';
import {Button, Flex, Image, message, Modal, Upload,Select,Tooltip } from 'antd';
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
import {Slider} from 'antd';
import {getAlbumList, getImageHosting} from "@/utils/client/apihttp";

const IntegerStep  : React.FC<{  inputValue: number;
    onChange: (newValue: number) => void;}>= ({inputValue, onChange}) => {

    return (
        <Slider className={'w-32'}
            tooltip={{formatter: (value) => `图片质量：${value}`}}
            min={1}
            max={10}
            onChange={onChange}
            value={inputValue}
        />
    );
};
const App: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [inputValue, setInputValue] = useState<number>(5);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };


    const handleChange: UploadProps['onChange'] = ({fileList: newFileList,file}) => {
        if (file.status === 'done' && file.response.code!==200){
            console.log('onChange',file);
            message.error(file.response.msg).then();
        }
        setFileList(newFileList);
    }
    // 图片压缩
    const beforeUpload = async (file: File) => {
        if (!bedType){
            message.error('请选择图床').then();
            return false;
        }
        return await compressFile(file, 'image/jpeg',inputValue/10)
    }

    const showUploadList = {
        showDownloadIcon: true,
        downloadIcon: 'copy',
    }
    const onDownload = (file: UploadFile) => {
        if (file.response.code === 200) {
            navigator.clipboard.writeText(file.response.data.url).then();
            message.success('复制图片地址成功').then();
        }
    }
    const [bedType, setBedType] = useState('');
    const [options, setOptions] = useState<{ value: string; label: string}[]>([]);
    const [albumId, setAlbumId] = useState('')
    const [albumList, setAlbumList] = useState<{ value: string; label: string}[]>([]);
    useEffect( () => {
        getImageHosting().then(res => {
            if (res.code === 200) {
                setOptions(res.data)
            }
        })
        getAlbumList({current: 1, pageSize: 10}).then(res => {
            if (res.code === 200) {
                setAlbumList(res.data.record);
            }
        })

    }, [])
    return (
        <>
            <PageContainer
                extra={
                    <>
                        <Select
                            showSearch
                            placeholder="请选择要上传的图床"
                            onChange={setBedType}
                            options={options}
                        />
                        <Select
                            fieldNames={
                                {
                                    value: 'album_id',
                                    label: 'album_name',
                                }
                            }
                            showSearch
                            placeholder="请选择要上传的相册"
                            onChange={setAlbumId}
                            options={albumList}
                        />
                    </>

                }
            >
                <IntegerStep inputValue={inputValue} onChange={(e:number)=>setInputValue(e)}/>

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
                    data={{bedType: bedType,albumId:albumId}}
                >
                    <Flex>
                        <Tooltip title={bedType === ''?"请先选择图床":''}>
                            <Button icon={<UploadOutlined/>} disabled={bedType === ''}>上传</Button>
                        </Tooltip>
                    </Flex>

                </Upload>
            </PageContainer>


            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <Image alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </>
    );
};

export default App;