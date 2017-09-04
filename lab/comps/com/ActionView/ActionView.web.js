'use strict';
import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Animated,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';

import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

/**
 * 一个底部弹出的view 基于Modal
 * 
 * @export
 * @class ActionView
 * @extends {LAB.Component}
 */
export default class ActionView extends LAB.Component {
  static propTypes = {
    show: PropTypes.bool,
    initMargin: PropTypes.number,
    //初始底部距离
    style: PropTypes.object,
    bottomStyle: PropTypes.object,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  static defaultProps = { initMargin: -300 };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: this.props.show || false,
      animated: new Animated.Value(this.props.initMargin),
    };
    this.onCancel = this.onCancel.bind(this);
    this._popView;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.show) {
      this._popView = this.context.popup.addView({
        component: (
          <View style={[this.getStyle('container'), this.props.style]}>
            <Touchable
              activeOpacity={1}
              onPress={this.onCancel}
              style={this.getStyle('touchContainer')}
            />
            <Animated.View
              style={[
                this.getStyle('actionView'),
                this.props.bottomStyle,
                { marginBottom: this.state.animated },
              ]}
            >
              {this.props.children}
            </Animated.View>
          </View>
        ),
      });
      return Animated.timing(this.state.animated, {
        toValue: 0,
        duration: 300,
        delay: 100,
      }).start();
    } else {
      this.context.popup.hide(this._popView);
      this.setState({
        animated: new Animated.Value(this.props.initMargin),
      });
    }
  }

  render() {
    return null;
  }

  onCancel() {
    this.props.onCancel && this.props.onCancel();
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  touchContainer: { flex: 1, backgroundColor: 'transparent' },
  // actionView: {},
});
ActionView.defaultStyles = styles;
