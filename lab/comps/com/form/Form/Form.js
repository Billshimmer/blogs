'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

export default class Form extends LAB.Component {
  static propTypes = {
    value: PropTypes.object, //controlled value  key: fieldName  value: fieldValue
    defaultValue: PropTypes.object,
    onValueChange: PropTypes.func, //数据改变回调
    validator: PropTypes.object, //字段验证 基于https://github.com/chriso/validator.js
    labelType: PropTypes.oneOf(['top', 'left', 'none']), //表单各项统一的labelType
    fieldStyleClass: PropTypes.string, //表单各项统一的style_class
    error: PropTypes.object, //controlled error  key: fieldName  value: {isValid: bool, message: string}
    defaultError: PropTypes.object, //默认错误 在初始时或者值改变时会显示，当某个字段值改变之后消失(或者字段可设定消失条件)
    onValidationChange: PropTypes.func, //表单验证情况改变 参数为error
  };

  // static defaultProps = {
  //
  // };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: props.value || {},
    };
    this._fields = Object.create(null);

    this._setFieldRef = this._setFieldRef.bind(this);
    this._processChild = this._processChild.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != null) {
      this.state.value = nextProps.value;
    }
  }

  /**
   * 触发一次Form验证
   * @param force 是否强制刷新当前未通过验证的项
   * @return {isValid: bool, error: {...}}
   */
  validate(force) {
    let isValid = true;
    let error = {};
    for (let name in this._fields) {
      error[name] = this._fields[name].validate(force);
      if (!error[name].isValid) {
        isValid = false;
      }
    }
    return {
      isValid,
      error,
    };
  }

  /**
   * 获取Form数据
   * @return json 键值对
   */
  getValue() {
    return Object.assign({}, this.state.value);
  }

  getError() {
    let error = {};
    for (let name in this._fields) {
      error[name] = this._fields[name].getError();
    }
    return error;
  }

  setError(error) {
    for (let name in error) {
      if (error.hasOwnProperty(name) && this._fields[name]) {
        this._fields[name].setError(error[name]);
      }
    }
  }

  /**
   * 获取表单中某一个字段对应的Component
   */
  getField(name) {
    return this._fields[name];
  }

  _setFieldRef(name, field) {
    if (field) {
      this._fields[name] = field;
      if (this.props.value == null) {
        //获取组件初始值
        this.state.value[name] = field.getValue();
      }
    } else {
      delete this._fields[name];
      if (this.props.value == null) {
        delete this.state.value[name];
      }
    }
  }

  _handleChange(fieldName, fieldValue) {
    if (this.props.value == null) {
      this.state.value[fieldName] = fieldValue;
      if (this.props.onValueChange) {
        // TODO 是否需要forceUpdate?
        this.forceUpdate(() => {
          this.props.onValueChange(this.state.value);
        });
      }
    } else if (this.props.onValueChange) {
      let newValue = Object.assign({}, this.state.value);
      newValue[fieldName] = fieldValue;
      this.props.onValueChange(newValue);
    }
  }

  _handleValidationChange(fieldName, fieldError) {
    if (this.props.onValidationChange) {
      let error = this.getError();
      error[fieldName] = fieldError;
      this.props.onValidationChange(error);
    }
  }

  _childrenWithProps(children) {
    if (Array.isArray(children)) {
      return React.Children.map(children, this._processChild);
    }
    return this._processChild(children);
  }

  _processChild(element) {
    if (
      !element ||
      typeof element !== 'object' ||
      !element.type ||
      element.type === Text
    ) {
      return element;
    }

    if (!BaseFormField.prototype.isPrototypeOf(element.type.prototype)) {
      return React.cloneElement(element, {
        children: this._childrenWithProps(element.props.children),
      });
    }

    let eleProps = element.props;
    let name = eleProps.name;
    let value;
    if (this.props.value != null || element.type.controlled) {
      value = this.state.value[name];
    }
    let defaultValue;
    if (this.props.defaultValue) {
      defaultValue = this.props.defaultValue[name];
    }
    if (defaultValue == null) {
      defaultValue = element.props.defaultValue;
    }

    return React.cloneElement(element, {
      refCbk: this._setFieldRef,
      form: this,
      value,
      defaultValue,
      onValueChange: this._handleChange.bind(this, name),
      labelType: eleProps.labelType || this.props.labelType,
      styles: eleProps.styles || this.getStyles(),
      style_class: eleProps.style_class || this.props.fieldStyleClass,
      validator: this.props.validator && this.props.validator[name],
      error: this.props.error && (this.props.error[name] || { isValid: null }),
      defaultError: this.props.defaultError && this.props.defaultError[name],
      onValidationChange: this._handleValidationChange.bind(this, name),
    });
  }

  render() {
    return (
      <View
        {...this.props}
        style={[this.getStyle('container'), this.props.style]}
      >
        {this._childrenWithProps(this.props.children)}
      </View>
    );
  }
}
