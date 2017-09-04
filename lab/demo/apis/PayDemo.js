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
} from 'react-native';

import LAB, {
  Page,
  http,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import PayManager from 'lab4/apis/Pay/PayManager';

export default class PayDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
    this.configPage({
      scrollable: true,
    });
  }

  testPay() {
    http.post('http://basic2.hz.backustech.com/Pay/Pay/test', {
      data: {
        "channel": "alipay",
        "amount": 1,
      }
    }).then((data) => {
      return PayManager.pay({
        charge: data,
      });
    }).then((result) => {
      console.log('pay success result:', result);
    }).catch((error) => {
      if (error.code === 'cancel') {
        console.log('pay cancel ', error);
      } else {
        console.log('pay error', error);
      }
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
