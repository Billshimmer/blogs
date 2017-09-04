'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';
import BasicDropDownMenu from 'lab4/basiccomps/DropDownMenu/DropDownMenu';

const DDM = '_ddm';

export default class DropDownMenu extends LAB.Component {
  static propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  };

  constructor(props, context) {
    super(props, context);
    this._menuStyle = null;
  }

  componentWillMount() {
    if (!this.props.item) {
      this._mergeMenuStyle();
    }
  }

  _renderItem(data, level, isSelect, hasChildren) {
    return LAB.createOrCloneElement(this.props.item, {
      data: data,
      level: level,
      isSelect: isSelect,
      hasChildren: hasChildren,
    });
  }

  _createStyle(name, num) {
    if (!name || num <= 0) {
      return;
    }
    let style = [];
    for (let index = 1; index <= num; index++) {
      style.push(this.getStyle(name + '_' + index));
    }
    return style;
  }

  _mergeMenuStyle() {
    let normalBackground = this._createStyle('normalBackground', 3);
    let selectedBackground = this._createStyle('selectedBackground', 3);
    let normalFont = this._createStyle('normalFont', 3);
    let selectedFont = this._createStyle('selectedFont', 3);
    let normalArrow = this._createStyle('normalArrow', 3);
    let selectedArrow = this._createStyle('selectedArrow', 3);
    this._menuStyle = {
      normalBackground: normalBackground,
      selectedBackground: selectedBackground,
      normalFont: normalFont,
      selectedFont: selectedFont,
      normalArrow: normalArrow,
      selectedArrow: selectedArrow,
    };
  }

  render() {
    return (
      <BasicDropDownMenu
        {...this.props}
        menuStyle={this._menuStyle}
        renderItem={this.props.item && this._renderItem}
        ref={DDM}
      />
    );
  }
}
