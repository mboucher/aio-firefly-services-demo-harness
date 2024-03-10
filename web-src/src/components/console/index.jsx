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

import React, { useState } from 'react';
import { Dialog, ActionButton, Text, Content, Heading, View, DialogContainer, Tabs, TabList, Item, TabPanels, Button, ButtonGroup } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';
import Code from '@spectrum-icons/workflow/Code';
import ReactJson from 'react-json-view';


const XRayConsole = () => {
  const requestData = useSelector((state) => state.app.request);
  const responseData = useSelector((state) => state.app.response);
  const isEnabled = useSelector((state) => state.app.apiConsoleEnabled);
  const [isOpen, setOpen] = useState(false);

  return (
   <>
      <ActionButton onPress={() => setOpen(true)} isDisabled={isEnabled ? false : true}><Code/><Text>API Console</Text></ActionButton>
      <DialogContainer onDismiss={() => setOpen(false)} type='fullscreen'>
        {isOpen && 
          <Dialog> 
            <Heading>Firefly API Call Details</Heading>
            
            <Content>
              <Tabs aria-label='FF Call Details'>
                <TabList>
                  <Item key={'request'}><Text>Request</Text></Item>
                  <Item key={'response'}><Text>Response</Text></Item>
                </TabList>
                <TabPanels>
                  <Item key={'request'}>
                    <View>
                        <Heading level={3}>Endpoint</Heading>
                        <Text>{requestData.endpoint}</Text>
                      </View>
                      <View>
                        <Heading level={3}>Method</Heading>
                        <Text>{requestData.method}</Text>
                      </View>
                      <View>
                        <Heading level={3}>Headers</Heading>
                        <Text><pre>{JSON.stringify(requestData.headers, null, 2)}</pre></Text>
                      </View>
                      <View>
                          <Heading level={3}>Request</Heading>
                          <ReactJson
                                name='body'
                                src={requestData.body}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                indentWidth={2}
                                style={{ fontFamily: "Source Sans Pro" }}
                              />
                      </View>
                  </Item>
                  <Item key={'response'}>
                    <View>
                        <Heading level={3}>Status</Heading>
                        <Text>200</Text>
                      </View>
                      <View>
                          <Heading level={3}>Body</Heading>
                          <ReactJson
                                name='body'
                                src={responseData.body}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                indentWidth={2}
                                style={{ fontFamily: "Source Sans Pro" }}
                              />
                      </View>
                  </Item>
                </TabPanels>
              </Tabs>
            </Content>
            <ButtonGroup>
                <Button variant="secondary" onPress={() => setOpen(false)}>Close</Button>
             </ButtonGroup>
          </Dialog>
        }
      </DialogContainer>
    </>
  )
}

export default XRayConsole;
