'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { View } from 'react-native';
import LAB from 'lab4';

export default class Line extends LAB.PureComponent {
  static defaultProps = {
    color: Theme.dividerColor,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const props = this.props;
    const style = {
      marginTop: props.marginTop,
      marginBottom: props.marginBottom,
      marginLeft: props.marginLeft,
      marginRight: props.marginRight,
      borderTopWidth: props.size,
      borderTopColor: props.color,
      borderStyle: props.lineStyle,
    };

    return <View style={[this.getStyle('line'), style]} />;
  }
}
