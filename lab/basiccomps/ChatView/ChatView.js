'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  requireNativeComponent,
} from 'react-native';

export default class ChatView extends Component {
  static propTypes = {
    onAvatarClick: PropTypes.func,
    options: PropTypes.object.isRequired,
    ...View.propTypes,
  };

  // static defaultProps = {
  // };
  constructor(props, context) {
    super(props, context);
    this._onAvatarClick = this._onAvatarClick.bind(this);
    // this.state = {
    // };
  }
  _onAvatarClick(event: Event) {
    if (!this.props.onAvatarClick) {
      return;
    }
    this.props.onAvatarClick(event.nativeEvent.userName);
  }

  render() {
    return (
      <LABIMChatView {...this.props} onAvatarClick={this._onAvatarClick} />
    );
  }
}
const LABIMChatView = requireNativeComponent('LABIMChatView', ChatView, {
  nativeOnly: { onAvatarClick: true },
});

// const LABChatView = requireNativeComponent('LABChatView', ChatView);

// const styles = StyleSheet.create({
//   container: {
//
//   },
// });
