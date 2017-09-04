'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
} from 'react-native';
import PageContainer from './PageContainer';
import Popup from './Popup';
import PopupContainer from './PopupContainer';
import { shallowEqualProps } from '../utils';
import CommonStyle from './CommonStyle';

export default class Window extends Component {
  static childContextTypes = { popup: PropTypes.object };

  constructor(props, context) {
    super(props, context);
    this.popup = new Popup();
    this._childContext = { popup: this.popup };
  }

  getChildContext() {
    return this._childContext;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !shallowEqualProps(this.props, nextProps);
    // if (__DEV__) {
    //   console.log('Window shouldComponentUpdate result:', result, ' route:', this.props.route);
    // }
    return result;
  }

  render() {
    return (
      <View style={CommonStyle.flex1}>
        <PageContainer {...this.props} window={this} />
        <PopupContainer popup={this.popup} />
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
