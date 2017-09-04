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

const Test = requireComp('test.Test');

export default class LABScrollViewDemo extends SimplePage {

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

  // 如果重写renderContent 则可以决定测试按钮放置位置，一般重写renderTest
  // 具体参考 SimplePage
  // renderContent() {
  //   return (
  //     <View style={styles.container}>
  //       {this.renderTestBtns()} //渲染测试按钮
  //       {this.renderTest && this.renderTest()}
  //     </View>
  //   );
  // }

  renderTest() {
    return (
      <View
       style={styles.container}>

          <Text style={{}}>ssss</Text>
        
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
    height:10000,
  },
});
