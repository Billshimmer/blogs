'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, TextInput } from 'react-native';

import BaseSearchBar from './BaseSearchBar';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

export default class SearchBar extends BaseSearchBar {
  // static propTypes = {
  //   ...BaseSearchBar.propTypes,
  // };

  static defaultProps = {
    enableIOSClearBtn: true,
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
    return <TextInput style={[styles.textInput, inputStyle]} />;
  }

  onRenderClearBtn() {
    return (
      <Touchable style={styles.clearBtn}>
        <Text style={styles.clearBtnIcon}>X</Text>
      </Touchable>
    );
  }

  _renderSearchBtn() {
    return (
      <Touchable onPress={this.onSubmitEditing} style={styles.searchBtn}>
        <Text style={styles.searchBtnText}>搜索</Text>
      </Touchable>
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.textInputArea}>
          {this.renderTextInput()}
          {this.renderClearBtn()}
        </View>
        {this._renderSearchBtn()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  textInputArea: {
    flex: 1,
    alignSelf: 'stretch',
  },
  textInput: {
    flex: 1,
  },
  clearBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnIcon: {},
  searchBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  searchBtnText: {
    fontSize: 16,
  },
});
