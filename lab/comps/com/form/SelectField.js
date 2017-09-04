'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB, { http, Toast, requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Select = requireComp('com.Select');
const Icon = requireComp('com.Icon');

export default class SelectField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    disabled: PropTypes.bool,
    submitUrl: PropTypes.string,
    data: PropTypes.array,
    placeholder: PropTypes.string,
    title: PropTypes.object, //ios弹出层控制
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    disabled: false,
    placeholder: '请选择',
    selectClass: 'select-field-default',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.defaultValue || null,
    };
    this.defaultStyles = styles;
    this._onSelect = this._onSelect.bind(this);
  }

  componentWillReceiveProps(newProps) {
    super.componentWillReceiveProps(newProps);
    if (newProps.defaultValue != this.props.defaultValue) {
      this.setState({ value: newProps.defaultValue });
    }
  }

  _onSelect(i) {
    if (!this.props.data || !this.props.data.length) {
      return;
    }

    let value = i == -1 ? undefined : this.props.data[i];
    if (this.props.submitUrl && value) {
      let aa = this.props.name;
      let json = {};
      json[aa] = value.key;

      http
        .post(this.props.submitUrl, {
          data: json,
        })
        .then(response => {
          // console.log(JSON.stringify(response));
          if (response.CODE == 'ok') {
            Toast.show('选择成功');
            this._cbk(value);
          } else {
            this.context.popup.alert({
              message: response.MESSAGE,
              buttons: [
                {
                  text: '确定',
                },
              ],
            });
          }
        })
        .catch(error => {
          if (__DEV__) console.log(JSON.stringify(error));
        });
    } else {
      this._cbk(value);
    }
  }

  _cbk(value) {
    this.setState({ value: value });
    this.onValueChange(value);
    this.props.onSelect && this.props.onSelect(value);
  }

  _renderIcon() {
    if (!this.props.disabled && this.props.iconRight) {
      return (
        <Icon name={this.props.iconRight} style={this.getStyle('iconRight')} />
      );
    }
    return null;
  }

  renderContent() {
    return (
      <View
        style={[
          this.getStyle('main'),
          { paddingRight: this.props.disabled ? 12 : 0 },
        ]}
      >
        <Select
          data={this.props.data}
          disabled={this.props.disabled}
          style={{ flex: 1 }}
          text={this.state.value && this.state.value.value}
          defaultText={this.props.placeholder}
          defaultValue={this.state.value && 999} //随便传个defaultValue使得不使用defaultText
          style_class={this.props.selectClass}
          title={this.props.title}
          onChange={this._onSelect}
        />
        {this._renderIcon()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height: 44,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iconRight: {},
});
