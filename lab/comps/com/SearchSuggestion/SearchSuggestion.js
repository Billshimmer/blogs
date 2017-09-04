'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { http, requireComp } from 'lab4';
import EventConstants from 'lab4/core/EventConstants';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

export default class ComComp extends LAB.Component {
  static propTypes = {
    maxLength: PropTypes.number,
    url: PropTypes.string,
  };

  static defaultProps = {
    maxLength: 4,
  };

  static contextTypes = {
    emitter: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      val: '',
      show: false,
      arr: [],
    };
  }

  componentDidMount() {
    this.context.emitter.on(
      EventConstants.SEARCH_TEXT_CHANGE,
      this._searchSetText,
      this
    );
  }

  _searchSetText(e, text) {
    if (text.length > 0) {
      if (this.props.url) {
        http
          .fetch(this.props.url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: text,
            }),
          })
          .then(
            function(value) {
              // console.log(value);
              //TODO
            },
            function(error) {
              if (__DEV__) console.log(error);
            }
          );
      }
      this.setState({
        show: true,
      });
    } else {
      this.setState({
        show: false,
      });
    }
  }

  setKey(ind) {
    this.context.emitter.emit(
      EventConstants.SEARCH_SET_TEXT,
      this,
      this.state.arr[ind]
    );
    this.setState({
      show: false,
    });
  }

  eachItems() {
    let len = this.props.maxLength > this.state.arr.length
      ? this.state.arr.length
      : this.props.maxLength;
    let rarr = [];
    for (let i = 0; i < len; i++) {
      rarr.push(
        <Touchable
          style={this.getStyle('items')}
          key={i}
          onPress={() => {
            this.setKey(i);
          }}
        >
          <View style={this.getStyle('lists')}>
            <Icon name="search" style={this.getStyle('icons')} />
            <Text style={this.getStyle('itemsText')}>{this.state.arr[i]}</Text>
          </View>
        </Touchable>
      );
    }
    return (
      <View>
        {rarr}
      </View>
    );
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={this.getStyle('container')}
          onPress={this.eachItems.bind(this)}
        >
          {this.eachItems()}
        </View>
      );
    } else {
      return null;
    }
  }
}

// const styles = StyleSheet.create({
// });
