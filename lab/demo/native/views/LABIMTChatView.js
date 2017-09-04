'use strict'
import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, requireNativeComponent} from 'react-native';

export default class ChatView extends Component {
  static propTypes = {
    onAvatarClick: PropTypes.func,
    options: PropTypes.object.isRequired,
    ...View.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this._onAvatarClick = this._onAvatarClick.bind(this);
  }
  _onAvatarClick(event) {
    if (!this.props.onAvatarClick) {
      return;
    }
    this.props.onAvatarClick(event.nativeEvent.userName);
  }

  render() {
    return (
      <LABIMTChatView
        {...this.props}
        onAvatarClick={this._onAvatarClick}/>
    );
  }
}

const LABIMTChatView = requireNativeComponent('LABIMTChatView', ChatView, {
  nativeOnly: {
    onAvatarClick: true
  }
});
