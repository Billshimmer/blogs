'use strict';

import React, { PropTypes } from 'react';
import { StyleSheet } from 'react-native';
import { StatusView } from 'lab4';

export default class PageStatusView extends StatusView {

  constructor(props, context) {
    super(props, context);
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  errorText: { fontSize: 16, color: '#ee0000' },
});
PageStatusView.defaultStyles = styles;
