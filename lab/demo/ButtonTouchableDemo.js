'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
  Animated,
} from 'react-native';

import { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Button = requireComp('com.Button');
const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

/**
 * com.Button 与 com.Touchable 都继承了LinkEmitAble
 */
export default class ButtonTouchableDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tobg: new Animated.Value(1234),
    };

    this.configPage({
      scrollable: true,
    });

    this._initEvent();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.pageEmitter.offByTag(this);
  }
  
  _initEvent() {
    this.pageEmitter.on('event1', (event) => {
      // Touchable4 点击时触发的事件
      console.log(event);
      alert('Touchable4 event');
    }, this);
  }

  testToggleDisable() {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  _renderButton() {
    return (
      <View style={{ marginBottom: 10, }}>
        <Button
          disabled={this.state.disabled}
          style={{
            backgroundColor: 'rgb(247, 9, 56)',
          }}
        >
          测试1
        </Button>
        <Button
          disabled={this.state.disabled}
          style={{
            marginTop: 4,
            backgroundColor: 'rgb(247, 9, 56)',
          }}
        >
          测试2
        </Button>
        <Button
          disabled={this.state.disabled}
          style={{
            marginTop: 4,
            backgroundColor: 'rgb(9, 247, 56)',
            borderWidth: 0,
          }}
        >
          测试3
        </Button>
        <Button
          disabled={this.state.disabled}
          style={{
            marginTop: 4,
            backgroundColor: 'rgb(9, 56, 247)',
          }}
        >
          测试4
        </Button>
        <Button
          disabled={this.state.disabled}
          style={{
            marginTop: 4,
            borderColor: '#00F',
            backgroundColor: '#FFF'
          }}
          textStyle={{ color: '#00F' }}
          buttonActiveStyle={{ backgroundColor: '#00F' }}
          type="outline"
          onPress={() => {
            console.log('111');
          }}
        >
          测试5
        </Button>

        <Button
          disabled={this.state.disabled}
          textStyle={{
            fontSize: 16,
          }}
          textActiveStyle={{}}
          style={{
            marginTop: 4,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: '#1CE8BE',
            borderWidth: 0,
          }}
          activeStyle={{
            backgroundColor: '#08869E',
          }}
        >
          测试6
        </Button>

        <Button
          disabled={this.state.disabled}
          type="outline"
          textStyle={{
            fontSize: 16,
          }}
          textActiveStyle={{
            color: '#6E0F65',
          }}
          style={{
            marginTop: 4,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: '#c6e629',
          }}
          activeStyle={{
            backgroundColor: '#E33E84',
          }}
        >
          测试7
        </Button>

        <Button
          disabled={this.state.disabled}
          textStyle={{
            fontSize: 16,
          }}
          textActiveStyle={{}}
          style={{
            marginTop: 4,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 16,
            paddingRight: 16,
          }}
          style_class="success"
        >
          测试8<Text>xxxxxxxxx</Text>
        </Button>

        <Button
          disabled={this.state.disabled}
          style_class="success-outline"
          style={{
            marginTop: 4,
          }}>
          <Icon name="arrow-drop-down" style={{ marginRight: 5 }} />
          <Text>xxxxxxxxx</Text>
        </Button>
      </View>
    );
  }

  _renderTouchable() {
    return (
      <View style={{ marginBottom: 10, }}>
        <Touchable
          link={{ url: '/xxx' }}
          disabled={this.state.disabled}
          style={styles.touchable}
          >
          {/* 由于链接不存在 所以打开的页面会出错 */}
          <Text style={styles.touchableText}>Touchable1</Text>
        </Touchable>
        <Touchable
          link={{ url: 'https://baidu.com' }}
          disabled={this.state.disabled}
          style={styles.touchable}
          >
          <Text style={styles.touchableText}>Touchable2 External Link</Text>
        </Touchable>
        <Touchable
          link={{ url: 'https://baidu.com' }}
          disabled={this.state.disabled}
          onPress={() => {
            // onPress 返回false 可阻止 LinkEmitAble的触发
            return false;
          }}
          style={styles.touchable}
          >
          <Text style={styles.touchableText}>Touchable3 onPress</Text>
        </Touchable>
        <Touchable
          emit={{
            event: 'event1',
            scope: 'page',
            data: {
              xxx: 1,
            },
          }}
          disabled={this.state.disabled}
          style={styles.touchable}
          >
          <Text style={styles.touchableText}>Touchable4 emit</Text>
        </Touchable>
      </View>
    );
  }

  _renderRNTouchable() {
    //TouchableNativeFeedback 为实现NativeMethodsMixin
    // TouchableOpacity 无法setNativeProps
    let touableN;
    if (Platform.OS == 'android') {
      touableN = (
        <TouchableNativeFeedback
          style={{ padding: 10, backgroundColor: '#CFDAF2', borderRadius: 5 }}
        >
          <View
            ref="tnf"
            style={{
              backgroundColor: '#B92A60',
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 20 }}>TouchableNativeFeedback</Text>
          </View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <View>
        {touableN}
        <TouchableOpacity
          ref="to"
          onPress={() => {
            console.log('TouchableOpacity onPress');
          }}
          onPressIn={() => {
            console.log('TouchableOpacity onPressIn');
          }}
          onPressOut={() => {
            console.log('TouchableOpacity onPressOut');
          }}
          style={{
            padding: 10,
            backgroundColor: this.state.tobg,
            borderRadius: 5,
            borderWidth: 3,
            borderColor: '#6601D7',
          }}
        >
          <Text style={{ fontSize: 20 }}>TouchableOpacity</Text>
        </TouchableOpacity>

        <TouchableHighlight
          ref="th"
          onPress={() => {
            console.log('TouchableOpacity onPress');
          }}
          onPressIn={() => {
            console.log('TouchableOpacity onPressIn');
          }}
          onPressOut={() => {
            console.log('TouchableOpacity onPressOut');
          }}
          underlayColor="#6601D7"
          style={{
            padding: 10,
            backgroundColor: '#CFDAF2',
            borderRadius: 5,
            borderWidth: 3,
            borderColor: '#6601D7',
          }}
        >
          <Text style={{ fontSize: 20 }}>TouchableHighlight</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderTest() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this._renderButton()}
        {this._renderTouchable()}
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
  touchable: {
    marginBottom: 4,
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  touchableText: {
    fontSize: 16,
  }
});
