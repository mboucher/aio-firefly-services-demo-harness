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

import { generateIMSToken } from "../utils/ims-client";
import { FIREFLY_API_KEY, FIREFLY_BASE_URL } from "../utils/secrets";
import { displayError } from "../utils/toast-utils";

/**
 * Function that dynamically builds the header needed to execute Firefly API calls
 * @returns {FireflyAPIHeader} an HTTP header object which includes a generated access token.
 */
const buildHeader = async () => {
  const accessToken = await generateIMSToken();
  const header = {
    "x-api-key": FIREFLY_API_KEY,
    "Authorization": `Bearer ${accessToken}`
  };

  return header;
};

/**
 * Convenience function that can be used to generate random seed values.
 * @returns {Number} Random seed number between 1 & 999999.
 */
export const getRandomSeedValue = () => {
  const min = 1;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Global convenience function used to upload transient assets to Firefly backend.
 * @param {File} file to upload
 * @returns {String} The reference ID for the uploaded file.
 */
export const uploadToFirefly = async (file) => {

  const header = await buildHeader();
  header['Content-Type'] = file.type;

  const requestInfo = {
    method: "POST",
    headers: header
  };
  
  requestInfo.body = file;
  const payload = await fetch(`${FIREFLY_BASE_URL}/v2/storage/image`,requestInfo);
  const results = await payload.json();
  return results.images[0].id;

}

/**
 * Function used to execute HTTP requests to Firefly API. Uses the built-in Node Fetch javascript library
 * @param {String} endpoint - The API endpoint (e.g. /v2/images/generate for the Text to Image API) 
 * @param {Object} body - The content that will be sent to the API. This can be JSON, or a binary file
 */
export const callFireflyAPI = async(endpoint, body) => {
  try {
    const header = await buildHeader();
    header['Content-Type'] = 'application/json'
    
    const requestParams = {
      headers: header,
      method:'POST',
      body: JSON.stringify(body)
    };

    const res = await fetch(`${FIREFLY_BASE_URL}${endpoint}`,requestParams);
  
    if (res.status === 200) {
      const payload = await res.json();
      return payload;
    } else {  
      const payload = await res.json();
      console.log(`Firefly API Error: ${payload.error_code} - ${payload.message}`);
      throw new Error(`Firefly API Error: ${payload.error_code} - ${payload.message}`);
    }
  } catch (err) {
    console.log(err);
    displayError(`Firefly API Error: ${err.message}`);
  }
}


