'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
} from 'react-native';

import LAB, { Application, User } from 'lab4';

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
    this.state = {
      ...this.state,
      lastDemoRoute: null,
      isGetLastFinish: false,
    };
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
            this.setState({
              isGetLastFinish: true,
            });
          }
        }
      )
      .done();

    // this.navigatorProps = {
    // };
  }

  componentWillMount() {
    //console.log('LAB4Demo componentWillMount');
  }

  componentDidMount() {
    console.log('DemoApp componentDidMount');
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
  }
}

const styles = StyleSheet.create(
  {
    // container: {
    //   flex: 1,
    // },
  }
);
