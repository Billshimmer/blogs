'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, TextInput } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

export default class Counter extends LAB.Component {
  static propTypes = {
    // id
    id: PropTypes.any,
    editAble: PropTypes.bool, //是否可手动输入
    maxCount: PropTypes.number,
    minCount: PropTypes.number,
    changeCount: PropTypes.number,
    defaultCount: PropTypes.number,
    count: PropTypes.number,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    editAble: true,
    defaultCount: 0,
    maxCount: 32767,
    minCount: 0,
    changeCount: 1,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      count: props.count || props.defaultCount,
    };
    this.defaultStyles = styles;
    this.onRemove = this.onRemove.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  getCount() {
    return this.state.count;
  }

  onChange(count) {
    this.props.onChange && this.props.onChange(this.props.id, count);
  }

  onRemove() {
    if (this.state.count > this.props.minCount) {
      let temp = this.state.count - this.props.changeCount;
      if (temp < this.props.minCount) {
        this.setState({ count: this.props.minCount });
        this.onChange(this.props.minCount);
      } else {
        this.setState({ count: temp });
        this.onChange(temp);
      }
    }
  }

  onAdd() {
    if (this.state.count < this.props.maxCount) {
      let temp = this.state.count + this.props.changeCount;
      if (temp > this.props.maxCount) {
        this.setState({ count: this.props.maxCount });
        this.onChange(this.props.maxCount);
      } else {
        this.setState({ count: temp });
        this.onChange(temp);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.count && nextProps.count !== this.state.count) {
      this.setState({
        count: nextProps.count,
      });
    }
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        <Touchable onPress={this.onRemove} style={this.getStyle('remove')}>
          <Icon name="remove" style={this.getStyle('icon')} />
        </Touchable>
        <View style={this.getStyle('textContainer')}>
          {this.props.editAble
            ? <TextInput
                underlineColorAndroid="transparent"
                value={this.state.count.toString()}
                onChangeText={x => {
                  if (!/\D/.test(x)) {
                    let temp = Number(x);
                    if (temp > this.props.maxCount) temp = this.props.maxCount;
                    if (temp < this.props.minCount) temp = this.props.minCount;
                    this.setState({ count: temp });
                    this.onChange(temp);
                  }
                }}
                style={this.getStyle('textInput', 'text')}
              />
            : <Text style={this.getStyle('text')}>{this.state.count}</Text>}
        </View>
        <Touchable onPress={this.onAdd} style={this.getStyle('add')}>
          <Icon name="add" style={this.getStyle('icon')} />
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  remove: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    textAlign: 'center',
    padding: 0,
  },
  text: {
    textAlign: 'center',
  },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
