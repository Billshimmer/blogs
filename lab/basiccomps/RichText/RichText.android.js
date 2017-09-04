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

export default class RichText extends Component {

  static propTypes = {
    ...View.propTypes,
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
    return (
      <LABRichText
        {...this.props}/>
    );
  }
}

const LABRichText = requireNativeComponent('LABRichText', RichText);

// const styles = StyleSheet.create({
//   container: {
//
//   },
// });
