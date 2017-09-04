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
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import * as StyleManager from 'lab4/core/lab/StyleManager';

export default class StyleManagerTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  test1() {
    console.log(StyleManager.extendStyles());

    console.log(StyleManager.extendStyles({}));

    console.log(StyleManager.extendStyles({
      a: {
        width: 10,
        height: 20,
      },
      b: {

      }
    },
    {
      a: {
        width: 30,
        color: '#fff'
      },
      c: {

      }
    }));

    console.log(StyleManager.extendStyles(
      StyleSheet.create({
      a: {
        width: 10,
        height: 20,
      },
      b: {

      }
    }),
    StyleSheet.create({
      a: {
        width: 30,
        color: '#fff'
      },
      c: {

      }
    })));
  }

  test2() {
    console.log(StyleManager.getStyles('xxx'));
    console.log(StyleManager.getStyles('com.Button', 'success,success-outline'));
  }

  test3() {
  }

  test4() {
  }

  test5() {
  }

  test6() {
  }

  test7() {
  }

  test8() {
  }

  test9() {
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
