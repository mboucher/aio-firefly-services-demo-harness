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
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {defaultTheme, Flex, Provider, View} from '@adobe/react-spectrum';
import GlobalNav from './components/global-nav';
import { useSelector } from 'react-redux';
import Landing from './views/landing';
import TextToImage from './views/text-to-image';
import GenerativeMatch from './views/generative-match';
import GenerativeFill from './views/generative-fill';
import GenerativeExpand from './views/generative-expand';
import RemoveBackground from './views/remove-background';
import { ToastContainer } from '@react-spectrum/toast';
import './app.css';
import CreateMask from './views/create-mask';
import ProductCrop from './views/product-crop';

const App = () => {
  const darkMode = useSelector((state) => state.app.darkMode);

  return (
    <BrowserRouter>
      <Provider colorScheme={darkMode ? 'dark' : 'light'} theme={defaultTheme} height={'100%'}>
        <ToastContainer/>
        <Flex direction={'column'} height={'100%'} width={'100%'}>
          <View borderBottomWidth={'thin'} borderBottomColor={'gray-300'}>
            <GlobalNav/>
          </View>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path='/api/TextToImage' element={<TextToImage/>} />
              <Route path='/api/GenerativeMatch' element={<GenerativeMatch/>}/>
              <Route path='/api/GenerativeFill' element={<GenerativeFill/>}/>
              <Route path='/api/GenerativeExpand' element={<GenerativeExpand/>}/>
              <Route path='/api/RemoveBackground' element={<RemoveBackground/>}/>
              <Route path='/api/CreateMask' element={<CreateMask/>}/>
              <Route path='/api/ProductCrop' element={<ProductCrop/>}/>
            </Routes>
        </Flex>
      </Provider>
    </BrowserRouter>
  );
}
export default App;
