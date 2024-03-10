/* ************************************************************************
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

import {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME} from './secrets';
import AWS from 'aws-sdk';

const getS3Client = () => {
    const options = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION,
        Bucket: AWS_BUCKET_NAME
        };
    AWS.config.update(options);
    return new AWS.S3();
}

export const listObjects = async (path) => {
    const s3 = getS3Client();
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Delimiter: '',
        Prefix: path
      };
   const data = await s3.listObjectsV2(params).promise();
   return data.Contents;
}

export const putObject = async (folder, file) => {
    const s3 = getS3Client();
    const upload = new AWS.S3.ManagedUpload({
        params:{
            Bucket: AWS_BUCKET_NAME,
            Key: `${folder}/${file.name}`,
            Body: file
        }
    });
   return upload.promise();
}


export const getSignedURL = async (operation, path) => {
    const s3 = getS3Client();
    const options = {
        Bucket: AWS_BUCKET_NAME,
        Key: path,
        Expires: 3600
    };

    const url = await s3.getSignedUrlPromise(operation, options);
    return url;
    
}



