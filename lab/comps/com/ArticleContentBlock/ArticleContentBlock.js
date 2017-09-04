'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import LAB, { http, Toast, utils } from 'lab4';

export default class ArticleContentBlock extends LAB.Component {
  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  static propTypes = {
    title: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    from: PropTypes.string,
    line: PropTypes.object,
    content: PropTypes.any,
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        <Text style={this.getStyle('title')}>{this.props.title}</Text>
        <View style={this.getStyle('box')}>
          <Text style={this.getStyle('date')}>
            {utils.conversionTime(this.props.date, 1)}
          </Text>
          <Text style={this.getStyle('author')}>
            {this.props.author ? this.props.author : null}
          </Text>
          <Text style={this.getStyle('from')}>
            {this.props.from ? this.props.from : null}
          </Text>
        </View>
        {this.props.line ? LAB.render(this.props.line) : null}
        {this.props.content ? LAB.render(this.props.content) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
