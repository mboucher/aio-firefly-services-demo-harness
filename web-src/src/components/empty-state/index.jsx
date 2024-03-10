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


import React from 'react';
import {Flex, Image, Heading, Text} from '@adobe/react-spectrum';
import ReadyState from '../../assets/images/Ready.png';

const EmptyState = ({heading,text}) => {
    return (
        <Flex direction={'column'} alignItems={'center'} width={'size-5000'}>
            <Image src={ReadyState}/>
            <Heading level={1}>{heading ? heading : 'Nothing to show yet'}</Heading>
            <Text>{text ? text : 'Start by entering a prompt...'}</Text>
        </Flex>
    );
}


export default EmptyState;
