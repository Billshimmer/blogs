'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, Image } from 'react-native';
import BaseComponent from 'lab4/core/BaseComponent';
import Validator from 'lab4/basiccomps/Form/Validator';
import { requireComp, requireImage } from 'lab4';

const Icon = requireComp('com.Icon');

/**
 * 表单字段基类
 * 可添加静态变量
 */
export default class BaseFormField extends BaseComponent {
  static propTypes = {
    form: PropTypes.object,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onValueChange: PropTypes.func,
    //value改变
    error: PropTypes.object,
    defaultError: PropTypes.object,
    //TODO defaultError 属性改变
    onValidationChange: PropTypes.func,
    //验证改变回调
    validator: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    labelType: PropTypes.oneOf(['top', 'left', 'none']),
    icon: PropTypes.string,
    //icon name
    image: PropTypes.any,
    //image icon 可以是图片url也可以是Image.source
    label: PropTypes.string,
    refCbk: PropTypes.func,
  };

  static defaultProps = { labelType: 'left' };

  constructor(props, context) {
    super(props, context);
    let error = props.error ||
    props.defaultError || { isValid: null, message: '' };
    this._fieldState = { ...error };

    this._value = props.value || props.defaultValue;
    if (this._value == null) {
      this._value = this._getInitValue();
    }

    this._onChange = this._onChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    if (__DEV__) {
      // 检查子类继承重写方法时是否调用了父类对应的方法
      if (!this.constructor.__overrideChecked) {
        this.constructor.__overrideChecked = true;
        const proto = this.constructor.prototype;
        const that = this;
        const checkSuperCall = function(funcName) {
          if (proto.hasOwnProperty(funcName)) {
            if (proto[funcName].toString().indexOf("'" + funcName + "'") < 0) {
              console.warn(
                'BaseFormField的子类重写' + funcName + '时必须调用父类的方法!!!',
                that.constructor.name,
                __BROWSER__ && that
              );
            }
          }
        };
        checkSuperCall('componentDidMount');
        checkSuperCall('componentWillReceiveProps');
        checkSuperCall('componentDidUpdate');
        checkSuperCall('componentWillUnmount');
      }
    }
  }

  // 获取初始值 默认为undefined 如果子类有必要可重写
  _getInitValue() {}

  getValue() {
    if (this.props.value != null) {
      return this.props.value;
    }
    return this._value;
  }

  getError() {
    return {
      isValid: this._fieldState.isValid,
      message: this._fieldState.message,
    };
  }

  _setFieldState(nextState) {
    Object.assign(this._fieldState, nextState);
    this.forceUpdate();
  }

  setError(error) {
    if (this.props.error) {
      //error 被controlled 不能set
      return;
    }
    this._setFieldState({ isValid: error.isValid, message: error.message });
  }

  validate(force) {
    if (force === false && this._fieldState.isValid === false) {
      return {
        isValid: this._fieldState.isValid,
        message: this._fieldState.message,
      };
    }
    return this._validate(this.getValue());
  }

  componentDidMount() {
    this.props.refCbk && this.props.refCbk(this.props.name, this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this._fieldState.isValid = nextProps.error.isValid;
      this._fieldState.message = nextProps.error.message;
    }
    if (nextProps.value != null) {
      this._value = nextProps.value;
    } else if (this.props.defaultValue !== nextProps.defaultValue) {
      this._value = nextProps.defaultValue;
      this._validate(nextProps.defaultValue);
      if (this.props.onValueChange) {
        //在 defaultValue 改变时也调用onValueChange
        this.forceUpdate(() => {
          this.props.onValueChange(this.getValue());
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value != null && this.props.value !== prevProps.value) {
      //验证controlled value 的合法性
      this._validate(this.props.value);
    }
  }

  componentWillUnmount() {
    this.props.refCbk && this.props.refCbk(this.props.name, null);
  }

  _onChange(value) {
    this.onValueChange(value);
  }

  /**
   * 子类需在value 改变时调用，并传入新value
   * 以便记录当前值，并进行验证，在回调props的onValueChange
   */
  onValueChange(value) {
    if (this.props.value != null) {
    } else {
      this._value = value;
      //更新_value 保持与当前组件的同步
      this._validate(value);
    }
    this.props.onValueChange && this.props.onValueChange(value);
  }

  _validate(value) {
    if (!this.props.validator) {
      return { isValid: true };
    }
    let result = Validator(value, this.props.validator);
    if (
      result.isValid != this._fieldState.isValid ||
      result.message != this._fieldState.message
    ) {
      if (!this.props.error) {
        this._setFieldState(result);
      }
      this.props.onValidationChange && this.props.onValidationChange(result);
    }
    return result;
  }

  /**
   * 获取当前状态的样式
   */
  _getStateStyle(name) {
    if (this._fieldState.isValid === false) {
      return this.getStyle(name, name + 'Error');
    }
    return this.getStyle(name);
  }

  renderIcon() {
    if (this.props.icon) {
      return (
        <Icon name={this.props.icon} style={this._getStateStyle('fieldIcon')} />
      );
    }
    if (this.props.image) {
      return (
        <Image
          source={requireImage(this.props.image)}
          style={this._getStateStyle('fieldImage')}
        />
      );
    }
    return null;
  }

  renderLabelText() {
    if (this.props.label) {
      return (
        <Text style={this._getStateStyle('fieldLabelText')}>
          {this.props.label}
        </Text>
      );
    }
    return null;
  }

  renderLabel() {
    switch (this.props.labelType) {
      case 'top':
      case 'left':
        return (
          <View style={this._getStateStyle('fieldLabelContainer')}>
            {this.renderIcon()}
            {this.renderLabelText()}
          </View>
        );
      default:
        return null;
    }
  }

  renderError() {
    if (this._fieldState.isValid !== false || !this._fieldState.message) {
      return null;
    }
    return (
      <Text style={this.getStyle('fieldError')}>
        {this._fieldState.message}
      </Text>
    );
  }

  render() {
    return (
      <View style={[this._getStateStyle('fieldContainer'), this.props.style]}>
        <View style={this._getStateStyle('fieldContentContainer')}>
          {this.renderLabel()}
          {this.renderContent()}
        </View>
      </View>
    );
    //{this.renderError()}
  }
}
// const styles = StyleSheet.create({
//   container: {
//
//   },
// });
