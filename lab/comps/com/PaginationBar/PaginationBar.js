'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';

import LAB from 'lab4';

export default class PaginationBar extends LAB.Component {
  static propTypes = {
    activeTab: PropTypes.number,
    length: PropTypes.number,
  };
  static defaultProps = {
    activeTab: 3,
    length: 5,
  };

  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this.defaultStyles = styles;
  }

  render() {
    let temp = [];
    for (let i = 0; i < this.props.length; i++) {
      temp.push(
        <View
          key={i}
          style={[
            this.getStyle('item', i == this.props.activeTab && 'activeColor'),
          ]}
        />
      );
    }
    return (
      <View style={this.getStyle('container')}>
        {temp}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {},
  activeColor: {},
});
