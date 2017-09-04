'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  Linking,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Button = requireComp('com.Button');

/**
 * 打电话按钮 基于Button
 * 
 * @export
 * @class CallButton
 * @extends {LAB.Component}
 */
export default class CallButton extends LAB.Component {
  static contextTypes = {
    popup: PropTypes.object,
  };

  static propTypes = {
    number: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    text: '拨打',
    style_class: 'default',
    type: 'outline',
  };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this._onPress = this._onPress.bind(this);
  }

  render() {
    if (this.props.children) {
      return (
        <Button
          type={this.props.type}
          onPress={this._onPress}
          style={this.props.style}
          style_class={'callbutton-' + this.props.style_class}
        >
          {this.props.children}
        </Button>
      );
    }

    return (
      <Button
        type={this.props.type}
        onPress={this._onPress}
        style={this.props.style}
        style_class={'callbutton-' + this.props.style_class}
      >
        {this.props.text}
      </Button>
    );
  }

  _onPress() {
    this.context.popup.confirm({
      message: this.props.number,
      buttons: [
        {
          text: '取消',
        },
        {
          text: '拨打',
          onPress: () => {
            if (this.props.number) {
              let url = 'tel:' + this.props.number;
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                }
              });
            }
          },
        },
      ],
    });
  }
}
