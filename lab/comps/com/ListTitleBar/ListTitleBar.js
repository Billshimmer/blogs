'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
} from 'react-native';
import LAB, { requireComp } from 'lab4';
import { renderImage, renderIcon } from 'lab4/utils/renderUtils';

const Icon = requireComp('com.Icon');

export default class ListTitleBar extends LAB.Component {
  static propTypes = {
    icon: PropTypes.any,
    image: PropTypes.any,
    textLeft: PropTypes.string,
    textRight: PropTypes.string,
    lineOfText: PropTypes.number,
    iconRight: PropTypes.string,
    line: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View>
        <View style={this.getStyle('items')}>
          {this.renderImage()}
          <Text style={this.getStyle('textLeft')} numberOfLines={1}>
            {this.props.textLeft}
          </Text>
          <Text
            style={this.getStyle('textRight')}
            numberOfLines={this.props.lineOfText ? this.props.lineOfText : 1}
          >
            {this.props.textRight}
          </Text>
          {this.renderArrow(this.props.iconRight)}
        </View>
        {this.props.line ? LAB.render(this.props.line) : null}
      </View>
    );
  }

  renderImage() {
    if (this.props.image) {
      return renderImage(this.props.image, {
        style: this.getStyle('image'),
      });
    } else if (this.props.icon) {
      return renderIcon(this.props.icon, {
        style: this.getStyle('icon'),
      });
    }
  }

  renderArrow(name) {
    if (name) {
      if (name == 'addarrow') {
        name = "keyboard-arrow-right";
      }
      return (
        <Icon
          name={name}
          style={this.getStyle('iconRight')}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
