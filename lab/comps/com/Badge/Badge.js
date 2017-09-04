'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Icon = requireComp('com.Icon');
const Image = requireComp('com.Image');

const flattenStyle = StyleSheet.flatten;

export default class Badge extends LAB.Component {
  static propTypes = {
    text: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
    //以下废弃
    radius: PropTypes.number,
    multiple: PropTypes.number, //  字号／半径
  };

  static defaultProps = {
    multiple: 1.5,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      width: null,
    };
    this.defaultStyles = styles;
    this.getWidth = this.getWidth.bind(this);
  }

  render() {
    if (this.props.radius) {
      //旧版 已废弃
      return (
        <View
          style={[
            this.getStyle('container'),
            {
              overflow: 'hidden',
              paddingHorizontal: this.props.radius / 2,
              borderRadius: this.props.radius,
            },
          ]}
        >
          <Text
            style={[
              this.getStyle('text'),
              { fontSize: this.props.radius * this.props.multiple },
            ]}
          >
            {this.props.text}
          </Text>
        </View>
      );
    } else {
      //新版

      if (!this.props.text && !this.props.icon && !this.props.image) {
        return null;
      }

      return (
        <View
          style={[
            this.getStyle('container'),
            this.props.style,
            { width: this.state.width },
          ]}
        >
          {!this.props.icon && !this.props.image
            ? <Text
                onLayout={this.getWidth}
                numberOfLines={1}
                style={this.getStyle('text')}
              >
                {this.props.text}
              </Text>
            : null}
          {this.props.icon
            ? <Icon
                onLayout={this.getWidth}
                name={this.props.icon}
                style={this.getStyle('icon')}
              />
            : null}
          {!this.props.icon && this.props.image
            ? <Image
                onLayout={this.getWidth}
                uri={this.props.image}
                style={this.getStyle('image')}
              />
            : null}
        </View>
      );
    }
  }
  getWidth(e) {
    let containerStyle = flattenStyle(this.getStyle('container'));
    let temp =
      e.nativeEvent.layout.width + 2 * containerStyle.paddingHorizontal;
    if (temp <= containerStyle.height) {
      !this.state.width && this.setState({ width: containerStyle.height });
    } else {
      this.state.width && this.setState({ width: null });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: undefined,
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});
