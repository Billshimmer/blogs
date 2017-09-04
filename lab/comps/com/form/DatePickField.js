'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB, { utils, requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Touchable = requireComp('com.Touchable');
const DatePick = requireComp('com.DatePick');
const Icon = requireComp('com.Icon');

export default class DatePickField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    format: PropTypes.string, //格式化时间参数
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    disable: PropTypes.bool,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    placeholder: '请选择',
    placeholderTextColor: '#BCBCBC',
    disabled: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      value: props.value || props.defaultValue,
    };
    this.defaultStyles = styles;
  }

  // componentWillReceiveProps(nextProps) {
  //   super.componentWillReceiveProps(nextProps);
  // }

  _onChange(x) {
    let value;
    if (x) {
      value = (x.getTime() / 1000) >> 0;
    }
    this.onValueChange(value);
    this.setState({ value: value });
  }

  formatDate(x, format) {
    let date = new Date(x * 1000);
    let paddNum = num => {
      num += '';
      return num.replace(/^(\d)$/, '0$1');
    };
    //指定格式字符
    var cfg = {
      yyyy: date.getFullYear(), //年 : 4位
      yy: date.getFullYear().toString().substring(2), //年 : 2位
      M: date.getMonth() + 1, //月 : 如果1位的时候不补0
      MM: paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
      d: date.getDate(), //日 : 如果1位的时候不补0
      dd: paddNum(date.getDate()), //日 : 如果1位的时候补0
      hh: date.getHours(), //时
      mm: date.getMinutes(), //分
      ss: date.getSeconds(), //秒
    };
    format || (format = 'yyyy-MM-dd hh:mm:ss');
    return format.replace(/([a-z])(\1)*/gi, function(m) {
      return cfg[m];
    });
  }

  renderContent() {
    return (
      <View style={this.getStyle('container')}>
        <Touchable
          style={this.getStyle('button')}
          onPress={() => {
            !this.props.disabled && this.setState({ show: true });
          }}
        >
          <Text
            style={[
              this.getStyle('text'),
              !this.state.value && { color: this.props.placeholderTextColor },
            ]}
          >
            {this.state.value
              ? utils.timeFormat(this.props.format, this.state.value)
              : this.props.placeholder}
          </Text>
          {this.props.iconRight && !this.props.disabled
            ? <Icon
                name={this.props.iconRight}
                style={this.getStyle('iconRight')}
              />
            : <View style={this.getStyle('noIconBlock')} />}
        </Touchable>
        <DatePick
          //{...this.props}
          mode={this.props.mode}
          cancelText={this.props.cancelText}
          confirmText={this.props.confirmText}
          style_class={this.props.datePickClass}
          date={this.state.value ? new Date(this.state.value * 1000) : null}
          onSelect={this._onChange}
          show={this.state.show}
          onCancel={() => {
            this.setState({ show: false });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
  iconRight: {},
  noIconBlock: {
    width: 12,
  },
});
