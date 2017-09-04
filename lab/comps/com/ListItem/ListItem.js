'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text } from 'react-native';
import LAB from 'lab4';

export default class ListItem extends LAB.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return <Text ref="_main">{this.props.title}</Text>;
  }
}
