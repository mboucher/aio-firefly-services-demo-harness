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

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
  currentPageName: 'CC API Demos',
  apiConsoleEnabled: false,
  request: {
    endpoint:'',
    headers:{},
    body: {},
    method: '',
  },
  response: {
    status:200,
    body:{}
  }
}

const appSlice = createSlice({
    name: 'appState',
    initialState: initialState,
    reducers: {
        setDarkMode (state, action) {
            state.darkMode = action.payload;
        },
        setCurrentPageName (state, action) {
          state.currentPageName = action.payload;
        },
        setRequest (state, action) {
          state.request = action.payload;
        },
        setResponse (state, action) {
          state.response = action.payload;
        },
        setEnableAPIConsole (state, action) {
          state.apiConsoleEnabled = action.payload;
        }
    }
});

export const {
    setDarkMode,
    setCurrentPageName,
    setRequest,
    setResponse,
    setEnableAPIConsole
} = appSlice.actions;

export default appSlice.reducer;
