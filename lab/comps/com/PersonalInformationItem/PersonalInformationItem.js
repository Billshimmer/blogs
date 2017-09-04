'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
} from 'react-native';
import LAB from 'lab4';

export default class PersonalInformationItem extends LAB.Component {
  static propTypes = {
    image: PropTypes.object,
    name: PropTypes.string,
    integral: PropTypes.number,
    isVip: PropTypes.bool,
  };

  static defaultProps = {
    isVip: false,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        <View>
          {this.renderImage(this.props.image)}
          {this.props.isVip
            ? <View style={this.getStyle('vip')}>
                <Text style={this.getStyle('vipText')}>V</Text>
              </View>
            : null}
        </View>
        <View style={this.getStyle('subbox')}>
          <Text style={this.getStyle('name')} numberOfLines={1}>
            {this.props.name}
          </Text>
          <Text style={this.getStyle('integral')} numberOfLines={1}>
            {'可用积分：' + this.props.integral + ' 分'}
          </Text>
        </View>
      </View>
    );
  }

  renderImage(img) {
    if (img) {
      //return <Image style={this.getStyle('image')} source={LAB.requireImage(src)} />;
      return LAB.render(img, { style: this.getStyle('image') });
    }
  }
}

const styles = StyleSheet.create({
  vip: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  subbox: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
