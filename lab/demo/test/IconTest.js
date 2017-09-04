'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import { Page, Link, requireComp } from 'lab4';

import SimplePage from '../SimplePage';
import TestHelper from '../TestHelper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Icon = requireComp('com.Icon');

export default class IconTest extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  test1() {}

  test2() {}

  test3() {}

  test4() {}

  test5() {}

  test6() {}

  test7() {}

  test8() {}

  test9() {}

  renderContent() {
    return (
      <View>
        <MaterialIcons name="arrow-back" size={24} style={{ fontSize: 24 }} />
        <Icon name="arrow-back" size={24} style={{ fontSize: 24 }} />
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
