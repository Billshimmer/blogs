'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import LinkEmitAble from 'lab4/basiccomps/LinkEmitAble';

const useTouchableNativeFeedback =
  Platform.OS == 'android' && Platform.Version >= 21;
const useForeground = Platform.OS === 'android' && Platform.Version >= 23;

export default class Touchable extends Component {
  static propTypes = {
    disableLinkEmit: PropTypes.bool,
    useTouchableNativeFeedback: PropTypes.bool,
    activeOpacity: PropTypes.number,
    withoutFeedback: PropTypes.bool,
  };

  static defaultProps = {
    activeOpacity: 0.6,
  };

  constructor(props, context) {
    super(props, context);
    this._onPress = this._onPress.bind(this);
  }

  _onPress(e) {
    if (this.props.onPress && this.props.onPress(e) === false) {
      // onPress 返回false 可阻止handleLinkEmitAction
      // TODO 参考web 使用preventDefault
      return;
    }
    this.handleLinkEmitAction();
  }

  render() {
    if (this.props.withoutFeedback) {
      return (
        <TouchableWithoutFeedback
          {...this.props}
          onPress={
            this.props.disableLinkEmit ? this.props.onPress : this._onPress
          }
        >
          <View {...this.props}>
            {this.props.children}
          </View>
        </TouchableWithoutFeedback>
      );
    }

    if (
      useTouchableNativeFeedback &&
      this.props.useTouchableNativeFeedback !== false
    ) {
      return (
        <TouchableNativeFeedback
          useForeground={useForeground && this.props.useForeground !== false}
          {...this.props}
          onPress={
            this.props.disableLinkEmit ? this.props.onPress : this._onPress
          }
        >
          <View {...this.props}>
            {this.props.children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        {...this.props}
        onPress={
          this.props.disableLinkEmit ? this.props.onPress : this._onPress
        }
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

LinkEmitAble.enhance(Touchable);
