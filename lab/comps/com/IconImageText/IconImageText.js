'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, Image } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Icon = requireComp('com.Icon');

/**
 * 一个包包含Icon、Image、Text 的 Label
 * 
 * @export
 * @class IconImageText
 * @extends {LAB.Component}
 */
export default class IconImageText extends LAB.Component {
  static propTypes = {
    iconName: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    image: PropTypes.object,
    text: PropTypes.string,
    textPosition: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
    numberOfLines: PropTypes.number,
  };

  static defaultProps = {
    iconSize: 20,
    iconColor: 'black',
    textPosition: 'bottom',
    numberOfLines: 1,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    let temp;
    if (this.props.iconName) {
      temp = (
        <Icon
          name={this.props.iconName}
          size={this.props.iconSize}
          color={this.props.iconColor}
        />
      );
    } else {
      temp = this.renderImage(this.props.image);
    }
    let text = this.props.text
      ? <Text
          style={this.getStyle('text')}
          numberOfLines={this.props.numberOfLines}
        >
          {this.props.text}
        </Text>
      : null;

    if (this.props.textPosition === 'top') {
      return (
        <View style={this.getStyle('containerVertical')}>
          {this.props.children}
          {text}
          {temp}
        </View>
      );
    } else if (this.props.textPosition === 'bottom') {
      return (
        <View style={this.getStyle('containerVertical')}>
          {this.props.children}
          {temp}
          {text}
        </View>
      );
    } else if (this.props.textPosition === 'left') {
      return (
        <View style={this.getStyle('containerHorizontal')}>
          {this.props.children}
          {text}
          {temp}
        </View>
      );
    } else if (this.props.textPosition === 'right') {
      return (
        <View style={this.getStyle('containerHorizontal')}>
          {this.props.children}
          {temp}
          {text}
        </View>
      );
    }
  }

  renderImage(img) {
    if (img) {
      return LAB.render(img, { style: this.getStyle('image') });
    }
  }
}

const styles = StyleSheet.create({
  containerVertical: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
