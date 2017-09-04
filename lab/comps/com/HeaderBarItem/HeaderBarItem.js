'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, Image } from 'react-native';
import LAB, { requireComp, requireImage } from 'lab4';

const Icon = requireComp('com.Icon');
const Touchable = requireComp('com.Touchable');

export default class HeaderBarItem extends LAB.Component {
  static itemPubPropTypes = {
    text: PropTypes.string,
    image: PropTypes.any,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    color: PropTypes.string,
    flag: PropTypes.bool, // TODO 功能增强
    isTextRight: PropTypes.bool,
  };

  static propTypes = {
    //...HeaderBarItem.itemPubPropTypes,
    textStyle: Text.propTypes.style,
    imageStyle: Image.propTypes.style,
    iconStye: PropTypes.any,
  };

  static defaultProps = {
    iconSize: 24,
    isTextRight: true,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    let icon;
    if (this.props.icon) {
      icon = (
        <Icon
          name={this.props.icon}
          size={this.props.iconSize}
          color={this.props.color}
          style={[this.props.iconStyle, this.getStyle('icon')]}
        />
      );
    } else if (this.props.image) {
      icon = (
        <Image
          source={requireImage(this.props.image)}
          style={[this.props.imageStyle, this.getStyle('image')]}
        />
      );
    }

    const text = this.props.text
      ? <Text
          style={[
            styles.text,
            { color: this.props.color },
            this.props.textStyle,
            this.getStyle('text'),
          ]}
        >
          {this.props.text}
        </Text>
      : null;

    return (
      <Touchable
        {...this.props}
        style={[
          styles.container,
          this.props.style,
          text && this.getStyle('textContainer'),
        ]}
      >
        {this.props.isTextRight ? icon : text}
        {this.props.isTextRight ? text : icon}
        {this.props.flag ? <View style={this.getStyle('flag')} /> : null}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: Theme.headerBarHeight,
  },
  flag: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 6,
    width: 6,
    backgroundColor: 'red',
    borderRadius: 3,
  },
  text: {
    fontSize: 16,
    // marginLeft: 12, marginRight: 12,
    textAlign: 'center',
  },
  textContainer: {
    width: null,
    paddingLeft: 9,
    paddingRight: 9,
  },
});
