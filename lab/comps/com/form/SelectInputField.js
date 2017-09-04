'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB, { http, Toast, requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Icon = requireComp('com.Icon');
const ActionSelectButton = requireComp('com.ActionSelectButton');

export default class SelectInputField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    submitUrl: PropTypes.string,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    type: 'noIndex',
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    super.componentDidMount();
    this._cbk(this.refs.selectBtn.getValue());
  }

  _onSelect(value) {
    if (
      this.props.submitUrl &&
      this.props.submitUrl != undefined &&
      value.key != 0
    ) {
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
    this.onValueChange(value);
    this.props.onSelect && this.props.onSelect(value);
  }

  _renderIcon() {
    if (this.props.iconRightName) {
      return (
        <Icon
          name={this.props.iconRightName}
          style={this.getStyle('rightIcon')}
        />
      );
    }
    return null;
  }

  renderContent() {
    return (
      <View style={styles.main}>
        <ActionSelectButton
          style_class={this.props.selectClass}
          onSelect={this._onSelect.bind(this)}
          ref="selectBtn"
          type={this.props.type}
          indexData={this.props.indexData}
          data={this.props.data}
          defaultText={this.props.defaultValue || this.props.defaultText}
        />
        {this._renderIcon()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});
