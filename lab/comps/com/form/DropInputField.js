'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  PixelRatio,
} from 'react-native';
import LAB, { requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';
import EventConstants from 'lab4/core/EventConstants';
import Storage from 'lab4/utils/SimpleLRUStore';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

export default class DropInputField extends BaseFormField {
  static contextTypes = {
    emitter: PropTypes.object,
  };

  static propTypes = {
    ...BaseFormField.propTypes,
    ikeyLength: PropTypes.number,
    ikey: PropTypes.string,
    saveikey: PropTypes.string,
    keyboardType: PropTypes.string,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    ikeyLength: 3,
    autoFocus: false,
    placeholder: '请输入你的手机号码',
    keyboardType: 'numeric',
    placeholderTextColor: '#BCBCBC',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      val: '18888888888',
      icon: 'keyboard-arrow-down',
      arr: [],
    };
  }
  componentDidMount() {
    super.componentDidMount();
    //本地存储事件
    this.context.emitter.on(
      EventConstants.DROP_SET_KEY,
      this._dropSetKey,
      this
    );

    let that = this;
    let len = this.props.ikeyLength;
    Storage.getAll('user').then(
      function(value) {
        that.setState({
          arr: value.slice(0, len),
        });
      },
      function(value) {}
    );
  }
  _dropSetKey(e, text) {
    if (this.props.saveikey) {
      Storage.save(saveikey, text);
    }
  }

  itemChoose(ind) {
    this.setState({
      val: this.state.arr[ind],
      show: false,
      icon: 'keyboard-arrow-down',
    });
  }

  itemshow() {
    var arr = [];
    for (let i = 0; i < this.state.arr.length; i++) {
      arr.push(
        <Touchable
          key={i}
          onPress={() => {
            this.itemChoose(i);
          }}
          style={this.getStyle('items')}
        >
          <Text style={this.getStyle('itemText')}>{this.state.arr[i]}</Text>
        </Touchable>
      );
    }
    if (this.state.show) {
      if (arr.length > 0) {
        return (
          <View style={this.getStyle('result')}>
            {arr}
          </View>
        );
      }
      return (
        <View style={this.getStyle('result')}>
          <Text>暂无数据</Text>
        </View>
      );
    }
    return null;
  }

  arrowShow() {
    if (this.props.ikey) {
      return (
        <View style={styles.right}>
          <Icon
            name={this.state.icon}
            style={this.getStyle('icons')}
            onPress={this.setItem.bind(this)}
          />
        </View>
      );
    }
    return null;
  }

  setItem() {
    if (this.state.show) {
      this.setState({
        show: false,
        icon: 'keyboard-arrow-down',
      });
    } else {
      this.setState({
        show: true,
        icon: 'keyboard-arrow-up',
      });
    }
  }

  _onChange(text) {
    this.onValueChange(text);
    this.setState({
      val: text,
      show: false,
      icon: 'keyboard-arrow-down',
    });
  }

  renderContent() {
    return (
      <View style={styles.main}>
        <TextInput
          style={this.getStyle('textInput')}
          ref="DropInput"
          onChangeText={this._onChange}
          defaultValue={this.state.val}
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          placeholderTextColor={this.props.placeholderTextColor}
          underlineColorAndroid="transparent"
        />
        {this.arrowShow()}
        {this.itemshow()}
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
