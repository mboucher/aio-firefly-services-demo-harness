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
import { View, Flex, Image } from '@adobe/react-spectrum';
import XRayConsole from '../console';


const ImageResults = ({outputs, aspectRatio}) => {
  

  const getHeight = () => {
    switch (aspectRatio) {
      case 'square':
        return 360;
      case 'landscape':
        return 299;
      case 'portrait':
        return 384;
      case 'widescreen':
        return 256;
      default:
        return '100%'
    }
  }

  const getWidth = () => {
    switch (aspectRatio) {
      case 'square':
        return 360;
      case 'landscape':
        return 384;
      case 'portrait':
        return 299;
      case'widescreen':
        return 448;
      default:
        return '100%'
    }
  }
  
  return (
    <View paddingStart={'size-400'} paddingEnd={'size-400'}>
      <Flex direction={'row'} gap={'size-300'} wrap>
        {outputs.map((item) => {
          return(
            <Image src={item.image.presignedUrl} width={getWidth()} height={getHeight()}/>
          )
        })}
      </Flex>
    </View>
  )
};

export default ImageResults;
