'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';

export default class ListFootnoteItem extends LAB.Component {
  static propTypes = {
    date: PropTypes.string,
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={this.getStyle('items')}>
        <Text style={this.getStyle('date')}>{this.props.date}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
  },
});
