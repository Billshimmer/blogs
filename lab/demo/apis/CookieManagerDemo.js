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
  Image,
  NativeModules,
} from 'react-native';

import LAB, {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import CookieManager from 'lab4/apis/CookieManager';
const LABCookieManager = NativeModules.LABCookieManager;

export default class CookieManagerDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
    this.configPage({
      scrollable: true,
    });
  }

  testSet() {
    CookieManager.set('xxx', 'xxx')
      .then(() => {
        console.log('set success');
      })
      .catch((e) => {
        console.log('set error', e);
      });
  }

  testGet() {
    CookieManager.get('xxx')
      .then((value) => {
        console.log('get value:', value);
      })
      .catch((e) => {
        console.log('get error', e);
      });
  }

  testRemove() {
    CookieManager.remove('xxx')
      .then(() => {
        console.log('remove success');
      })
      .catch((e) => {
        console.log('remove error', e);
      })
  }

  testLABCookieManagerSet() {
    LABCookieManager.setFromResponse('https://1688.com', 'aaa=12345678; path=/; domain=1688.com', (error) => {
      console.log('testLABCookieManagerSet error:', error);
    });
  }

  testLABCookieManagerSet1() {
    LABCookieManager.setFromResponse('https://1688.com', `aaa=; path=/; domain=1688.com; expires=Thu, 01 Jan 1970 00:00:00 GMT`, (error) => {
      console.log('testLABCookieManagerSet1 error:', error);
    });
  }

  testLABCookieManagerGet() {
    LABCookieManager.get('https://1688.com', (error, cookies) => {
      console.log('testLABCookieManagerGet error:', error, 'cookies:', cookies);
    });
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
