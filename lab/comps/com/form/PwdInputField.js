'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB, { requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Touchable = requireComp('com.Touchable');
const Image = requireComp('com.Image');
const Icon = requireComp('com.Icon');

export default class PwdInputField extends BaseFormField {
  static contextTypes = {
    emitter: PropTypes.object,
  };

  static propTypes = {
    ...BaseFormField.propTypes,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    autoFocus: PropTypes.bool,
    visibleIcon: PropTypes.string,
    unvisibleIcon: PropTypes.string,
    maxLength: PropTypes.number,
    visibleImage: PropTypes.string,
    unvisibleImage: PropTypes.string,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    placeholder: '请输入你的密码',
    placeholderTextColor: '#BCBCBC',
    autoFocus: false,
    maxLength: 18,
    keyboardType: 'default',
    visibleIcon: 'visibility',
    unvisibleIcon: 'visibility-off',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showPwd: false,
      editable: true,
      name: this.props.unvisibleIcon,
      image: this.props.unvisibleImage,
    };
  }

  pwdShow() {
    if (this.state.showPwd) {
      this.setState({
        showPwd: false,
        name: this.props.unvisibleIcon,
        image: this.props.unvisibleImage,
      });
    } else {
      this.setState({
        showPwd: true,
        name: this.props.visibleIcon,
        image: this.props.visibleImage,
      });
    }
  }

  _renderIcon() {
    if (this.props.visibleImage) {
      return (
        <Image
          style={this.getStyle('field_image')}
          uri={this.state.image}
          resizeMode="contain"
        />
      );
    }

    if (this.props.visibleIcon) {
      return <Icon style={this.getStyle('icons')} name={this.state.name} />;
    }
    return null;
  }

  renderContent() {
    return (
      <View style={[styles.main, this.props.style]}>
        <TextInput
          style={this.getStyle('textInput')}
          ref="PwdInput"
          onChangeText={this.onValueChange}
          autoCapitalize="none"
          editable={this.state.editable}
          secureTextEntry={!this.state.showPwd}
          keyboardType={this.props.keyboardType}
          defaultValue={this.props.defaultValue}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          placeholderTextColor={this.props.placeholderTextColor}
          maxLength={this.props.maxLength}
          underlineColorAndroid="transparent"
        />
        <Touchable onPress={this.pwdShow.bind(this)} style={styles.icon}>
          {this._renderIcon()}
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    padding: 10,
  },
});
