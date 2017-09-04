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

const ListTitleBar = requireComp('com.ListTitleBar');

export default class ListTitleBarDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
     scrollable: true, //页面可滚动
    });
  }

  test1() {
  }

  test2() {
  }

  test3() {
  }

  test4() {
  }

  test5() {
  }

  test6() {
  }

  test7() {
  }

  test8() {
  }

  test9() {
  }

  renderContent() {
    return (
      <View>
        <ListTitleBar
          icon=''
          image= ''
          textLeft="标题标题标题标题标题标题标题标题标题标题"
          textRight="提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字"
          lineOfText={0}
          iconRight='addarrow'
          />
        <ListTitleBar
          icon=''
          image= ''
          textLeft="标题标题标题标题标题标题标题标题标题标题"
          textRight="提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字"
          lineOfText={0}
          iconRight='addarrow'
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
    backgroundColor: '#F5FCFF',
  },
});
