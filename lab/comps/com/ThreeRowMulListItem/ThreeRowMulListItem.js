'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, Image } from 'react-native';
import LAB, { requireComp } from 'lab4';
import { renderImage, renderIcon } from 'lab4/utils/renderUtils';

const Icon = requireComp('com.Icon');
const Touchable = requireComp('com.Touchable');

export default class ThreeRowMulListItem extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,

    image: PropTypes.any,

    titleCenter: PropTypes.string,
    lineOfTitle: PropTypes.number,
    titleRightText: PropTypes.string,

    // descCenterType:PropTypes.string,
    descCenterComps: PropTypes.object,
    descCenterText: PropTypes.string,
    lineOfDesc: PropTypes.number,

    // footCenterType:PropTypes.string,
    footCenterComps: PropTypes.object,
    footCenterText: PropTypes.string,
    lineOfFoot: PropTypes.number,

    rightComps: PropTypes.object,
    textRight: PropTypes.string,
    iconRight: PropTypes.string,
  };

  static defaultProps = {
    lineOfFoot: 1,
  };

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
      <View style={[this.getStyle('container'), this.props.style]}>
        {this.props.image && renderImage(this.props.image, {
          style: this.getStyle('image'),
        })}
        <View style={this.getStyle('subbox')}>
          <View style={this.getStyle('topwrap')}>
            {this.props.titleCenter
              ? <Text
                  style={this.getStyle('title')}
                  numberOfLines={
                    this.props.lineOfTitle ? this.props.lineOfTitle : 1
                  }
                >
                  {this.props.titleCenter}
                </Text>
              : null}

            {this.props.titleRightText
              ? <Text style={this.getStyle('titleRightText')} numberOfLines={1}>
                  {this.props.titleRightText}
                </Text>
              : null}
          </View>

          {this.props.descCenterComps || this.props.descCenterText
            ? <View style={this.getStyle('descwrap')}>
                {this._renderObject(this.props.descCenterComps)}
                {this.props.descCenterText
                  ? <Text
                      style={this.getStyle('desc')}
                      numberOfLines={
                        this.props.lineOfDesc ? this.props.lineOfDesc : 1
                      }
                    >
                      {this.props.descCenterText}
                    </Text>
                  : null}
              </View>
            : null}

          {this.props.footCenterComps || this.props.footCenterText
            ? <View style={this.getStyle('footwrap')}>
                {this._renderObject(this.props.footCenterComps)}
                {this.props.footCenterText
                  ? <Text
                      style={this.getStyle('foot')}
                      numberOfLines={this.props.lineOfFoot}
                    >
                      {this.props.footCenterText}
                    </Text>
                  : null}
              </View>
            : null}
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
    //  flexWrap:'wrap',
    //  alignItems:'center',
  },
  topwrap: {
    flexDirection: 'row',
  },
});
