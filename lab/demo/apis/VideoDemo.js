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

import Video from 'lab4/apis/Video';

export default class VideoDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  testPlay() {
    Video.play({
      uri: 'http://baobab.wandoujia.com/api/v1/playUrl?vid=2614&editionType=normal',
      title: 'test',
    }, (error) => {
      console.log('error:', error);
    });
  }

  // renderContent() {
  //   return (
  //
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
