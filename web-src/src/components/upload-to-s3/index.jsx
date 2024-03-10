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

import React from 'react';
import {  
    IllustratedMessage, 
    Image, 
    Text,
    ProgressCircle,
    Flex
} from '@adobe/react-spectrum';
import Upload from '@spectrum-icons/illustrations/Upload';
import { DropZone } from '@react-spectrum/dropzone';
import { displayError } from '../../utils/toast-utils';
import { uploadToS3 } from '../../services/photoshop';

const FileUploader = ({onFileUpload}) => {
    const [filledSrc, setFilledSrc] = React.useState(null);
    const [busyState, setBusyState] = React.useState(false);
    
    const uploadFile = async (file) => {
        try {
            setBusyState(true);
            const signedUrl = await uploadToS3(file);
            onFileUpload({fileName: file.name, url: signedUrl});
        } catch (e) {
            displayError(`Upload to AWS Error: ${e}`);
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
        <div className='dropzone-container'>
            {busyState ? 
                <Flex direction={'row'} width={'100%'} alignItems={'center'}>
                    <ProgressCircle isIndeterminate/>
                </Flex>
            :
                <DropZone
                isFilled={!!filledSrc}
                getDropOperation={(types) => {
                    return types.has('image/jpeg') || types.has('image/png') ? 'copy' : 'cancel';
                }}
                onDrop={(e)=> handleObjectDrop(e)}>
                    {filledSrc
                    ? <Image src={filledSrc} alt='Reference Image'/>
                    : (<IllustratedMessage alt='empty image'> 
                        <Upload alt='test'/>
                        <Text>Drag and drop files</Text>
                    </IllustratedMessage>
                    )}
                </DropZone>
            }
        </div>
        
    );
}

export default FileUploader;