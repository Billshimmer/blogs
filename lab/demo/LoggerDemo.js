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
import Logger from 'lab4/apis/Logger';

export default class ToastDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      renderError: false,
    };
  }

  testReportError() {
    Logger.reportError(new Error('LAB Logger TEST'));
  }

  testPressError() {
    throw new Error('LAB TEST onPress Error');
  }

  testSetTimeoutError() {
    setTimeout(() => {
      throw new Error('LAB TEST setTimeout Error');
    }, 100);
  }

  testRenderError() {
    this.setState({
      renderError: !this.state.renderError,
    });
  }

  renderTest() {
    if (this.state.renderError) {
      throw new Error('LAB TEST render Error');
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
