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
import { Slider, View, Flex, TextArea, Button, Text, Image, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { setCurrentPageName, setEnableAPIConsole, setRequest, setResponse } from '../redux/app';
import AutomatedSegment from '@spectrum-icons/workflow/AutomatedSegment';
import { callFireflyAPI } from '../services/firefly';
import { getRandomSeedValue } from '../services/firefly';
import ImageResults from '../components/results';
import { FIREFLY_BASE_URL } from '../utils/secrets';
import { displayError } from '../utils/toast-utils';
import FileUploader from '../components/upload-to-firefly';
import EmptyState from '../components/empty-state';
import WorkingState from '../components/working-state';

const GenerativeFill = () => {
  const dispatch = useDispatch();
  const [resultState, setResultState] = useState('empty');
  const [prompt, setPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(4);
  const [imageResults, setImageResults] = useState([]);
  const [referenceId, setReferenceId] = useState('');
  const [maskId, setMaskId] = useState('');

  const body ={
    "prompt": "",
    "n": 4,
    "seeds": [],
    "image": {
      "id":""
    },
    "mask": {
      "id":""
    }
};


  
  useEffect(() => {
    dispatch(setCurrentPageName('Generative Fill API'));
    dispatch(setEnableAPIConsole(false));
  },[]);


  const onGenerate = async() => {

    if(prompt === '') {
      displayError('You must provide a prompt.');
      return;
    }
    setResultState('working');
    body.prompt = prompt;
    body.n = numberOfImages;
    const seeds = [];
    
    for (let i = 0; i < numberOfImages; i++) {
      const seedValue = getRandomSeedValue();
      seeds.push(seedValue);
    }
    body.seeds = seeds;
    body.image.id = referenceId;
    body.mask.id = maskId;

    
    const requestData = {
      method: 'POST',
      endpoint: `${FIREFLY_BASE_URL}/v1/images/fill`,
      headers: {
        Authorization: 'Bearer ***** Sanitized *****', 
        "Content-Type":"application/json", 
        "x-api-key":"***** Sanitized *****"
      },
      body: body
    }
    dispatch(setRequest(requestData));

    const results = await callFireflyAPI('/v1/images/fill',body);
    setImageResults(results.images);
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
                          <TextArea label='Prompt' width={'100%'} isRequired onChange={setPrompt}/>
                          <View>
                            <Text>Image</Text>
                            <FileUploader onFileUpload={setReferenceId}/>
                          </View>
                          <View>
                            <Text>Mask</Text>
                            <FileUploader onFileUpload={setMaskId}/>
                          </View>
                          <Slider width={'100%'} label='Number of images to generate'
                            minValue={1}
                            maxValue={4}
                            defaultValue={4}
                            onChange={setNumberOfImages}/>
                          <View paddingTop={'size-200'}>
                              <Button variant={'cta'} width={'size-1600'} onPress={onGenerate} isDisabled={resultState === 'working' ? true : false}>
                                <AutomatedSegment/>
                                <Text>Generate</Text>
                              </Button>
                          </View>
                      </Flex>
                  </View>
                  <View backgroundColor={'gray-200'} width={'100%'} height={'100%'}>
                  <Flex width={'100%'} height={'100%'} alignItems={'center'} direction={'row'}>
                    <Flex width={'100%'} direction={'column'}  alignItems={'center'}>
                        {resultState === 'empty' && 
                          <EmptyState/>
                        }
                        {resultState === 'working' &&
                          <WorkingState message='Generating pixels, uncovering reality...'/>
                        }
                        {resultState === 'done' &&
                            <ImageResults outputs={imageResults} aspectRatio={'square'}/>
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

export default GenerativeFill
