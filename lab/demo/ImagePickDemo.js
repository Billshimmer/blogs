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

const ImagePick = requireComp('com.ImagePick');

export default class ImagePickDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
  }

  renderTest() {
    return (
      <View style={{flex:1}}>
        <ImagePick />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
