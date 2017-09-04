'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import BaseTestComponent from 'lab4/demo/BaseTestComponent';

export default class Wrapper extends BaseTestComponent {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    this.log('render');
    return this.props.children;
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A73D7',
  },
});
