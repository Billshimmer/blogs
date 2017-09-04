'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { Page, requireComp } from 'lab4';

const HeaderBar = requireComp('com.HeaderBar');

/**
 * 一个跳页输入表单组件的转跳页
 * 内嵌 CenterInput 与 LinkInputField 组合使用
 * 
 * @export
 * @class CenterInputPage
 * @extends {Page}
 */
export default class CenterInputPage extends Page {
  constructor(props, context) {
    super(props, context);
    this.configPage({
      scrollable: true,
    });
    // this.state = {};
  }

  renderHeader() {
    return (
      <HeaderBar
        title={this.props.route.data.data.title}
        left={{ icon: 'arrow-back', link: { type: 'pop' } }}
      />
    );
  }

  renderContent() {
    return (
      <View>
        {LAB.render(this.props.route.data.data.element, {
          setValue: value => {
            this.props.route.data.cbk && this.props.route.data.cbk(value);
          },
          reg: this.props.route.data.data.element.reg,
        })}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {},
// });
