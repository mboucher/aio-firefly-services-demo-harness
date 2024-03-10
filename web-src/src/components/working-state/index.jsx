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
import { ProgressCircle, Heading} from '@adobe/react-spectrum';

const WorkingState = ({message}) => {
    return (
        <>
            <ProgressCircle isIndeterminate size='L'/>
            <Heading level={1}>{message.length > 0 ? message : 'Generating something cool, hang on...'} </Heading>
        </>
    );
}


export default WorkingState;