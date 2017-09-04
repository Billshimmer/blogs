'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

export default class LinkWrapItem extends LAB.Component {
  // static propTypes = {};

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
    this._onPress = this._onPress.bind(this);
  }

  _onPress(e) {
    if (/http/.test(this.props.link.url)) {
      location.href = this.props.link.url;
      return true;
    } else {
      this.props.onPress && this.props.onPress(e);
    }
  }

  render() {
    return (
      <Touchable
        {...this.props}
        onPress={this._onPress}
        style={this.getStyle('mainWrap')}
      >
        <View style={this.getStyle('container')}>
          {this.props.children}
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
