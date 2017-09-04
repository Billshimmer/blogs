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

export default class TestView extends Component {

  static propTypes = {
    ...View.propTypes,
    backgroundColor: PropTypes.string,
    rotationY: PropTypes.number,
    labViewId: PropTypes.string,
    obj1: PropTypes.object,
    shadowNodeProp1: PropTypes.string,
    prop1: PropTypes.string,
    onResponse: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this._onResponse = this._onResponse.bind(this);
  }

  _onResponse(e) {
    console.log('xxx');
    // this.props.onResponse(e.nativeEvent);
  }

  componentDidMount() {
    //console.log('TestView componentDidMount findNodeHandle=', ReactNative.findNodeHandle(this));
  }

  render() {
    return (
      <LABTestView
        ref={(ref) => {
          ///console.log('LABTestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
        }}
        {...this.props}
        onResponseNative={this._onResponse}/>
    );
  }
}

//1.requireNativeComponent 时 第二个对象提供的propTypes必须与native viewManager提供的一致否则报错
const LABTestView = requireNativeComponent('LABTestView', TestView, {
  nativeOnly: {
    onResponseNative: true,
  }
});
