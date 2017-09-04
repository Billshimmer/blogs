'use strict';
import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Linking, Platform } from 'react-native';

import LAB, { Application, User } from 'lab4';

import NotificationManager from 'lab4/apis/NotificationManager';
import PushManager from 'lab4/apis/PushManager';

import URI from 'urijs';
import Home from './Home';
import DemoHelper from './DemoHelper';

if (!global.TEST_BASE_URL) {
  global.TEST_BASE_URL = 'http://localhost:3003/';
}

// 在demo中允许使用cps.xxx
// global.__ALLOW_CPS__ = true;

export default class LAB4Demo extends Application {
  static setDebugList(list) {
    DemoHelper.setExtraDemos(list);
  }

  constructor(props, context) {
    super(props, context);
    this.state = { ...this.state, lastDemoRoute: null, isGetLastFinish: false };
    DemoHelper.getTestState()
      .then(
        testState => {
          //console.log('LAB4Demo getTestState', testState);
          testState = testState || {};
          this.setState({
            lastDemoRoute: testState.route,
            isGetLastFinish: true,
            debugConfig: testState.debugConfig,
          });
        },
        e => {
          console.log('getTestState error:', e);
          if (this.isRender) {
            this.setState({ isGetLastFinish: true });
          }
        }
      )
      .done();
  }

  componentWillMount() {}

  componentDidMount() {
    console.log(
      'DemoApp componentDidMount CachedInitialNotification:',
      NotificationManager.getCachedInitialNotification()
    );

    // PushManager.initPush();
    // PushManager.setAlias('test1');

    //订阅用户登录状态改变
    User.emitter.on(
      'init_login',
      user => {
        console.log('User.emitter init_login user:', user);
      },
      this
    );
    User.emitter.on(
      'login',
      (user, oldUser) => {
        console.log('User.emitter login user:', user, 'oldUser:', oldUser);
      },
      this
    );
    User.emitter.on(
      'logout',
      oldUser => {
        console.log('User.emitter logout oldUser:', oldUser);
      },
      this
    );

    //通知消息
    NotificationManager.on(
      NotificationManager.NOTIFICATION_OPENED,
      notification => {
        console.log('NotificationManager.NOTIFICATION_OPENED', notification);
      },
      this
    );

    NotificationManager.on(
      NotificationManager.NOTIFICATION_RECEIVED,
      notification => {
        console.log('NotificationManager.NOTIFICATION_RECEIVED', notification);
      },
      this
    );

    //推送消息
    PushManager.on(
      PushManager.MESSAGE_RECEIVED,
      data => {
        console.log('PushManager.MESSAGE_RECEIVED', data);
      },
      this
    );

    PushManager.on(
      PushManager.NOTIFICATION_RECEIVED,
      data => {
        console.log('PushManager.NOTIFICATION_RECEIVED', data);
      },
      this
    );
    // Linking.getInitialURL()
    //   .then((url) => {
    //       console.log('Initial url is: ' + url);
    //     })
    //   .catch(err => console.error('getInitialURL An error occurred', err));
    //
    // Linking.addEventListener('url', (data) => {
    //   console.log('Linking url event: ', data);
    //   let url = data.url;
    //   let uri = new URI(url);
    //   switch (uri.path()) {
    //     case '/im':
    //       let query = uri.query(true);
    //       //TODO 跳转到聊天界面
    //       break;
    //   }
    // });
  }

  getInitialRouteStack() {
    const stack = [
      {
        id: 'root',
        comp: Home,
        debugConfig: this.state.debugConfig,
      },
    ];
    if (this.state.lastDemoRoute) {
      stack.push(this.state.lastDemoRoute);
    }
    return stack;
  }

  render() {
    this.isRender = true;
    if (!this.state.isGetLastFinish) {
      //console.log('!this.state.isGetLastFinish');
      return null;
    }
    return super.render();
    // const Window = require('lab4/core/Window').default;
    // const Demo = require('./ViewPagerTabBarDemo').default;
    // return (
    //   <Window route={{comp: Demo}}/>
    // );
  }
}

const styles = StyleSheet.create({});
