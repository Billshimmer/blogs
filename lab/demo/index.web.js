'use strict';

import React from 'react';
import ReactNative, {
  Platform,
  AppRegistry,
} from 'react-native';

import {
  initialize,
  bootstrap,
} from 'lab4';

import config from 'lab-config/config';
import routeManifest from './RouteManifest';

initialize({
  theme: {},
  config,
  routeManifest,
});

const App = require('./App').default;

//删除测试状态用
// import DemoHelper from 'lab4/demo/DemoHelper';
// DemoHelper.clearTestState();

AppRegistry.registerComponent('index', bootstrap({
  app: App,
  load: () => {
    return Promise.resolve(); //App显示之前运行的程序
  },
  reducers: {
    message: require('lab4/redux/reducers/message'),
  },
}));

AppRegistry.runApplication('index');
