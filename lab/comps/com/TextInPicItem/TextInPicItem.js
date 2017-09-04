'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';

export default class TextInPicItem extends LAB.Component {
  static propTypes = {
    image: PropTypes.object,
    title: PropTypes.string,
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        {this._renderImg(this.props.image)}
        <View style={this.getStyle('titleBox')}>
          <Text style={this.getStyle('title')} numberOfLines={1}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }

  _renderImg(img) {
    if (img) {
      return LAB.render(img, { style: this.getStyle('image') });
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
