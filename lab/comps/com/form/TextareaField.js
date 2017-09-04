'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

export default class TextareaField extends BaseFormField {
  static contextTypes = {
    emitter: PropTypes.object,
  };

  static propTypes = {
    ...BaseFormField.propTypes,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    autoFocus: PropTypes.bool,
    numberOfLines: PropTypes.number,
    maxLength: PropTypes.number,
    lengthPrompt: PropTypes.bool,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    placeholderTextColor: '#BCBCBC',
    autoFocus: false,
    lengthPrompt: true,
    maxLength: 200,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      length: 0,
    };
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.props.defaultValue && this.props.defaultValue.length) {
      this.setState({
        length: this.props.defaultValue.length,
      });
    }
  }

  _onChange(value) {
    this.onValueChange(value);

    this.setState({
      length: value.length,
    });
  }

  _renderFooter() {
    return this.props.lengthPrompt
      ? <Text style={this.getStyle('footer')}>
          {this.state.length + '/' + this.props.maxLength}
        </Text>
      : null;
  }

  renderContent() {
    return (
      <View style={this.getStyle('container')}>
        <TextInput
          style={this.getStyle('textInput')}
          ref="Textarea"
          autoCorrect={false}
          multiline={true}
          numberOfLines={this.props.numberOfLines}
          maxLength={this.props.maxLength}
          onChangeText={this._onChange}
          defaultValue={this.props.defaultValue}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          lengthPrompt={this.props.lengthPrompt}
          underlineColorAndroid="transparent"
          textAlignVertical="top"
        />
        {this._renderFooter()}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//
// });
