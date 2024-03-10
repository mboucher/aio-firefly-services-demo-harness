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
import { Link } from 'react-router-dom';
import {Heading, Image, Flex, View} from '@adobe/react-spectrum';
import FireflyIcon from './logos/Firefly.png';
import PhotoshopIcon from './logos/Photoshop.png';

const Card = ({image, url, label, app}) => {
  return (
    <Link className='demo-card' to={url}>
      <View borderWidth={'thick'} width={'size-3600'} borderRadius={'medium'} borderColor={'gray-200'} overflow={'hidden'} >
          <Image src={image} width={'size-3600'} height={'size-3600'} objectFit={'cover'}/>
          <View paddingStart={'size-100'} paddingEnd={'size-100'}>
              <Flex direction={'row'} gap={'size-200'} alignItems={'center'}>
                <Image height={'size-500'} width={'size-500'} src={app === 'firefly' ? FireflyIcon : PhotoshopIcon}/>
                <Heading>{label}</Heading>
              </Flex>
          </View>
      </View>
    </Link>
  )
}

export default Card;
