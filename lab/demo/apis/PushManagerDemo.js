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
  Parse,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import PushManager from 'lab4/apis/PushManager';

const User = Parse.User;

export default class PushManagerDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    // this.configPage({
    //   scrollable: true, //页面可滚动
    // });
  }

  componentWillUnmount() {
    PushManager.offByTag(this);
  }

  // testInitPush() {
  //   PushManager.initPush();
  // }

  testStopPush() {
    PushManager.stopPush();
  }

  testResumePush() {
    PushManager.resumePush();
  }

  testGetInfo() {
    PushManager.getInfo().then((data) => {
      console.log('testGetInfo success data:', data);
    }).catch((error) => {
      console.log('testGetInfo error', error);
    });
  }

  testSetAlias() {
    let uid = 'xxx';
    if (User.isLoggedIn()) {
      uid = User.current().id;
    }
    PushManager.setAlias(uid).then((data) => {
      console.log('testSetAlias success data:', data);
    }).catch((error) => {
      console.log('testSetAlias error', error);
    });
  }

  testRemoveAlias() {
    PushManager.removeAlias().then((data) => {
      console.log('removeAlias success data:', data);
    }).catch((error) => {
      console.log('removeAlias error', error);
    });
  }

  testSetTags() {
    //PushManager.setTags();
  }

  testSubscribe() {
    PushManager.on(PushManager.MESSAGE_RECEIVED, (data) => {
      console.log('MESSAGE_RECEIVED data: ', data);
    }, this);
    PushManager.on(PushManager.NOTIFICATION_RECEIVED, (data) => {
      console.log('NOTIFICATION_RECEIVED data: ', data);
    }, this);
    PushManager.on(PushManager.NOTIFICATION_OPENED, (data) => {
      console.log('NOTIFICATION_OPENED data: ', data);
    }, this);
  }

  testUnSubscribe() {
    PushManager.offByTag(this);
  }

  /**
   * 测试获取当前推送状态
   */
  testGetPushState() {
    PushManager.getPushState()
      .then((state) => {
        //0表示推送关闭， 1表示推送开启
        console.log('getPushState state', state);
      });
  }

  renderContent() {
    return (
        <View style={styles.container}>
          {this.renderTestBtns()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
