'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB, { http, Toast, requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Touchable = requireComp('com.Touchable');
const Image = requireComp('com.Image');

export default class CaptchaInputField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    url: PropTypes.string,
    maxLength: PropTypes.number,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    placeholder: '请输入验证码',
    placeholderTextColor: '#BCBCBC',
    maxLength: 6,
  };

  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  constructor(props, context) {
    super(props, context);
    this._initial();
  }

  _initial() {
    let time = Date.now();
    this.state = {
      uri: this.props.url + '&random=' + time,
    };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
  }

  renderContent() {
    return (
      <View style={styles.main}>
        <TextInput
          style={this.getStyle('textInput')}
          ref="_codeInput"
          onChangeText={this.onValueChange}
          placeholder={this.props.placeholder}
          maxLength={this.props.maxLength}
          autoCapitalize="none"
          placeholderTextColor={this.props.placeholderTextColor}
          underlineColorAndroid="transparent"
        />
        <Touchable
          onPress={() => {
            let time = Date.now();
            this.setState({
              uri: this.props.url + '&random=' + time,
            });
          }}
        >
          <Image
            uri={this.state.uri}
            style={styles.img}
            resizeMode="stretch"
          />
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
  },
  img: {
    width: 100,
    height: 40,
  },
});
