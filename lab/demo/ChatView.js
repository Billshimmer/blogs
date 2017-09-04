// ImageView.js

import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';
import React, { Component } from 'react';

// var iface = {
//   name: 'ChatView',
//   propTypes: {
//     options:PropTypes.object,
//     ...View.propTypes // 包含默认的View的属性
//   },
// };
//
//
// var ChatView= requireNativeComponent('ChatView', iface);
// module.exports =ChatView;

class ChatView extends Component {
  constructor() {
    super();
    this._onAvatarClick = this._onAvatarClick.bind(this);
  }
  _onAvatarClick(event: Event) {
    if (!this.props.onAvatarClick) {
      return;
    }
    this.props.onAvatarClick(event.nativeEvent.userName);
  }
  render() {
    return <CView {...this.props} onAvatarClick={this._onAvatarClick} />;
  }
}
ChatView.propTypes = {
  onAvatarClick: PropTypes.func,
  options: PropTypes.object,
  ...View.propTypes, // 包含默认的View的属性
};

var CView = requireNativeComponent('ChatView', ChatView, {
  nativeOnly: { onAvatarClick: true },
});

export default ChatView;
