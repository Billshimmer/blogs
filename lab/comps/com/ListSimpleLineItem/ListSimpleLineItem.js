'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, Image } from 'react-native';
import LAB, { requireComp } from 'lab4';
import { renderImage, renderIcon } from 'lab4/utils/renderUtils';

const Icon = requireComp('com.Icon');
const Touchable = requireComp('com.Touchable');

/**
 * 基础列表项
 * 
 * @export
 * @class ListSimpleLineItem
 * @extends {LAB.Component}
 */
export default class ListSimpleLineItem extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,

    icon: PropTypes.any,
    image: PropTypes.any,
    imageStyle: PropTypes.any,
    textLeft: PropTypes.string,
    textLeftStyle: PropTypes.any,
    textRight: PropTypes.string,
    textRightStyle: PropTypes.any,
    lineOfText: PropTypes.number,
    iconRight: PropTypes.string,
    iconRightStyle: PropTypes.any,
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
        style={[this.getStyle('mainWrap'), this.props.style]}
      >
        {this._renderView()}
      </Touchable>
    );
  }

  _renderView() {
    return (
      <View style={this.getStyle('items')}>
        {this.renderImage()}
        {this.props.textLeft
          ? <Text
              style={[this.getStyle('textLeft'), this.props.textLeftStyle]}
              numberOfLines={1}
            >
              {this.props.textLeft}
            </Text>
          : null}
        {this.props.textRight
          ? <Text
              style={[this.getStyle('textRight'), this.props.textRightStyle]}
              numberOfLines={this.props.lineOfText ? this.props.lineOfText : 1}
            >
              {this.props.textRight}
            </Text>
          : null}
        {this.renderArrow(this.props.iconRight)}
      </View>
    );
  }

  renderImage() {
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

  renderArrow(name) {
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
  items: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
