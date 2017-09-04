'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  TextInput,
  Text,
} from 'react-native';
import LAB, { http, User, Toast, requireComp } from 'lab4';
import Qiniu from 'lab4/apis/Qiniu';
import { connect } from 'react-redux';
import userActions from 'lab4/redux/actions/user';

const ThreeRowMulListItem = requireComp('com.ThreeRowMulListItem');
const Image = requireComp('com.Image');

/**
 * 取 store 中 user 数据展示的个人资料列表项
 * 项目中基本基于此组件定制
 * 
 * @class CenterAvatar
 * @extends {LAB.Component}
 */
class CenterAvatar extends LAB.Component {
  static propTypes = {
    styleClass: PropTypes.string,
    defaultAvatar: PropTypes.string,
  };

  static defaultProps = {
    styleClass: 'center-default',
  };

  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let titleCenter = '未添加';
    let descCenterText = '未添加';
    let avatar = this.props.defaultAvatar;

    if (this.props.user) {
      if (this.props.user.name) {
        titleCenter = this.props.user.name;
      }

      if (this.props.user.mobile) {
        descCenterText = this.props.user.mobile;
      }

      if (this.props.user.avatar) {
        avatar = this.props.user.avatar;
      }
    }

    return (
      <ThreeRowMulListItem
        titleCenter={titleCenter}
        iconRight="keyboard-arrow-right"
        onPress={this.props.onPress}
        link={this.props.link}
        emit={this.props.emit}
        style_class={this.props.styleClass}
        descCenterText={descCenterText}
        image={<Image uri={avatar} />}
      />
    );
  }

  // _onPress(e) {
  //   this.handleLinkEmitAction();
  //   this.props.onPress && this.props.onPress(e);
  // }
}

export default connect(state => {
  return {
    user: state.user,
  };
})(CenterAvatar);
