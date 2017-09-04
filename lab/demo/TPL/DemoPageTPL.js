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
  requireComp,
} from 'lab4';
import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class DemoPage extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    // this.configPage({
    //   scrollable: true,
    // });
  }

  testXXX() {
  }

  renderTest() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
