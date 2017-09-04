'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Dialog = requireComp('com.Dialog');

export default class SimpleDialog extends LAB.Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        styleClass: PropTypes.string,
      })
    ).isRequired,
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <Dialog {...this.props} />;
  }
}
