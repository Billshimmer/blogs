'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';

export default class SimpleListItem extends LAB.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Text ref="_main" style={{ padding: 10, fontSize: 18 }}>
        {this.props.text}
      </Text>
    );
  }
}
