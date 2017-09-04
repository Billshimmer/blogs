'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB from 'lab4';

export default class BlankBlock extends LAB.Component {
  static propTypes = {
    height: PropTypes.number,
    bgColor: PropTypes.string,
  };

  static defaultProps = {
    bgColor: Theme.blankBlockColor, //默认设置为主题的分隔块背景色
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const propStyle = {};
    if (this.props.height) {
      propStyle.height = this.props.height;
    }
    if (this.props.bgColor) {
      propStyle.backgroundColor = this.props.bgColor;
    }
    return <View style={[this.getStyle('blank'), propStyle]} />;
  }
}

const styles = StyleSheet.create({
  blank: {
    height: 10,
  },
});
BlankBlock.defaultStyles = styles;
