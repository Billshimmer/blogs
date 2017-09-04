'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';

import { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const TabBarItem = requireComp('com.TabBarItem');

export default class TabBarItemDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  test1() {}

  test2() {}

  renderContent() {
    return (
      <View>
        <TabBarItem
          icon="access-alarm"
          image="http://facebook.github.io/react/img/logo_og.png"
          text="有图有文，优先图片"
        />
        <TabBarItem icon="access-alarm" image="" text="仅图标＋文字" />
        <TabBarItem
          icon=""
          image=""
          text="仅文字"
          style_class="default,text"
        />
        <TabBarItem
          icon="access-alarm"
          image=""
          text=""
          style_class="default,icon"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
