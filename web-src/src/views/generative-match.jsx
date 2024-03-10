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
import { Slider, View, Flex, TextArea, Picker, Item, Button, Text, Image, Heading, ProgressCircle, TagGroup } from '@adobe/react-spectrum';
import { setCurrentPageName, setEnableAPIConsole, setRequest, setResponse } from '../redux/app';
import AutomatedSegment from '@spectrum-icons/workflow/AutomatedSegment';
import ReadyState from '../assets/images/Ready.png';
import { callFireflyAPI } from '../services/firefly';
import { getRandomSeedValue } from '../services/firefly';
import ImageResults from '../components/results';
import StylePresets from '../data/presets.json';
import { FIREFLY_BASE_URL } from '../utils/secrets';
import { displayError } from '../utils/toast-utils';
import FileUploader from '../components/upload-to-firefly';
import WorkingState from '../components/working-state';
import EmptyState from '../components/empty-state';

const GenerativeMatch = () => {
  const dispatch = useDispatch();
  const [resultState, setResultState] = useState('empty');
  const [prompt, setPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(4);
  const [imageResults, setImageResults] = useState([]);
  const [selectedRatio, setSelectedRatio] = useState('square');
  const [contentClass, setContentClass] = useState('photo');
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [referenceId, setReferenceId] = useState('');



  const sizes = {
    square: {width: 1024, height: 1024},
    landscape: {width: 1152, height: 896},
    portrait: {width: 896, height: 1152},
    widescreen: {width: 1344, height: 768}
  }


  const body ={
    "prompt": "",
    "negativePrompt":"",
    "contentClass": "",
    "n": 4,
    "seeds": [],
    "size": {
        "width": 2048,
        "height": 2048
    },
    "photoSettings": {
        "aperture": 1.2,
        "shutterSpeed": 0.0005,
        "fieldOfView": 14
    },
    "styles": {
        "presets": [],
        "referenceImage": {
        "id": ""
        },
        "strength": 60
    },
    "visualIntensity": 6,
    "locale": "en-US"
};

  const onAddPreset = (item) => {
    var result = StylePresets.find(t=>t.id ===item);
    setSelectedPresets([...selectedPresets, result]);
  }

  const removeSelectedPreset = (keys) => {
    setSelectedPresets(prevItems => prevItems.filter((item) => !keys.has(item.id)));
  }
  
  useEffect(() => {
    dispatch(setCurrentPageName('Generative Match API'));
    dispatch(setEnableAPIConsole(false));
  },[]);


  const onGenerate = async() => {

    if(prompt === '') {
      displayError('You must provide a prompt.');
      return;
    }

    if(referenceId === '') {
      displayError('You must provide a reference image.');
      return;
    }

    setResultState('working');
    body.prompt = prompt;
    body.negativePrompt = negativePrompt;
    body.n = numberOfImages;
    const seeds = [];
    
    for (let i = 0; i < numberOfImages; i++) {
      const seedValue = getRandomSeedValue();
      seeds.push(seedValue);
    }
    body.seeds = seeds;
    body.contentClass = contentClass;
    body.styles.referenceImage.id = referenceId

    selectedPresets.map(preset => {
      body.styles.presets.push(preset.id);
    })
    
    body.size = sizes[selectedRatio];
    console.log(body);
    const requestData = {
      method: 'POST',
      endpoint: `${FIREFLY_BASE_URL}/v2/images/generate`,
      headers: {
        Authorization: 'Bearer ***** Sanitized *****', 
        "Content-Type":"application/json", 
        "x-api-key":"***** Sanitized *****"
      },
      body: body
    }
    dispatch(setRequest(requestData));

    try {
      const results = await callFireflyAPI('/v2/images/generate',body);
      setImageResults(results.outputs);
      dispatch(setResponse({status:200, body:results}));
      dispatch(setEnableAPIConsole(true));
      setResultState('done');
      
    } catch(e) {
      displayError(e.message);
      setResultState('empty');
    }
  }

  return (
    <View height={'100%'}>
        <Flex direction={'column'} height={'100%'}>
            <View height={'100%'}>
                <Flex direction={'row'} height={'100%'}>
                  <View width={'size-5000'} margin={'size-200'} overflow='scroll' paddingTop={'size-300'}>
                      <Flex direction={'column'} gap={'size-100'}>
                          <TextArea label='Prompt' width={'100%'} isRequired onChange={setPrompt}/>
                          <TextArea label='Negative Prompt' width={'100%'} onChange={setNegativePrompt}/>
                          <View>
                          <Text>Refrence image</Text>
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
                          <Picker label='Content Class' 
                            width={'100%'}
                            isRequired 
                            defaultSelectedKey={'photo'}
                            onSelectionChange={(e) => setContentClass(e)}>
                            <Item key={'photo'}>Photo</Item>
                            <Item key={'art'}>Art</Item>
                          </Picker>
                          <Picker label='Style Presets' items={StylePresets} onSelectionChange={onAddPreset} width={'100%'}>
                            {(item) => <Item key={item.id}>{item.name}</Item>}
                          </Picker>
                          <TagGroup items={selectedPresets} onRemove={removeSelectedPreset}>
                            {(item) => <Item key={item.id}>{item.name}</Item>}
                          </TagGroup>
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
                          <WorkingState message='Making something nice, please hold...'/>
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

export default GenerativeMatch
