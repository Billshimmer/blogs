'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';

import {
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import LABIMIChatView from './LABIMIChatView';
//import ChatView from './ChatView';

const Test = requireComp('test.Test');

export default class HelloWorldDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  testHello() {
    console.log('所有以test开头的成员函数会被渲染为一个测试按钮');
  }
  renderTest() {
    return (
      <View>
        <LABIMIChatView options={{
          toImId:'dansejijie',
          toNickname:'dansejijie',
          toAvatar:'',
          myNickname:'dansejijie2',
          myAvatar:''

        }} style={{width:360,height:450}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
