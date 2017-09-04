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

export default class PhotoBrowser extends Component {

  static propTypes = {
    ...View.propTypes,
    options: PropTypes.object,
    onPhotoTap: PropTypes.func,
    onPhotoSelected: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this._onPhotoTap = this._onPhotoTap.bind(this);
  }

  _onPhotoTap(e) {
    console.log('aaa');
    // this.props.onScanResult(e.nativeEvent);
  }

  render() {
    return (
      <LABPhotoBrowser
        ref={(ref) => {
          ///console.log('LABTestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
        }}
        {...this.props}
        ononPhotoTap={this._onPhotoTap}
        />
    );
  }
}

//1.requireNativeComponent 时 第二个对象提供的propTypes必须与native viewManager提供的一致否则报错
const LABPhotoBrowser = requireNativeComponent('LABPhotoBrowser', PhotoBrowser, {
  nativeOnly: {
    onPhotoTap: true,
  }
});
