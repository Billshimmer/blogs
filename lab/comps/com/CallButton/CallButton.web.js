'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  createWebCoreElement,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Button = requireComp('com.Button');

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
  }

  render() {
    if (this.props.children) {
      return (
        <a href={'tel:' + this.props.number}>
          <Button
            disabled={true}
            type={this.props.type}
            style={this.props.style}
            style_class={'callbutton-' + this.props.style_class}
          >
            {this.props.children}
          </Button>
        </a>
      );
    }

    return (
      <a href={'tel:' + this.props.number}>
        <Button
          disabled={true}
          type={this.props.type}
          style={this.props.style}
          style_class={'callbutton-' + this.props.style_class}
        >
          {this.props.text}
        </Button>
      </a>
    );
  }
}
