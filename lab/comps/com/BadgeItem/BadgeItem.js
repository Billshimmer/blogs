'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Badge = requireComp('com.Badge');
const Touchable = requireComp('com.Touchable');

export default class BadgeItem extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    badgeText: PropTypes.string,
    badgeIcon: PropTypes.string,
    badgeImage: PropTypes.string,
    style_class: PropTypes.string,
  };
  static defaultProps = {
    style_class: 'default',
  };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this.defaultStyles = styles;
    // this.onPress = this.onPress.bind(this);
  }

  render() {
    return (
      <Touchable
        disabled={this.props.disabled}
        onPress={this.props.onPress}
        activeOpacity={this.props.activeOpacity}
        link={this.props.link}
        emit={this.props.emit}
        style={this.getStyle('container')}
      >
        {this.props.children}
        <Badge
          text={this.props.badgeText}
          icon={this.props.badgeIcon}
          image={this.props.badgeImage}
          style_class={'default,badgeItem-' + this.props.style_class}
          style={this.getStyle('badgePosition')}
        />
      </Touchable>
    );
  }

  // onPress(e) {
  //   this.props.onPress && this.props.onPress(e);
  // }
}

const styles = StyleSheet.create({
  // container: {},
  badgePosition: {
    position: 'absolute',
  },
});
