'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Button = requireComp('com.Button');
const Icon = requireComp('com.Icon');
const Image = requireComp('com.Image');

/**
 * 一个包包含Icon、Image、Text 的 Button
 * 
 * @export
 * @class IconImageButton
 * @extends {LAB.Component}
 */
export default class IconImageButton extends LAB.Component {
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
    numberOfLines: 1,
    iconSize: 20,
    iconColor: 'black',
    textPosition: 'bottom',
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
    this.renderImage = this.renderImage.bind(this);
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
        <Button
          {...this.props}
          style_class={'IconImage-' + this.props.style_class}
          style={this.getStyle('containerVertical')}
        >
          {text}
          {temp}
          {this.props.children}
        </Button>
      );
    } else if (this.props.textPosition === 'bottom') {
      return (
        <Button
          {...this.props}
          style_class={'IconImage-' + this.props.style_class}
          style={this.getStyle('containerVertical')}
        >
          {temp}
          {text}
          {this.props.children}
        </Button>
      );
    } else if (this.props.textPosition === 'left') {
      return (
        <Button
          {...this.props}
          style_class={'IconImage-' + this.props.style_class}
          style={this.getStyle('containerHorizontal')}
        >
          {text}
          {temp}
          {this.props.children}
        </Button>
      );
    } else if (this.props.textPosition === 'right') {
      return (
        <Button
          {...this.props}
          style_class={'IconImage-' + this.props.style_class}
          style={this.getStyle('containerHorizontal')}
        >
          {temp}
          {text}
          {this.props.children}
        </Button>
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  containerHorizontal: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
