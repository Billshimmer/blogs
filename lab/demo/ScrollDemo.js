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
  Link,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Scroll = requireComp('com.Scroll');

export default class ScrollDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: false,
    });
  }

  renderTest() {
    return (
      <Scroll
        refreshable={true}
        topBounceBgStyle={{
          backgroundColor: '#4FB47E',
        }}
        bindPageRefresh={true}
        style={{backgroundColor: '#ffaaaa'}}>
        <View style={{height: 1000, justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{fontSize: 20}}>Scroll</Text>
        </View>
      </Scroll>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
