/**
 * Copyright (c) 2015-present, Backustech, Inc.
 * All rights reserved.
 *
 * @Author Zhou.Zeyong
 * @Module AccountValidInputField
 */

'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import LAB, { http, requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

const isIOS = Platform.OS == 'ios';

export default class AccountValidInputField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    keyboardType: PropTypes.string,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    editable: PropTypes.bool,
    enableClearBtn: PropTypes.bool,
    /**
     * Request url for nickname checking.
     * @type {String}
     */
    url: PropTypes.string,
    /**
     * Style for message, which displayed when the value is not valid.
     * @type {StyleSheet}
     */
    messageStyle: PropTypes.any,
    /**
     * The nickname field name.
     * @type {[string]}
     */
    lnickname: PropTypes.string,
    /**
     * Extra request parameter for the API.
     * etc.{type:1}
     * @type {[JSON]}
     */
    extraParameter: PropTypes.any,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    placeholder: '请输入',
    placeholderTextColor: '#BCBCBC',
    enableClearBtn: true,
    keyboardType: 'default',
    editable: true,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showClearBtn: false,
      value: props.value || props.defaultValue || '',
      showMessage: false,
    };
    this.regExp = new RegExp(this.props.regExp);
  }

  onClearPress() {
    if (this.refs.Textin) {
      this.refs.Textin.clear();
      this._onChange('');
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.value && nextProps.value != this.state.value) {
      this.setState({ value: nextProps.value });
      this.regExp = new RegExp(nextProps.regExp);
    } else if (nextProps.defaultValue != this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
      this.regExp = new RegExp(nextProps.regExp);
    }
  }

  _onChange(value) {
    this._validate();
    if (this.props.regExp) {
      if (!this.regExp.test(value)) {
        return;
      }
    }
    this.onValueChange(value);
    this.setState({ value: value });
    if (value) {
      if (!this.state.showClearBtn) {
        this.setState({
          showClearBtn: true,
        });
      }
    } else {
      if (this.state.showClearBtn) {
        this.setState({
          showClearBtn: false,
        });
      }
    }
  }

  _validate() {
    let url = this.props.url;
    let result = {
      isValid: false,
      message: '',
    };
    if (url) {
      let data = this.props.extraParameter;
      data.nickname = this.state.value;
      http
        .post(url, { data: data })
        .then(response => {
          result.isValid = response.CODE == 'ok';
          result.message = response.MESSAGE;
          this._setFieldState(result);
        })
        .catch(error => {
          result.isValid = false;
          result.message = '';
        });
    }
    return result;
  }

  onRenderClearBtn() {
    if (isIOS) {
      return null;
    }
    if (!this.state.showClearBtn) {
      return null;
    }

    return this.props.enableClearBtn
      ? <Touchable
          style={styles.clearBtn}
          onPress={this.onClearPress.bind(this)}
        >
          <Icon name="clear" style={styles.clearBtnIcon} />
        </Touchable>
      : null;
  }

  renderContent() {
    let { styles, value, defaultValue, onChange, ...props } = this.props;

    if (isIOS && this.props.enableClearBtn) {
      let inputStyle = {
        marginRight: 16,
      };
      return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TextInput
            {...props}
            ref="Textin"
            style={[this._getStateStyle('textInput'), inputStyle]}
            onChangeText={this._onChange}
            value={this.state.value}
            placeholder={this.props.placeholder}
            autoFocus={this.props.autoFocus}
            keyboardType={this.props.keyboardType}
            placeholderTextColor={this.props.placeholderTextColor}
            clearButtonMode="always"
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <TextInput
            {...props}
            ref="Textin"
            style={this._getStateStyle('textInput')}
            autoCapitalize="none"
            onChangeText={this._onChange}
            value={this.state.value}
            placeholder={this.props.placeholder}
            autoFocus={this.props.autoFocus}
            keyboardType={this.props.keyboardType}
            placeholderTextColor={this.props.placeholderTextColor}
            editable={this.props.editable}
            underlineColorAndroid="transparent"
          />
          {this.onRenderClearBtn()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  clearBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
  },
  clearBtnIcon: {
    fontSize: 16,
  },
});
