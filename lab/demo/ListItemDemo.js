'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { Page, Link, requireComp } from 'lab4';
import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const ListSimpleLineItem = requireComp('com.ListSimpleLineItem');
const ListMultiLineItem = requireComp('com.ListMultiLineItem');

export default class ListItemDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  renderTest() {
    return (
      <View>
        <ListSimpleLineItem
          icon=""
          image=""
          textLeft="标题标题标题标题标题标题标题标题标题标题"
          textRight="提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字"
          lineOfText={0}
          iconRight="addarrow"
        />
        <ListSimpleLineItem
          icon="sentiment-very-satisfied"
          image=""
          textLeft="标题"
          textRight=""
          iconRight="access-alarms"
        />
        <ListSimpleLineItem
          icon="sentiment-very-satisfied"
          image=""
          textLeft="标题"
          textRight=""
          iconRight=""
        />
        <ListSimpleLineItem
          icon="sentiment-very-satisfied"
          image="http://facebook.github.io/react/img/logo_og.png"
          textLeft="标题"
          textRight=""
          iconRight=""
        />
        <ListSimpleLineItem
          icon="sentiment-very-satisfied"
          image=""
          textLeft="商业"
          textRight="厦门北站地下商城，百合商城，悦士便利商城......."
          iconRight=""
          lineOfText={2}
          style_class="default,alignLeft"
        />

        <ListMultiLineItem
          image={{ ui_type: 'com.Image', uri: 'test' }}
          title="标题17px"
          lineOfTitle={1}
          describe="字体大小13px"
          lineOfDesc={1}
          style_class="default,style_60_60"
        />
        <ListMultiLineItem
          title="标题15px标题15px标题15px标题15px标题15px标题15px"
          lineOfTitle={0}
          describe="文本15px"
          lineOfDesc={0}
          style_class="default,style_75_65"
        />
        <ListMultiLineItem
          image={{
            ui_type: 'com.Image',
            uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
          }}
          title="标题18px"
          lineOfTitle={0}
          describe="文本15px文本15px文本15px文本文本文本15px"
          lineOfDesc={0}
          style_class="default,style_100_100"
          footnote={{
            ui_type: 'com.ListFootnoteItem',
            date: '2016.04.16 09:28',
          }}
        />
        <ListMultiLineItem
          image={{
            ui_type: 'com.Image',
            uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
          }}
          title="标题18px"
          lineOfTitle={1}
          describe="文本15px"
          lineOfDesc={1}
          style_class="default,custom_2"
          footnote={{
            ui_type: 'com.ListFootnoteItem',
            date: '2016.04.16 09:28',
          }}
        />
        <ListMultiLineItem
          image={{
            ui_type: 'com.Image',
            uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
          }}
          title="标题17px标题17px标题17px标题17px标题17px标题17px"
          textRight="今天今天今天"
          lineOfTitle={1}
          describe="文本14px"
          lineOfDesc={1}
          style_class="default,custom_1"
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
