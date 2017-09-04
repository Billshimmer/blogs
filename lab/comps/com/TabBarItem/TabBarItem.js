'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, Image } from 'react-native';
import LAB, { requireComp, requireImage } from 'lab4';

const Icon = requireComp('com.Icon');

export default class TabBarItem extends LAB.Component {
  static propTypes = {
    icon: PropTypes.string,
    image: PropTypes.any,
    activeImage: PropTypes.string,
    text: PropTypes.string,
    isActive: PropTypes.bool,
    flag: PropTypes.bool,
  };

  static defaultProps = {
    flag: false,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    const { isActive, icon, flag, text } = this.props;

    if (isActive) {
      this._textColor = this.getStyle('activeColor');
      this._bgColor = this.getStyle('activeBackgroundColor');
      this._iconColor = this.getStyle('activeIconColor');
    } else {
      this._textColor = null;
      this._bgColor = null;
      this._iconColor = null;
    }
    const image = isActive && this.props.activeImage
      ? this.props.activeImage
      : this.props.image;

    return (
      <View
        style={[this.getStyle('container'), this._bgColor, this.props.style]}
      >
        <View style={this.getStyle('itemDirection')}>
          {image
            ? <Image
                style={this.getStyle('image')}
                source={requireImage(image)}
              />
            : null}
          {icon && !image
            ? <Icon
                name={icon}
                style={[this.getStyle('icon'), this._iconColor]}
              />
            : null}
          {text
            ? <Text
                style={[this.getStyle('text'), this._textColor]}
                numberOfLines={1}
              >
                {this.props.text}
              </Text>
            : null}
          {flag ? <View style={this.getStyle('flag')} /> : null}
          {this.props.children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
