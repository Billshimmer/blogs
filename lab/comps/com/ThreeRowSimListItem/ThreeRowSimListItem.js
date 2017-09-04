'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, Image } from 'react-native';
import LAB, { requireComp } from 'lab4';
import { renderImage, renderIcon } from 'lab4/utils/renderUtils';

const Icon = requireComp('com.Icon');
const Touchable = requireComp('com.Touchable');

export default class ThreeRowSimListItem extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,

    icon: PropTypes.string,
    image: PropTypes.any,

    titleCenter: PropTypes.string,
    lineOfTitle: PropTypes.number,

    rightComps: PropTypes.object,
    textRight: PropTypes.string,
    iconRight: PropTypes.string,
  };

  // static defaultProps = {
  // };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;

    // this._onPress = this._onPress.bind(this);
  }

  // _onPress(e) {
  //   this.props.onPress && this.props.onPress(e);
  // }

  render() {
    return (
      <Touchable
        {...this.props}
        style={this.getStyle('mainWrap')}
      >
        {this._renderView()}
      </Touchable>
    );
  }

  _renderView() {
    return (
      <View style={this.getStyle('container')}>
        {this._renderImage()}
        <View style={this.getStyle('subbox')}>
          <Text
            style={this.getStyle('title')}
            numberOfLines={this.props.lineOfTitle ? this.props.lineOfTitle : 1}
          >
            {this.props.titleCenter}
          </Text>
        </View>

        <View style={this.getStyle('rightBox')}>
          {this._renderObject(this.props.rightComps)}
          {this.props.textRight
            ? <Text style={this.getStyle('textRight')} numberOfLines={1}>
                {this.props.textRight}
              </Text>
            : null}
          {this._renderRightIcon(this.props.iconRight)}
        </View>
      </View>
    );
  }

  _renderObject(obj) {
    if (obj) {
      return obj && LAB.render(obj);
    }
    return null;
  }

  _renderImage() {
    if (this.props.image) {
      return renderImage(this.props.image, {
        style: [this.getStyle('image'), this.props.imageStyle],
      });
    } else if (this.props.icon) {
      return renderIcon(this.props.icon, {
        style: [this.getStyle('icon'), this.props.imageStyle],
      });
    }
  }

  _renderRightIcon(name) {
    if (name) {
      if (name == 'addarrow') {
        name = "keyboard-arrow-right";
      }
      return (
        <Icon
          name={name}
          style={[this.getStyle('iconRight'), this.props.iconRightStyle]}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
