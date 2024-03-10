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

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Flex, Button, Text } from '@adobe/react-spectrum';
import { setCurrentPageName, setEnableAPIConsole, setRequest, setResponse } from '../redux/app';
import ImageResults from '../components/results';
import { PS_BASE_URL } from '../utils/secrets';
import { displayError } from '../utils/toast-utils';
import FileUploader from '../components/upload-to-s3';
import { getSignedURL } from '../utils/aws-client';
import { callPhotoshopAPI, getUUID } from '../services/photoshop';
import EmptyState from '../components/empty-state';
import WorkingState from '../components/working-state';
import Erase from '@spectrum-icons/workflow/Erase';

const RemoveBackground = () => {
  const dispatch = useDispatch();
  const [resultState, setResultState] = useState('empty');
  const [selectedRatio, setSelectedRatio] = useState('square');
  const [imageResults, setImageResults] = useState([]);
  const [referenceId, setReferenceId] = useState('');


  const body ={
    "input": {
      "href": "",
      "storage": "external"
    },
    "options": {
      "optimize": "performance",
      "process": {
        "postprocess": true
      },
      "service": {
        "version": "4.0"
      }
    },
    "output": {
      "href": "",
      "storage": "external",
      "overwrite": true,
      "color": {
        "space": "rgb"
      },
      "mask": {
        "format": "soft"
      }
    }
  };


  
  useEffect(() => {
    dispatch(setCurrentPageName('Remove Background API'));
    dispatch(setEnableAPIConsole(false));
  },[]);


  const onGenerate = async() => {

    if(referenceId === '') {
      displayError('Oops, you forgot to provide a file.');
      return;
    }

    const extension = referenceId.url.split('.')[1];

    const fileId = `${getUUID()}.${extension}`;

    setResultState('working');
    const outputUrl = await getSignedURL('putObject', `demo/${fileId}`);

    body.input.href = referenceId.url
    body.output.href = outputUrl;

    
    const requestData = {
      method: 'POST',
      endpoint: `${PS_BASE_URL}/sensei/cutout`,
      headers: {
        Authorization: 'Bearer ***** Sanitized *****', 
        "Content-Type":"application/json", 
        "x-api-key":"***** Sanitized *****"
      },
      body: body
    }
    dispatch(setRequest(requestData));

    const results = await callPhotoshopAPI('/sensei/cutout', body);
    const resultUrl = await getSignedURL('getObject',`demo/${fileId}`);
    console.log(resultUrl);
    setImageResults([{image:{presignedUrl:resultUrl}}]);
    dispatch(setResponse({status:200, body:results}));
    dispatch(setEnableAPIConsole(true));
    setResultState('done');
  }

  return (
    <View height={'100%'}>
        <Flex direction={'column'} height={'100%'}>
            <View height={'100%'}>
                <Flex direction={'row'} height={'100%'}>
                  <View width={'size-3400'} margin={'size-200'} overflow='scroll' paddingTop={'size-300'}>
                      <Flex direction={'column'} gap={'size-100'}>
                          <View>
                            <Text>Image</Text>
                            <FileUploader onFileUpload={setReferenceId}/>
                          </View>
                          <View paddingTop={'size-200'}>
                            <Button variant={'cta'} width={'size-2400'} onPress={onGenerate} isDisabled={resultState === 'working' ? true : false}>
                              <Erase/>
                              <Text>Remove Background</Text>
                            </Button>
                          </View>
                          
                      </Flex>
                  </View>
                  <View backgroundColor={'gray-200'} width={'100%'} height={'100%'}>
                  <Flex width={'100%'} height={'100%'} alignItems={'center'} direction={'row'}>
                    <Flex width={'100%'} direction={'column'}  alignItems={'center'}>
                        {resultState === 'empty' && 
                          <EmptyState text='Start by providing an asset'/>
                        }
                        {resultState === 'working' &&
                          <WorkingState message='Doing some magic, abracadabra...'/>
                        }
                        {resultState === 'done' &&
                            <ImageResults outputs={imageResults} aspectRatio={selectedRatio}/>
                        }
                    </Flex>
                  </Flex>
                  </View>
                </Flex>
            </View>
        </Flex>
    </View>
  );
}

export default RemoveBackground
