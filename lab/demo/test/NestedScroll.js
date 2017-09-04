'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ListView,
  RefreshControl,
  ScrollView,
} from 'react-native';

import {
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class NestedScrollTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
  }

  renderTest() {
    return (
      <ScrollView
        ref="scroll_view"
        style={{
        }} >
        <View style={{height: 200, backgroundColor: '#d4e157'}}></View>
          <ScrollView
          ref="scroll_view2"
          style={{
            height: 300,
          }} >
          <View style={{height: 200, backgroundColor: '#1e88e5'}}></View>
          <View style={{height: 200, backgroundColor: '#3f51b5'}}></View>
          <View style={{height: 200, backgroundColor: '#ab47bc'}}></View>
          <View style={{height: 200, backgroundColor: '#ff5722'}}></View>
        </ScrollView>
        <View style={{height: 200, backgroundColor: '#1e88e5'}}></View>
        <View style={{height: 200, backgroundColor: '#3f51b5'}}></View>
        <View style={{height: 300, backgroundColor: '#ab47bc'}}></View>
        <View style={{height: 300, backgroundColor: '#ff5722'}}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
