'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';

import { Page, LoadingView, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Icon = requireComp('com.Icon');

export default class TextTest extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  test1() {}

  test2() {}

  renderContent() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 40 }}>
          1111
          <Text>
            2222
          </Text>
          <Icon
            name="settings-voice"
            size={40}
            style={{
              marginLeft: 30,
              paddingLeft: 30,
              color: '#32E1FC',
              backgroundColor: '#076154',
              position: 'absolute',
              borderWidth: 5,
              borderColor: '#29D1B4',
            }}
          />
          1111
        </Text>
        <Text
          numberOfLines={3}
          style={{
            color: '#539321',
            fontSize: 18,
          }}
        >
          agasdfg sdfgsdfgsfdgsfg dsfgfsad fg sdf gsdfg sddfg sd gsdfgsfg sfdg sfg sdfg s gasdfg sdfgsdfgsfdgsfg dsfgfsad fg sdf gsdfg sddfg sd gsdfgsfg sfdg sfg sdfg sgasdfg sdfgsdfgsfdgsfg dsfgfsad fg sdf gsdfg sddfg sd gsdfgsfg sfdg sfg sdfg sgasdfg sdfgsdfgsfdgsfg dsfgfsad fg sdf gsdfg sddfg sd gsdfgsfg sfdg sfg sdfg s
        </Text>
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
