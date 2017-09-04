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

import CrashReport from 'lab4/apis/CrashReport';

export default class CrashReportDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

// {
//   type:type,//NullPointerException,ClassCastException,IllegalArgumentException,ArithmeticException,ArrayStoreException
//             IndexOutOfBoundsException,NegativeArraySizeException,NumberFormatException,SecurityException,UnsupportedOperationException
//             OtherException
//   message:'xx'
// }
  testCrashReport() {
    CrashReport.postCatchedException({type:CrashReport.NullPointerException,message:'test CrashReport'});
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
