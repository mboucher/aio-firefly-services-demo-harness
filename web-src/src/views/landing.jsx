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
import { useDispatch } from 'react-redux';
import { Flex, View } from '@adobe/react-spectrum';
import Card from '../components/card';
import TextToImage from '../assets/images/TextToImage.jpg';
import GenerativeMatch from '../assets/images/genMatch.jpg';
import RemoveBackground from '../assets/images/RemoveBackground.jpg';
import GenerativeFill from '../assets/images/genFill.jpg';
import GenerativeExpand from '../assets/images/Generative_Expand.jpg';
import CreateMask from '../assets/images/CreateMask.jpg';
import ProductCrop from '../assets/images/ProductCrop.jpg';
import { setCurrentPageName, setEnableAPIConsole } from '../redux/app';


const Landing = () => {
  const dispatch = useDispatch();

  // Set the page name to be displayed in the global nav.
  dispatch(setCurrentPageName('Firefly Services Demo Harness'));
  dispatch(setEnableAPIConsole(false));
  

  return (
      <View padding={'size-600'}>
        <Flex direction={'row'} gap={'size-200'} wrap alignItems={'start'}>
          <Card image={TextToImage} url='/api/TextToImage' label='Text to Image API' app='firefly'/>
          <Card image={GenerativeMatch} url='/api/GenerativeMatch' label='Generative Match API' app='firefly'/>
          <Card image={GenerativeFill} url='/api/GenerativeFill' label='Generative Fill API' app='firefly'/>
          <Card image={GenerativeExpand} url='/api/GenerativeExpand' label='Generative Expand API' app='firefly'/>
          <Card image={RemoveBackground} url='/api/RemoveBackground' label='Remove Background API' app='photoshop'/>
          <Card image={CreateMask} url='/api/CreateMask' label='Create Mask API' app='photoshop'/>
          <Card image={ProductCrop} url='/api/ProductCrop' label='Product Crop API' app='photoshop'/>
        </Flex>             
      </View>
  )
}

export default Landing;
