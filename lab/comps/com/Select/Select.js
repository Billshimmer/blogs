'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Platform,
  Picker,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');
const Button = requireComp('com.Button');
const ActionView = requireComp('com.ActionView');
const flattenStyle = StyleSheet.flatten;

/**
 * 基于RNPicker的选择组件
 * 
 * @export
 * @class Select
 * @extends {LAB.Component}
 */
export default class Select extends LAB.Component {
  static Item = Picker.Item;

  static propTypes = {
    disabled: PropTypes.bool,
    data: PropTypes.array,
    confirmBtnStyle: PropTypes.string, //IOS 确认按钮样式
    confirmText: PropTypes.string,
    dataChangeBack: PropTypes.bool, //数据源改变时是否调用onChange true
  };
  static defaultProps = {
    dataChangeBack: true,
    disabled: false,
    confirmText: '确认',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      value: (this.props.defaultText || this.props.label) &&
        this.props.defaultValue == null
        ? -1
        : this.props.defaultValue || 0,
      temp: 0, //ios 未点确定时的临时状态
      // default: Platform.OS == 'android' ? false : true, //修复android 首次渲染触发onChange
    };
    this.defaultStyles = styles;
    this.onValueChange = this.onValueChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data != nextProps.data) {
      let temp = this.props.defaultText || this.props.title ? -1 : 0;
      this.setState({ value: temp, temp: 0 });
      this.props.dataChangeBack &&
        this.props.onChange &&
        this.props.onChange(temp);
    }
  }

  render() {
    if (Platform.OS == 'ios') {
      let temp = this.props.defaultText
        ? [
            <Picker.Item
              key={''}
              label={this.props.label || this.props.defaultText}
              value={-1}
            />,
          ]
        : [];
      if (this.props.data) {
        this.props.data &&
          this.props.data.map((item, i) => {
            temp.push(
              <Picker.Item key={i} label={item.value || ''} value={i} />
            );
          });
      } else {
        this.props.children &&
          this.props.children.map((item, i) => {
            temp.push(item);
          });
      }
      return (
        <Touchable
          disabled={this.props.disabled}
          onPress={() => {
            this.setState({ show: true });
          }}
          style={[this.getStyle('container'), this.props.style]}
        >
          <View style={this.getStyle('textView')}>
            <Text
              numberOfLines={1}
              style={[
                this.getStyle(
                  (this.state.value >= 0 || !this.props.defaultText) &&
                    this.props.text
                    ? 'text'
                    : 'defaultText'
                ),
                this.props.textStyle,
              ]}
            >
              {(this.state.value >= 0 || !this.props.defaultText) &&
                this.props.text
                ? this.props.text
                : this.props.defaultText}
            </Text>
            {this.props.icon
              ? <Icon name={this.props.icon} style={this.getStyle('icon')} />
              : null}
          </View>
          <ActionView
            show={this.state.show}
            style={flattenStyle(this.getStyle('actionView'))}
            bottomStyle={flattenStyle(this.getStyle('bottomView'))}
            onCancel={() => {
              this.setState({ show: false });
            }}
          >
            {this.props.title
              ? <View style={this.getStyle('titleView')}>
                  <Touchable
                    onPress={() => {
                      this.setState({ show: false });
                    }}
                    style={this.getStyle('titleLeft')}
                  >
                    <Text style={this.getStyle('titleLeftText')}>
                      {this.props.title.left}
                    </Text>
                  </Touchable>
                  <Text style={this.getStyle('titleText')}>
                    {this.props.title.title}
                  </Text>
                  <Touchable
                    onPress={this.confirm}
                    style={this.getStyle('titleRight')}
                  >
                    <Text style={this.getStyle('titleRightText')}>
                      {this.props.title.right}
                    </Text>
                  </Touchable>
                </View>
              : null}
            <Picker
              style={this.getStyle('picker')}
              selectedValue={this.state.temp}
              onValueChange={this.onValueChange}
            >
              {temp}
            </Picker>
            {!this.props.title
              ? <Touchable
                  style={this.getStyle('confirmButton')}
                  onPress={this.confirm}
                >
                  <Text style={this.getStyle('confirmText')}>
                    {this.props.confirmText}
                  </Text>
                </Touchable>
              : null}
          </ActionView>
        </Touchable>
      );
    } else if (Platform.OS == 'android') {
      let temp = this.props.defaultText || this.props.label
        ? [
            <Picker.Item
              key={''}
              label={this.props.label || this.props.defaultText}
              value={-1}
            />,
          ]
        : [];
      if (this.props.data) {
        this.props.data &&
          this.props.data.map((item, i) => {
            temp.push(
              <Picker.Item key={i} label={item.value || ''} value={i} />
            );
          });
      } else {
        this.props.children &&
          this.props.children.map((item, i) => {
            temp.push(item);
          });
      }
      return (
        <View style={[this.getStyle('container'), this.props.style]}>
          <View style={this.getStyle('textView')}>
            <Text
              numberOfLines={1}
              style={[
                this.getStyle(
                  (this.state.value >= 0 || !this.props.defaultText) &&
                    this.props.text
                    ? 'text'
                    : 'defaultText'
                ),
                this.props.textStyle,
              ]}
            >
              {(this.state.value >= 0 || !this.props.defaultText) &&
                this.props.text
                ? this.props.text
                : this.props.defaultText}
            </Text>
            {this.props.icon
              ? <Icon name={this.props.icon} style={this.getStyle('icon')} />
              : null}
          </View>
          <Picker
            enabled={!this.props.disabled}
            style={this.getStyle('absolutePicker')}
            selectedValue={this.state.value}
            onValueChange={this.onValueChange}
          >
            {temp}
          </Picker>

        </View>
      );
    } else {
      // web
      let temp = this.props.defaultText
        ? [
            <Picker.Item
              key={''}
              label={this.props.label || this.props.defaultText}
              value={-1}
            />,
          ]
        : [];
      if (this.props.data) {
        this.props.data &&
          this.props.data.map((item, i) => {
            temp.push(
              <Picker.Item key={i} label={item.value || ''} value={i} />
            );
          });
      } else {
        this.props.children.map((item, i) => {
          temp.push(item);
        });
      }
      return (
        <View style={[this.getStyle('container'), this.props.style]}>
          <View style={[this.getStyle('textView', 'absolute')]}>
            <Text
              numberOfLines={1}
              style={[
                this.getStyle(
                  (this.state.value >= 0 || !this.props.defaultText) &&
                    this.props.text
                    ? 'text'
                    : 'defaultText'
                ),
                this.props.textStyle,
              ]}
            >
              {(this.state.value >= 0 || !this.props.defaultText) &&
                this.props.text
                ? this.props.text
                : this.props.defaultText}
            </Text>
            {this.props.icon
              ? <Icon name={this.props.icon} style={this.getStyle('icon')} />
              : null}
          </View>
          <Picker
            disabled={this.props.disabled}
            enabled={!this.props.disabled}
            style={{ flex: 1, opacity: 0 }}
            selectedValue={this.state.value}
            onValueChange={this.onValueChange}
          >
            {temp}
          </Picker>
        </View>
      );
    }
  }

  onValueChange(value, key) {
    if (Platform.OS == 'ios') {
      this.setState({ temp: value });
    } else {
      this.setState({ value: value });
      this.props.onChange && this.props.onChange(value);
    }
  }

  confirm() {
    this.setState({ value: this.state.temp, show: false });
    this.props.onChange && this.props.onChange(this.state.temp);
  }

  getValue() {
    return this.state.value;
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 44,
    backgroundColor: 'blue',
  },
  textView: {
    flex: 1,
    // position:'absolute',
    // top:0,
    // left:0,
    // right:0,
    // bottom:0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  absolutePicker: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#A6A6A6',
  },
  defaultText: {
    fontSize: 18,
    color: '#A6A6A6',
    textAlign: 'center',
  },
  confirmButton: {
    borderRadius: 6,
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 16,
    color: 'red',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
  },
  actionView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingBottom: 10,
  },
  bottomView: {
    height: null,
    backgroundColor: 'transparent',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 44,
  },
  titleLeft: {
    position: 'absolute',
    left: 0,
    padding: 12,
  },
  titleRight: {
    position: 'absolute',
    right: 0,
    padding: 12,
  },
});
