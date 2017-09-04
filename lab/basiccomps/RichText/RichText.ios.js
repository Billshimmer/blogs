'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  requireNativeComponent,
} from 'react-native';

import LABWebView from 'lab4/basiccomps/WebView/WebView';

export default class RichText extends Component {

  static propTypes = {
    text: PropTypes.string,
  };

  // static defaultProps = {
  // };

  constructor(props, context) {
    super(props, context);
    // this.state = {
    // };
  }

  // componentDidMount() {
  // }
  //
  // componentWillReceiveProps(nextProps) {
  // }
  //
  // componentWillUnmount() {
  // }

  render() {
    //TODO text不包含HTML的情况
    let {text, ...otherProps} = this.props;
    return (
      <LABWebView
        {...otherProps}
        source={{
          html: this.props.text,
        }}
        fitContentHeight={true}/>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//
//   },
// });
