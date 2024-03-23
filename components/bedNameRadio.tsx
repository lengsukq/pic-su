import React, {FormEventHandler} from 'react';
import {Flex, Radio} from 'antd';

const BedNameRadio: React.FC<{
    bedType: string,
    onChange:FormEventHandler<HTMLElement>
}> = ({bedType,onChange}) => (
    <Flex vertical gap="middle" onChange={onChange}>
        <Radio.Group buttonStyle="solid" value={bedType}>
            <Radio.Button value="BilibiliDaily">bilibili动态图床</Radio.Button>
            <Radio.Button value="IMGBB">IMGBB图床</Radio.Button>
            <Radio.Button value="SM">SM图床</Radio.Button>
        </Radio.Group>
    </Flex>
);

export default BedNameRadio;