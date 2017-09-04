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
  StatusBar,
} from 'react-native';

import {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class StatusBarTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };

    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  test1() {
  }

  test2() {
  }

  test3() {
  }

  renderContent() {
    return (
      <View>
        <StatusBar
          backgroundColor="#BA95A6"
          barStyle="light-content"
          hidden={false}
          translucent={false}
        />

        <StatusBar
          backgroundColor="#BA95A6"
          barStyle="default"
          hidden={false}
          translucent={false}
        />
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
