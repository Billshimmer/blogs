'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';

import LAB, { Page, Link, requireComp } from 'lab4';

import SimplePage from './SimplePage';
import TestHelper from './TestHelper';

const Countdown = requireComp('com.Countdown');

export default class TestPage extends SimplePage {
  constructor(props, context) {
    super(props, context);

    this.configPage({
      scrollable: true,
    });

    this.state = {
      aaa: 'aaa',
    };
  }

  onBack() {
    alert('onBack');
    return true;
  }

  test1() {}

  test2() {
    this.setState({
      aaa: 'bbb',
    });
  }

  test3() {
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
    }, 2000);
  }

  test4() {
    this.hideLoading();
  }

  test5() {}

  test6() {}

  test7() {
    // this.showError();
    // setTimeout(() => {
    //   this.showContent();
    // }, 3000);
  }

  test8() {
    this.router.popById('root', true);
    // var key = 'lab4/demo/TestHelper.js';
    // var a = global.require(key);
    // alert(a);
  }

  test9() {
    this.setState({
      aaa: 333,
    });
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <Text>lab4 demo</Text>
        <Countdown initialTimeRemaining={1000000} description="距离结束：" />
        <Text>{this.state.aaa}</Text>
        <Text>data:{JSON.stringify(this.props.route.data)}</Text>
        <Link type="pop"><Text>pop</Text></Link>
        <Link
          type="push"
          uri="/TestPage"
          comp={TestPage}
          data={{ aaa: 'Home->TestPage' }}
        >
          <Text>push</Text>
        </Link>
        <Link
          type="replace"
          uri="/TestPage"
          comp={TestPage}
          data={{ aaa: 'Home->TestPage' }}
        >
          <Text>replace</Text>
        </Link>
        <Link type="reload"><Text>reload</Text></Link>
        {TestHelper.renderTestBtns(this)}
        <View style={{ width: 400, height: 500, backgroundColor: '#1F7698' }} />
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
