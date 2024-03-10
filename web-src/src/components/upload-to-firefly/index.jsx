/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

import React, { useState } from 'react';
import {  
    IllustratedMessage, 
    Image,  
    ProgressCircle,
    Text
} from '@adobe/react-spectrum';
import Upload from '@spectrum-icons/illustrations/Upload';
import { DropZone } from '@react-spectrum/dropzone';
import { displayError } from '../../utils/toast-utils';
import { uploadToFirefly } from '../../services/firefly';
import { Flex, LabeledValue } from '@adobe/react-spectrum';

const FileUploader = ({onFileUpload}) => {
    const [filledSrc, setFilledSrc] = React.useState(null);
    const [refId, setRefId] = useState(null);
    const [busyState, setBusyState] = useState(false);
    
    const uploadFile = async (file) => {
        try {
            setBusyState(true);
            const ref = await uploadToFirefly(file);
            setRefId(ref);
            onFileUpload(ref);
        } catch (e) {
            displayError(`Upload to Firefly Error: ${e}`);
        } finally {
            setBusyState(false);
        }
    }
    
    const handleObjectDrop = (images) => {
        images.items.find(async (item) => {
            if(item.kind === 'file') {
                if(item.type === 'image/jpeg' || item.type === 'image/png') {
                    const file = await item.getFile();
                    setFilledSrc(URL.createObjectURL(file));
                    uploadFile(file);
                } 
            } else {
                return;
            }
        });
    }

    return (
        <Flex direction={'column'} width={'100%'} >
            {busyState ? 
                <Flex direction={'row'} width={'100%'} alignItems={'center'}>
                    <ProgressCircle isIndeterminate/>
                </Flex>
            :
                <div className='dropzone-container'>
                    <DropZone
                    className={'spectrum-dropzone'}
                    isFilled={!!filledSrc}
                    getDropOperation={(types) => {
                        return types.has('image/jpeg') || types.has('image/png') ? 'copy' : 'cancel';
                    }}
                    onDrop={(e)=> handleObjectDrop(e)}>
                        {filledSrc
                        ? <Image src={filledSrc} alt='Reference Image'/>
                        : (<IllustratedMessage> 
                            <Upload />
                        </IllustratedMessage>
                        )}
                    </DropZone>
                </div>
            }
            
            {refId &&
                <LabeledValue labelPosition="side" label='Image Id' value={refId}/>
            }
        </Flex>
        
    );
}

export default FileUploader;