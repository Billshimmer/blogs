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
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const BlockList = requireComp('com.BlockList');

export default class BlockListDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this.configPage({
      scrollable: true,
    });
  }

  // test1() {
  // }

  // test2() {
  // }

  renderTest() {
    return (
      <View style={{flex: 1}}>
        <BlockList
          separateTop={true}
          separateBottom={true}
          blank={{ui_type:'com.BlankBlock', height:10}}
          style={{backgroundColor: '#00bcd4'}}
          >
          <BlockList
            separateTop={false}
            separateBottom={false}
            line={{ui_type:'com.Line', size:1, marginTop:0, marginBottom:0}}>

            <View style={{backgroundColor: '#03a9f4', height: 100,}}></View>
            <View style={{backgroundColor: '#8bc34a', height: 100,}}></View>
            <View style={{backgroundColor: '#ffeb3b', height: 100,}}></View>
            <View style={{backgroundColor: '#03a9f4', height: 100,}}></View>
            <View style={{backgroundColor: '#8bc34a', height: 100,}}></View>
            <View style={{backgroundColor: '#ffeb3b', height: 100,}}></View>
          </BlockList>
          <View style={{backgroundColor: '#e91e63', height: 100,}}></View>
        </BlockList>
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
