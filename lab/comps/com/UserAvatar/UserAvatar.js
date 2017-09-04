'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  TextInput,
  Text,
} from 'react-native';
import LAB, { http, Parse, Toast, User, requireComp } from 'lab4';
import ImagePicker from 'lab4/apis/ImagePicker';
import Qiniu from 'lab4/apis/Qiniu';
import { connect } from 'react-redux';
import userActions from 'lab4/redux/actions/user';

const ThreeRowSimListItem = requireComp('com.ThreeRowSimListItem');

/**
 * 基于 store、ThreeRowSimListItem，展示用户信息组件
 * 
 * @class UserAvatar
 * @extends {LAB.Component}
 */
class UserAvatar extends LAB.Component {
  static propTypes = {
    titleCenter: PropTypes.string,
    styleClass: PropTypes.string,
    iconRight: PropTypes.string,
    borderRadius: PropTypes.number,
  };

  static defaultProps = {
    titleCenter: '头像',
    styleClass: 'UserAvatar',
    iconRight: 'keyboard-arrow-right',
    borderRadius: 33,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      uri: props.avatar || 'default_avatar',
    };
  }

  componentDidMount() {
    if (this.props.user && this.props.user.avatar) {
      this.setState({
        uri: this.props.user.avatar,
      });
    }
  }

  render() {
    return (
      <ThreeRowSimListItem
        titleCenter="头像"
        iconRight="keyboard-arrow-right"
        style_class={this.props.styleClass}
        rightComps={{
          ui_type: 'com.Image',
          uri: this.state.uri,
          style: [
            styles.avatar,
            {
              borderRadius: this.props.borderRadius,
            },
          ],
        }}
        onPress={this._onPress.bind(this)}
      />
    );
  }

  _onPress() {
    let options = {
      title: '选择图片', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '相册', // specify null or empty string to remove this button
      customButtons: {
        自定义: 'fb', // [Button Text] : [String returned upon selection]
      },
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 300, // photos only
      maxHeight: 300, // photos only
      aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      //quality: 0.8, // 0 to 1, photos only  指定quality时图片会被重新缩放，这时maxWidth与maxHeight的处理有BUG
      angle: 0, // android only, photos only
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection
      noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: {
        // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images', // ios only - will save image at /Documents/images rather than the root
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        if (__DEV__) console.log('User cancelled image picker');
      } else if (response.error) {
        if (__DEV__) console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        if (__DEV__) console.log('User tapped custom button: ', response.customButton);
      } else {
        this.context.popup.showLoading({
          message: '图片上传中',
        });

        Qiniu.upload({
          file: {
            uri: response.uri,
          },
        })
          .then(res => {
            let user = User.current();

            user.set({ avatar: res });
            user
              .save()
              .then(user => {
                this.context.popup.hideLoading();
                console.log('save success');
                userActions.dispatchUpdateUser(user);
                Toast.show('上传成功');
                this.setState({
                  uri: res,
                });
              })
              .catch(e => {
                console.log('save error', e);
                Toast.show('上传失败');
              });
            this.props.onChange && this.props.onChange(this.state.uri);
          })
          .catch(err => {
            if (__DEV__) console.log(err);
          });
      }
    });
  }
}

const styles = StyleSheet.create({
  // container: {},
  avatar: {
    width: 66,
    height: 66,
  },
});

export default connect(state => {
  return {
    user: state.user,
  };
})(UserAvatar);
