'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import BaseTestComponent from 'lab4/demo/BaseTestComponent';

export default class Test2 extends BaseTestComponent {

  constructor(props, context) {
    super(props, context);
    this._renderContent = this._renderContent.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    //this.props.test1.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    nextProps.cwrpcbk && nextProps.cwrpcbk();
  }

  _renderContent() {
    if(!this.props.renderContent) {
      return null;
    }
    return this.props.renderContent();
  }

  render() {
    this.log('render');
    return (
      <View style={styles.container}>
        <Text>Test2</Text>
        {this._renderContent()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A73D7',
  },
});
