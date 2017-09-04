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

import LAB, {
  Page,
  Toast,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class ToastDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  testShow1() {
    Toast.show('Hello World1');
  }

  testShow2() {
    this._toastId = Toast.show('Hello World2', {
      duration: Toast.Duration.LONG, //Toast.Duration.SHORT
      position: Toast.Position.BOTTOM,
      shadow: true,
      animation: false,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        console.log('onShow 2');
      },
      onShown: () => {
        console.log('onShown 2');
      },
      onHide: () => {
        console.log('onHide 2');
      },
      onHidden: () => {
        console.log('onHidden 2');
      }
    });
  }

  testShow3() {
    this._toastId = Toast.show('Hello World3', {
      duration: 50000,
      position: Toast.Position.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        console.log('onShow 3');
      },
      onShown: () => {
        console.log('onShown 3');
      },
      onHide: () => {
        console.log('onHide 3');
      },
      onHidden: () => {
        console.log('onHidden 3');
      }
    });
  }

  testHide1() {
    Toast.hide(this._toastId);
  }

  testHide2() {
    Toast.hide(1);
  }

  // renderContent() {
  //   return (
  //
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
