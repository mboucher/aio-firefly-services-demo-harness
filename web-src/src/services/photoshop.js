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


import {getSignedURL, putObject} from '../utils/aws-client';
import { PS_BASE_URL, PS_CLIENT_ID } from '../utils/secrets';
import { displayError } from '../utils/toast-utils';
import { v4 as uuidv4 } from 'uuid';
import { generateIMSToken } from '../utils/ims-client';

/**
 * Global convenience function used to upload transient assets to AWS S3.
 * @param {File} file to upload
 * @returns {String} The reference ID for the uploaded file.
 */
export const uploadToS3 = async (file) => {
    try {
        await putObject('demo', file);
        const signedUrl = await getSignedURL('getObject', `demo/${file.name}`);
        return signedUrl;
    } catch (e) {
        displayError(`AWS S3 Error: ${e.message}`);
    }
}

/**
 * Function that dynamically builds the header needed to execute Firefly API calls
 * @returns {FireflyAPIHeader} an HTTP header object which includes a generated access token.
 */
const buildHeader = async () => {
    const accessToken = await generateIMSToken('ps');
    const header = {
      "x-api-key": PS_CLIENT_ID,
      "Authorization": `Bearer ${accessToken}`
    };
  
    return header;
  };

/**
 * Function used to execute HTTP requests to Firefly API. Uses the built-in Node Fetch javascript library
 * @param {String} endpoint - The API endpoint (e.g. /v2/images/generate for the Text to Image API) 
 * @param {Object} body - The content that will be sent to the API. This can be JSON, or a binary file
 */
export const callPhotoshopAPI = async(endpoint, body) => {
    try {
      const header = await buildHeader();
      header['Content-Type'] = 'application/json'
      
      const requestParams = {
        headers: header,
        method:'POST',
        body: JSON.stringify(body)
      };
  
      const res = await fetch(`${PS_BASE_URL}${endpoint}`,requestParams);
      console.log(res.status);
      if (res.status === 200 || res.status === 202) {
        const payload = await res.json();
        console.log(payload);
        let working = true;
        while (working) {
            requestParams.method = 'GET';
            requestParams.body = null;
            const res = await fetch(payload['_links'].self.href, requestParams);
            const job = await res.json();
            if(job.status) {
              //Single job
              if(job.status === 'succeeded') {
                return job;
              }
            } else if(job.outputs[0].status === 'succeeded') {
              // Batch job
                return job;
            } else {
              await delay(1000);
            }
        }
        
      } else {  
        const payload = await res.json();
        console.log(`Photoshop API Error: ${payload.error_code} - ${payload.message}`);
        displayError(`Photoshop API Error: ${payload.error_code} - ${payload.message}`);
      }
    } catch (err) {
      console.log(err);
      displayError(`Photoshop API Error: ${err.message}`);
    }
  }
  

const delay = ms => new Promise(res => setTimeout(res, ms));

export const getUUID = () => {
    return uuidv4();
}

