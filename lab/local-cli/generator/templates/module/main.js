'use strict';

import React from 'react';
import ReactNative from 'react-native';
import LAB, {

} from 'lab4';

//删除测试状态用
//ReactNative.AsyncStorage.removeItem('DEMO_STATE');

LAB.initialize({
  comps: require('lab-config/comps'),
  styles: require('lab-config/styles'),
  images: require('lab-config/images'),
  tpls: require('lab-config/tpls'),
  routeManifest: require('./RouteManifest'),
  config: require('lab-config/config'),
  theme: require('./Theme'),
});

const App = require('lab4/demo/App');
App.setDebugList(require('./demo/DEMOS'));

// const App = require('./App').default;

ReactNative.AppRegistry.registerComponent('app', LAB.bootstrap({
  app: App,
}));
