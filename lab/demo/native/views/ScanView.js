'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  requireNativeComponent,
} from 'react-native';

export default class ScanView extends Component {

  static propTypes = {
    ...View.propTypes,
    options: PropTypes.object,
    onScanResult: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this._onScanResult = this._onScanResult.bind(this);
  }

  _onScanResult(e) {
    console.log('aaa');
    // this.props.onScanResult(e.nativeEvent);
  }

  render() {
    return (
      <LABScanView
        ref={(ref) => {
          ///console.log('LABTestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
        }}
        {...this.props}
        onScanResult={this._onScanResult}/>
    );
  }
}

//1.requireNativeComponent 时 第二个对象提供的propTypes必须与native viewManager提供的一致否则报错
const LABScanView = requireNativeComponent('LABScanView', ScanView, {
  nativeOnly: {
    onScanResult: true,
  }
});
