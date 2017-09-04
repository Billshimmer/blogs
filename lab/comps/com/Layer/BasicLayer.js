'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';
import PopupLayer from 'lab4/core/PopupLayer';

export default class BasicLayer extends LAB.Component {
  static propTypes = {
    onMaskPress: React.PropTypes.func,
    showMask: React.PropTypes.bool,
    customView: React.PropTypes.object.isRequired,
  };

  // static defaultProps = {
  // };

  // constructor(props, context) {
  //   super(props, context);
  // }

  render() {
    return (
      <PopupLayer
        {...this.props}
        renderCustomView={() => {
          return LAB.render(this.props.customView);
        }}
      />
    );
  }
}

// const styles = StyleSheet.create({});
