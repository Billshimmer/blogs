'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import LAB, { requireComp } from 'lab4';
import BaseSearchBar from 'lab4/basiccomps/Search/BaseSearchBar';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

export default class SearchBar extends BaseSearchBar {
  static propTypes = {
    ...BaseSearchBar.propTypes,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    autoFocus: PropTypes.bool,
    type: PropTypes.number,
  };

  static defaultProps = {
    enableIOSClearBtn: true,
    type: 1,
    autoFocus: false,
    placeholder: '请输入搜索的内容',
  };

  constructor(props, context) {
    super(props, context);
  }

  onRenderTextInput(isIOS) {
    let inputStyle;
    if (!this.props.enableIOSClearBtn || !isIOS) {
      inputStyle = {
        paddingRight: 40,
      };
    }
    return (
      <TextInput
        style={[this.getStyle('textInput'), inputStyle]}
        autoFocus={this.props.autofocus}
      />
    );
  }

  onRenderClearBtn() {
    return (
      <Touchable style={this.getStyle('clearBtn')}>
        <Icon name="clear" style={this.getStyle('clearBtnIcon')} />
      </Touchable>
    );
  }

  _renderSearchBtn() {
    if (this.props.type == 1) {
      return (
        <Touchable
          onPress={this.onSubmitEditing}
          style={this.getStyle('searchBtn')}
        >
          <Text style={this.getStyle('searchBtnText')}>搜索</Text>
        </Touchable>
      );
    } else if (this.props.type == 2) {
      return (
        <Touchable
          onPress={this.onSubmitEditing}
          style={this.getStyle('searchBtn')}
        >
          <Icon name="search" style={this.getStyle('rightIcon')} />
        </Touchable>
      );
    } else {
      return null;
    }
  }

  _renderIcons() {
    return this.props.type != 2
      ? <Icon name="search" style={this.getStyle('leftIcon')} />
      : null;
  }

  render() {
    return (
      <View style={[this.getStyle('main'), this.props.style]}>
        <View style={this.getStyle('container')}>
          {this._renderIcons()}
          <View style={this.getStyle('textInputArea')}>
            {this.renderTextInput()}
            {this.renderClearBtn()}
          </View>
        </View>
        {this._renderSearchBtn()}
      </View>
    );
  }
}
