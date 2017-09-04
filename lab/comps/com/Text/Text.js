import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text as RNText, View } from 'react-native';
import LAB from 'lab4';

export default class Text extends LAB.Component {
  // static propTypes = {
  // };
  //
  // static defaultProps = {
  // };

  // constructor(props, context) {
  // 	super(props, context);
  // }

  render() {
    return (
      <View ref="_main" style={this.getStyle('container')}>
        <RNText {...this.props} style={this.getStyle('text')} />
      </View>
    );
  }
}
