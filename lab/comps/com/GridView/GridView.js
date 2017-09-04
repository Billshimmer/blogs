'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';
import BasicGridView from 'lab4/basiccomps/GridView/GridView';

/**
 * 九宫格块
 * 
 * @export
 * @class GridView
 * @extends {LAB.Component}
 */
export default class GridView extends LAB.Component {
  static propTypes = {
    item: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  constructor(props, context) {
    super(props, context);
    this._renderItem = this._renderItem.bind(this);
  }

  _renderItem(item) {
    if (this.props.item) {
      return LAB.createElement(this.props.item, {
        ...item,
        style: this.getStyle('item'),
      });
    }
    return LAB.render(item, { style: this.getStyle('item') });
  }

  render() {
    return (
      <BasicGridView
        {...this.props}
        gridBorderStyle={[this.getStyle('border')]}
        renderItem={this._renderItem}
        style={this.getStyle('container')}
        itemStyle={this.getStyle('itemContainer')}
      />
    );
  }
}
