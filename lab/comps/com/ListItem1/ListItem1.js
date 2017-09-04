'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';

export default class ListItem1 extends LAB.Component {
  static propTypes = {
    icon: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={[this.getStyle('container'), this.props.style]}>
        {this.props.icon && LAB.render(this.props.icon)}
        <View style={this.getStyle('right')}>
          <Text style={this.getStyle('title')}>{this.props.title}</Text>
          <Text style={this.getStyle('desc')}>{this.props.desc}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
  },
});
