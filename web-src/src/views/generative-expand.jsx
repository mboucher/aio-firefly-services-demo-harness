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
import { Slider, View, Flex, TextArea, Button, Text, Image, Heading, ProgressCircle, Picker,Item } from '@adobe/react-spectrum';
import { setCurrentPageName, setEnableAPIConsole, setRequest, setResponse } from '../redux/app';
import AutomatedSegment from '@spectrum-icons/workflow/AutomatedSegment';
import ReadyState from '../assets/images/Ready.png';
import { callFireflyAPI } from '../services/firefly';
import { getRandomSeedValue } from '../services/firefly';
import ImageResults from '../components/results';
import { FIREFLY_BASE_URL } from '../utils/secrets';
import { displayError } from '../utils/toast-utils';
import FileUploader from '../components/upload-to-firefly';
import EmptyState from '../components/empty-state';
import WorkingState from '../components/working-state';

const GenerativeExpand = () => {
  const dispatch = useDispatch();
  const [resultState, setResultState] = useState('empty');
  const [selectedRatio, setSelectedRatio] = useState('square');
  const [prompt, setPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(4);
  const [imageResults, setImageResults] = useState([]);
  const [referenceId, setReferenceId] = useState('');
  const [maskId, setMaskId] = useState('');

  const sizes = {
    square: {width: 1024, height: 1024},
    landscape: {width: 1408, height: 1024},
    portrait: {width: 1024, height: 1408},
    widescreen: {width: 1792, height: 1024}
  }

  const body ={
    "prompt": "",
    "n": 4,
    "seeds": [],
    "size": {
      "height":1024,
      "width":1024
    },
    "image": {
      "id":""
    }
};


  
  useEffect(() => {
    dispatch(setCurrentPageName('Generative Expand API'));
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

    body.size = sizes[selectedRatio];

    
    const requestData = {
      method: 'POST',
      endpoint: `${FIREFLY_BASE_URL}/v1/images/expand`,
      headers: {
        Authorization: 'Bearer ***** Sanitized *****', 
        "Content-Type":"application/json", 
        "x-api-key":"***** Sanitized *****"
      },
      body: body
    }
    dispatch(setRequest(requestData));

    const results = await callFireflyAPI('/v1/images/expand',body);
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
                          <Slider width={'100%'} label='Number of images to generate'
                            minValue={1}
                            maxValue={4}
                            defaultValue={4}
                            onChange={setNumberOfImages}/>
                          <Picker label='Size' isRequired defaultSelectedKey={'square'} width={'100%'} onSelectionChange={(e) => setSelectedRatio(e)}>
                            <Item key={'square'}>Square (1:1)</Item>
                            <Item key={'landscape'}>Landscape (4:3)</Item>
                            <Item key={'portrait'}>Portrait (3:4)</Item>
                            <Item key={'widescreen'}>Widescreen (16:9)</Item>
                          </Picker>
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
                          <WorkingState message='Making the world bigger...'/>
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

export default GenerativeExpand
