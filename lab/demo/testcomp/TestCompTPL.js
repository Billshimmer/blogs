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

export default class TestCompTPL extends BaseTestComponent {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>TestCompTPL</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {

  },
});
