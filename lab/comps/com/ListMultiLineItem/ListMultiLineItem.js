'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { requireComp } from 'lab4';
import { renderImage } from 'lab4/utils/renderUtils';

const Touchable = requireComp('com.Touchable');

export default class ListMultiLineItem extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,

    image: PropTypes.object,
    title: PropTypes.string,
    textRight: PropTypes.string,
    lineOfTitle: PropTypes.number,
    describe: PropTypes.string,
    lineOfDesc: PropTypes.number,
    footText: PropTypes.string,
    footnote: PropTypes.object,
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
        onPress={this.props.onPress}
        style={this.getStyle('mainWrap')}
      >
        {this._renderView()}
      </Touchable>
    );
  }

  _renderView() {
    return (
      <View style={this.getStyle('container')}>
        {this.props.image && renderImage(this.props.image, {
          style: this.getStyle('image'),
        })}
        <View style={this.getStyle('subbox')}>
          <View style={this.getStyle('topwarp')}>
            <Text
              style={this.getStyle('title')}
              numberOfLines={
                this.props.lineOfTitle ? this.props.lineOfTitle : 1
              }
            >
              {this.props.title}
            </Text>
            {this.props.textRight
              ? <Text style={this.getStyle('textRight')} numberOfLines={1}>
                  {this.props.textRight}
                </Text>
              : null}
          </View>
          <Text
            style={this.getStyle('describe')}
            numberOfLines={this.props.lineOfDesc ? this.props.lineOfDesc : 1}
          >
            {this.props.describe}
          </Text>
          {this.props.footText
            ? <Text style={this.getStyle('footText')}>
                {this.props.footText}
              </Text>
            : null}
          {this.props.footnote
            ? LAB.render(this.props.footnote, {
                style: this.getStyle('footnote'),
              })
            : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  topwarp: {
    flexDirection: 'row',
  },
});
