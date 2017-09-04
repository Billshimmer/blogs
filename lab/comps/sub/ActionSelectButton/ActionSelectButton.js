'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Modal,
  Platform,
  Picker,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const ActionSelect = requireComp('com.ActionSelect');

export default class ActionSelectButton extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    defaultText: PropTypes.string,
    data: PropTypes.array,
    indexData: PropTypes.array,
    type: PropTypes.oneOf(['index', 'noIndex']),
  };
  static defaultProps = {
    disabled: false,
    type: 'noIndex',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      value: {
        value:
          this.props.defaultText ||
            (this.props.type == 'noIndex'
              ? this.props.data[0]
              : this.props.indexData[0].value),
        key: this.props.defaultText
          ? 0
          : this.props.type == 'noIndex'
            ? this.props.data[0]
            : this.props.indexData[0].value,
      },
      defaultText: this.props.defaultText,
      default: this.props.defaultText ? 0 : 2,
    };
    this.defaultStyles = styles;
    this.onSelect = this.onSelect.bind(this);
    this.onSelectIOS = this.onSelectIOS.bind(this);
    this.onSelectWeb = this.onSelectWeb.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this._textColor = undefined;
  }
  onCancel() {
    this.setState({ show: false });
  }

  onOpen() {
    this.setState({ show: true });
  }
  onSelectIOS(value) {
    this.setState({ value: value, default: 2 });
    if (this.props.type == 'noIndex') {
      this.props.onSelect && this.props.onSelect(value.value);
    } else {
      this.props.onSelect && this.props.onSelect(value);
    }
  }
  onSelect(value, key) {
    //安卓情况下修复初始值始终为数组第一个，不能自定义
    if (this.props.type == 'noIndex') {
      //this.state.default <2 ? this.setState({default:++this.state.default}) : null;
      this.setState({
        value: {
          value: value,
          key: key,
        },
      });
      this.props.onSelect && this.props.onSelect(value);
    } else {
      //this.state.default < 2 ? this.setState({default:++this.state.default}) : null;
      this.setState({
        value: {
          value: value,
          key: key,
        },
      });
      this.props.onSelect && this.props.onSelect(this.props.indexData[key]);
    }
  }
  onSelectWeb(value, key) {
    this.setState({ value: value, default: 2 });
    this.setState({
      value: {
        value: value,
        key: key,
      },
    });
    if (this.props.type == 'noIndex') {
      this.props.onSelect && this.props.onSelect(value);
    } else {
      this.props.onSelect && this.props.onSelect(this.props.indexData[key]);
    }
  }
  getValue() {
    return this.props.type == 'noIndex'
      ? this.state.value.value
      : this.state.value;
  }

  setValue(newValue) {
    this.setState({ value: newValue });
  }

  // componentWillReceiveProps(){
  //   if(this.state.defaultText !== this.props.defaultText)
  //     this.setState({value:this.props.defaultText});
  //
  // }

  render() {
    // console.log(this.state.value);
    this._textColor = this.state.default < 2
      ? undefined
      : this.getStyle('activeColor');
    if (this.props.type == 'index') {
      //索引模式
      if (Platform.OS == 'ios') {
        return (
          <View style={{ flex: 1 }}>
            <Touchable
              style={[this.getStyle('button'), this.props.style]}
              onPress={this.onOpen.bind(this)}
            >
              <Text
                style={[this.getStyle('text'), this._textColor]}
                numberOfLines={1}
              >
                {this.state.value.value}
              </Text>
            </Touchable>

            <ActionSelect
              visible={this.state.show}
              onCancel={this.onCancel}
              onSelect={this.onSelectIOS}
              type={this.props.type}
              indexData={this.props.indexData}
            />
            {this.props.disabled
              ? <View style={this.getStyle('disabled')} />
              : null}
          </View>
        );
      } else if (Platform.OS == 'android') {
        return (
          <View style={[this.getStyle('button'), this.props.style]}>
            <View style={this.getStyle('buttonContainer')}>
              <Text
                style={[this.getStyle('text'), this.getStyle('activeColor')]}
              >
                {this.state.value.value}
              </Text>
            </View>
            <Picker
              style={[this.getStyle('button'), { opacity: 0 }]}
              selectedValue={this.state.value.value}
              onValueChange={this.onSelect}
            >
              {this.props.indexData.map((item, i) => {
                return (
                  <Picker.Item key={i} label={item.value} value={item.key} />
                );
              })}
            </Picker>
            {this.props.disabled
              ? <View style={this.getStyle('disabled')} />
              : null}

          </View>
        );
      } else {
        return (
          <View style={[this.getStyle('button'), this.props.style]}>
            <View style={this.getStyle('buttonContainer')}>
              <Text
                style={[this.getStyle('text'), this.getStyle('activeColor')]}
              >
                {this.state.value.value}
              </Text>
            </View>
            <Picker
              style={[this.getStyle('button'), { opacity: 0 }]}
              selectedValue={this.state.value.value}
              onValueChange={this.onSelectWeb}
            >
              {this.props.indexData.map((item, i) => {
                return (
                  <Picker.Item key={i} label={item.value} value={item.key} />
                );
              })}
            </Picker>
            {this.props.disabled
              ? <View style={this.getStyle('disabled')} />
              : null}

          </View>
        );
      }
    } else {
      //非索引——————————————————————————————————————————————————————————————
      if (Platform.OS == 'ios') {
        return (
          <View style={{ flex: 1 }}>
            <Touchable
              style={[this.getStyle('button'), this.props.style]}
              onPress={this.onOpen.bind(this)}
            >
              <Text
                style={[this.getStyle('text'), this._textColor]}
                numberOfLines={1}
              >
                {this.state.value.value}
              </Text>
            </Touchable>

            <ActionSelect
              visible={this.state.show}
              onCancel={this.onCancel}
              onSelect={this.onSelectIOS}
              data={this.props.data}
            />
            {this.props.disabled
              ? <View style={this.getStyle('disabled')} />
              : null}
          </View>
        );
      } else if (Platform.OS == 'android') {
        return (
          <View style={[this.getStyle('button'), this.props.style]}>
            <View style={this.getStyle('buttonContainer')}>
              <Text
                style={[this.getStyle('text'), this.getStyle('activeColor')]}
              >
                {this.state.value.value}
              </Text>
            </View>
            <Picker
              style={[this.getStyle('button'), { opacity: 0 }]}
              selectedValue={this.state.value.value}
              onValueChange={this.onSelect}
            >
              {this.props.data.map((item, i) => {
                return <Picker.Item key={i} label={item} value={item} />;
              })}
            </Picker>
            {this.props.disabled
              ? <View style={this.getStyle('disabled')} />
              : null}

          </View>
        );
      } else {
        return (
          <View style={[this.getStyle('button'), this.props.style]}>
            <View style={this.getStyle('buttonContainer')}>
              <Text
                style={[this.getStyle('text'), this.getStyle('activeColor')]}
              >
                {this.state.value.value}
              </Text>
            </View>
            <Picker
              style={[this.getStyle('button'), { opacity: 0 }]}
              selectedValue={this.state.value.value}
              onValueChange={this.onSelectWeb}
            >
              {this.props.data.map((item, i) => {
                return <Picker.Item key={i} label={item} value={item} />;
              })}
            </Picker>
            {this.props.disabled
              ? <View style={this.getStyle('disabled')} />
              : null}

          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginLeft: 3,
    // alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  disabled: {
    //backgroundColor:'rgba(0,0,0,0.5)',
    opacity: 0.5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    backgroundColor: 'white',
    textAlign: 'left',
  },
});
