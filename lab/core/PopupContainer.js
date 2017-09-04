'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, StyleSheet } from 'react-native';
import ReactElement from 'react/lib/ReactElement';

let _lid = 0;
export default class PopupContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      viewStack: [],
    };
    props.popup._stack = this;
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  push(element) {
    if (this._isUnmounted) {
      return;
    }
    if (!element) {
      return;
    }
    const lid = ++_lid;
    this.state.viewStack.push(ReactElement.cloneAndReplaceKey(element, lid));
    this.forceUpdate();
    return lid;
  }

  pop(id, cb) {
    if (this._isUnmounted) {
      return;
    }
    const viewStack = this.state.viewStack;
    const len = viewStack.length;
    if (!len) {
      return;
    }

    if (typeof id !== 'number') {
      viewStack.splice(len - 1, 1);
    } else {
      for (let i = 0; i < len; i++) {
        if (viewStack[i].key === id) {
          viewStack.splice(i, 1);
          break;
        }
      }
    }
    this.forceUpdate(cb);
  }

  render() {
    if (!this.state.viewStack.length) {
      return null;
    }
    return (
      <View
        // removeClippedSubviews={false}
        style={[StyleSheet.absoluteFill, this.props.style]}
      >
        {this.state.viewStack}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // zIndex: 999,
//   },
// });
