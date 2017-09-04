'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import ToastContainer from './ToastContainer';
import Toast from './Toast';

export default class ToastLayer extends Component {
  // static propTypes = {
  // };
  //
  // static defaultProps = {
  // };

  constructor(props, context) {
    super(props, context);
    this.state = {
      message: null,
      options: null,
      toastId: 0,
      visible: false,
      toastVisible: false,
    };
    Toast._toastLayer = this;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  show(message, options) {
    const toastId = this.state.toastId + 1;
    Object.assign(this.state, {
      message,
      options,
      toastId,
      visible: true,
      toastVisible: true,
    });
    this.forceUpdate();
    return toastId;
  }

  hide(id) {
    if ((id !== undefined && id !== this.state.toastId) || !this.state.visible) {
      return;
    }
    Object.assign(this.state, {
      visible: false,
    });
    this.forceUpdate();
  }

  render() {
    if (!this.state.toastVisible) {
      return null;
    }
    let options = this.state.options;
    let onHidden = options ? options.onHidden : null;
    let toastId = this.state.toastId;
    return (
      <ToastContainer
        {...options}
        key={toastId}
        visible={this.state.visible}
        onHidden={() => {
          if (toastId === this.state.toastId) {
            Object.assign(this.state, {
              message: null,
              options: null,
              visible: false,
              toastVisible: false,
            });
            this.forceUpdate();
          }
          onHidden && onHidden();
        }}
      >
        {this.state.message}
      </ToastContainer>
    );
  }
}

// const styles = StyleSheet.create(
//   {
//     container: {
//     },
//   },
// );
