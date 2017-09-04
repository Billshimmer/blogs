'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
} from 'react-native';
import LAB, {
  Application,
} from 'lab4';

export default class App extends Application {

  constructor(props) {
    super(props);
  }

  getInitialRouteStack() {
    return [

    ];
  }
}
