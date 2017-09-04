'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB from 'lab4';

export default class CatCon extends LAB.Component {
  static propTypes = {
    header: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.func,
    ]),
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let header = this.props.header
      ? typeof this.props.header === 'object'
        ? LAB.render(this.props.header)
        : LAB.createElement(this.props.header)
      : null;
    return (
      <View style={[this.getStyle('container')]}>
        <View style={[this.getStyle('title')]}>{header}</View>
        <View style={[this.getStyle('content')]}>{this.props.children}</View>
      </View>
    );
  }
}
