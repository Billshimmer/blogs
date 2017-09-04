'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

export default class PopupLayer extends Component {
  // TODO
  // static childContextTypes = {
  //   popupLayer: PropTypes.object,
  // };

  static propTypes = {
    renderCustomView: PropTypes.func.isRequired,
    onMaskPress: PropTypes.func,
    showMask: PropTypes.bool,
  };

  static defaultProps = { showMask: true };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let maskStyle = styles.container;
    if (!this.props.showMask) {
      maskStyle = [maskStyle, styles.hideMask];
    }
    return (
      <TouchableWithoutFeedback onPress={this.props.onMaskPress}>
        <View style={maskStyle}>
          {this.props.renderCustomView()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  hideMask: { backgroundColor: undefined },
});
