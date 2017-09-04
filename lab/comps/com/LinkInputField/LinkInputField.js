'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { requireComp } from 'lab4';
// TODO xxxx
import CenterInputPage from '../CenterInputPage/CenterInputPage';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Icon = requireComp('com.Icon');
const Touchable = requireComp('com.Touchable');

/**
 * 一个跳页输入表单组件
 * 与 CenterInput、CenterInputPage 组合使用
 * 
 * @export
 * @class LinkInputField
 * @extends {BaseFormField}
 */
export default class LinkInputField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    iconRight: PropTypes.string,
    reg: PropTypes.string,
    placeholder: PropTypes.string,
    able: PropTypes.bool,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    iconRight: 'keyboard-arrow-right',
    placeholder: '请输入',
    able: true,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      textRight: this.props.defaultValue,
    };

    this._onPress = this._onPress.bind(this);
  }

  _onPress(e) {
    if (!this.props.able) {
      return false;
    }

    let element = this.props.element;
    element.defaultValue = this.state.textRight;
    element.name = this.props.name;
    element.reg = this.props.reg;
    element.placeholder = this.props.placeholder;

    let obj = {
      title: this.props.label || this.props.title,
      element: element,
    };

    this.context.router.push({
      comp: CenterInputPage,
      data: {
        data: obj,
        cbk: value => {
          this._onChange(value);
          let a = this.props.name;
          let json = {};
          json[a] = value;
          this.props.onValChange && this.props.onValChange(value);
          this.context.page.props.route.cbk &&
            this.context.page.props.route.cbk(json);
          this.setState({ textRight: value });
        },
      },
    });
  }

  renderContent() {
    return (
      <Touchable
        disabled={!this.props.able}
        onPress={this._onPress}
        style={[this.getStyle('container'), this.props.style]}
      >
        <View style={styles.left}>
          <Text style={this.getStyle('text')} numberOfLines={1}>
            {this.state.textRight || this.props.placeholder}
          </Text>
        </View>
        {!this.props.able
          ? <View style={styles.rightDisableView} />
          : this.props.iconRight
            ? <Icon
                name={this.props.iconRight}
                style={this.getStyle('rightIcon')}
              />
            : null}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },

  // left text
  text: {
    textAlign: 'right',
  },
  rightDisableView: {
    width: 12,
  },
});
