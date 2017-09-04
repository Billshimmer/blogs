'use strict';

import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, createWebCoreElement } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Image = requireComp('com.Image');
const Icon = requireComp('com.Icon');

export default class CallItem extends LAB.Component {
  static propTypes = {
    number: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
  };

  static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this.defaultStyles = styles;
  }

  render() {
    return (
      <a href={'tel:' + this.props.number} className="lrnw-web-phone">
        <View style={this.getStyle('container')}>
          <View style={this.getStyle('containerLeft')}>
            {this.props.image
              ? <Image uri={this.props.image} style={this.getStyle('image')} />
              : null}
            {this.props.icon && !this.props.image
              ? <Icon name={this.props.icon} style={this.getStyle('icon')} />
              : null}
            {this.props.text
              ? <Text style={this.getStyle('text')}>{this.props.text}</Text>
              : null}
          </View>
          <Icon name="chevron-right" style={this.getStyle('rightIcon')} />
        </View>
      </a>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
