'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB from 'lab4';

export default class Message extends LAB.Component {
  // static propTypes = {};

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <View style={[this.getStyle('container'), this.props.style]} />;
  }
}

// const styles = StyleSheet.create({
// });
