'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  ScrollView,
  WebView,
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class WebViewTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };

    // this.configPage({
    //   scrollable: true,
    // });
  }

  test1() {

  }

  test2() {

  }

  test3() {

  }

  test4() {

  }

  renderContent() {
    return (
      <View style={{flex: 1}}>
        <WebView
          javaScriptEnabled={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          source={{
            uri: 'http://image.baidu.com/search/wiseala?tn=wiseala&ie=utf8&from=index&fmpage=index&word=%E5%88%9B%E6%84%8F%E6%91%84%E5%BD%B1&pos=magic#!search',
          }}
          style={{
          }}/>
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
