'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB from 'lab4';

export default class Label extends LAB.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        <Text numberOfLines={1} style={this.getStyle('text')}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
