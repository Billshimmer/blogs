'use strict';
import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View as RNView } from 'react-native';
import LAB from 'lab4';

export default class View extends LAB.Component {
  // constructor(props, context) {
  //   super(props, context);
  // }

  render() {
    return (
      <RNView
        {...this.props}
        style={[this.getStyle('container'), this.props.style]}
      />
    );
  }
}
// const styles = StyleSheet.create({
//   container:{
//   },
// });
