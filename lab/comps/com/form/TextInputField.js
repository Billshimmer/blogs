'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import LAB, { requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

const isIOS = Platform.OS == 'ios';

export default class TextInputField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    keyboardType: PropTypes.string,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    editable: PropTypes.bool,
    enableClearBtn: PropTypes.bool, //是否使用ios自带的清除按钮
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

  onRenderClearBtn() {
    if (isIOS) {
      return null;
    }
    if (!this.state.showClearBtn) {
      return null;
    }

    return this.props.enableClearBtn
      ? <Touchable
          style={[styles.clearBtn, this.getStyle('clearBtn')]}
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
            //defaultValue={this.props.defaultValue}
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
            //defaultValue={this.props.defaultValue}
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
