'use strict';

// 配置Error Logger
import 'lab4/apis/Logger/initDefaultErrorGuard';
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

//配置全局的refreshControl样式
import RefreshControlConfig from 'lab4/basiccomps/RefreshControlConfig';
RefreshControlConfig.refreshControlProps.tintColor = '#f06292';
RefreshControlConfig.refreshControlProps.colors = ['#f06292', '#4caf50', '#5c6bc0'];

AppRegistry.registerComponent('index', bootstrap({
  app: App,
  load: () => {
    return Promise.resolve(); //App显示之前运行的程序
  },
  reducers: {
    message: require('lab4/redux/reducers/message'),
  },
}));

// XXX 测试TextInput
// import TextInputTest from './test/TextInputTest';
//AppRegistry.registerComponent('index', () => TextInputTest);

// TEST
// const {
//   View,
//   Text,
//   TextInput,
// } = ReactNative;
// class App extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       show: true,
//     }
//   }
//   render() {
//     return (
//       <View style={{paddingTop: 40,}}>
//         <Text onPress={() => {
//           this.setState({
//             show: !this.state.show,
//           });
//         }} style={{fontSize: 24,}}>toggle show</Text>
//         <TextInput style={{height: 50, backgroundColor: '#E4FFD6', marginBottom: 10}}/>
//         {this.state.show ? <TextInput style={{height: 50, backgroundColor: '#E4FFD6', marginBottom: 10}}/> : null}
//       </View>
//     );
//   }
// }
// AppRegistry.registerComponent('index', () => App);
