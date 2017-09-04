'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

/**
 * 单选、多选按钮组
 * 
 * @export
 * @class SelectButtonGroup
 * @extends {LAB.Component}
 */
export default class SelectButtonGroup extends LAB.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    isRadio: PropTypes.bool,
    data: PropTypes.array,
    activeOpacity: PropTypes.number,
    defaultValue: PropTypes.number,
  };
  static defaultProps = {
    disabled: false,
    isRadio: true,
    data: [],
    activeOpacity: 0.8,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.defaultValue,
      values: this.props.defaultValues || [],
    };
    this.defaultStyles = styles;
    // this.onPress = this.onPress;
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        {this.props.children ? this.returnChildren() : this.returnBtn()}
      </View>
    );
  }

  getValue() {
    return this.props.isRadio ? this.state.value : this.state.values;
  }

  returnChildren() {
    let temp = [];
    if (this.props.isRadio) {
      this.props.children.map((item, i) => {
        temp.push(
          <Touchable
            disabled={this.props.disabled}
            activeOpacity={this.props.activeOpacity}
            key={i}
            onPress={() => {
              this.onPress(Number(i));
            }}
            style={[
              this.getStyle('item'),
              this.props.btnStyle && this.props.btnStyle[i],
              i == this.state.value && this.getStyle('activeItem'),
            ]}
          >
            {item}
          </Touchable>
        );
      });
    } else {
      this.props.children.map((item, i) => {
        temp.push(
          <Touchable
            disabled={this.props.disabled}
            activeOpacity={this.props.activeOpacity}
            key={i}
            onPress={() => {
              this.onPress(Number(i));
            }}
            style={[
              this.getStyle('item'),
              this.props.btnStyle && this.props.btnStyle[i],
              this.state.values[Number(i)] && this.getStyle('activeItem'),
            ]}
          >
            {item}
          </Touchable>
        );
      });
    }

    return temp;
  }

  returnBtn() {
    let temp = [];
    if (this.props.isRadio) {
      for (let i in this.props.data) {
        temp.push(
          <Touchable
            disabled={this.props.disabled}
            activeOpacity={this.props.activeOpacity}
            key={i}
            onPress={() => {
              this.onPress(Number(i));
            }}
            style={[
              this.getStyle('item'),
              this.props.btnStyle && this.props.btnStyle[i],
              i == this.state.value && this.getStyle('activeItem'),
            ]}
          >
            <Text
              style={[
                this.getStyle('text'),
                this.props.textStyle && this.props.textStyle[i],
                i == this.state.value && this.getStyle('activeText'),
              ]}
            >
              {this.props.data[i].text || this.props.data[i].value}
            </Text>
          </Touchable>
        );
      }
    } else {
      for (let i in this.props.data) {
        temp.push(
          <Touchable
            disabled={this.props.disabled}
            activeOpacity={this.props.activeOpacity}
            key={i}
            onPress={() => {
              this.onPress(Number(i));
            }}
            style={[
              this.getStyle('item'),
              this.props.btnStyle && this.props.btnStyle[i],
              this.state.values[Number(i)] && this.getStyle('activeItem'),
            ]}
          >
            <Text
              style={[
                this.getStyle('text'),
                this.props.textStyle && this.props.textStyle[i],
                this.state.values[Number(i)] && this.getStyle('activeText'),
              ]}
            >
              {this.props.data[i].text || this.props.data[i].value}
            </Text>
          </Touchable>
        );
      }
    }

    return temp;
  }

  onPress(i) {
    if (this.props.isRadio) {
      this.setState({ value: i });
      this.props.onChange && this.props.onChange(i);
    } else {
      let temp = this.state.values;
      if (temp[i]) {
        delete temp[i];
      } else {
        temp[i] = true;
      }
      this.setState({ values: temp });
      this.props.onChange && this.props.onChange(temp);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  activeItem: {},
  text: {
    textAlign: 'center',
  },
  activeText: {},
});
