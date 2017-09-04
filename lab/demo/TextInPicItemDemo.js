'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';

import LAB, { Page, Link, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const FSJHotList = requireComp('com.FSJHotList');

export default class TextInPicItemDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  test1() {}

  test2() {}

  test3() {}

  renderContent() {
    return (
      <View>
        <FSJHotList
          image={{
            ui_type: 'com.Image',
            uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
          }}
          title="医师协会急诊分会急性感染联盟2014年年会医师协会急诊分会急性感染联盟2014年年会"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
