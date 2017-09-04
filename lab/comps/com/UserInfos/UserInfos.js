'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Button = requireComp('com.Button');

export default class UserInfos extends LAB.Component {
  static propTypes = {
    itemContent: PropTypes.object,
    submitUrl: PropTypes.string,
    btnClassName: PropTypes.string,
  };

  static defaultProps = {
    btnClassName: 'default',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: true,
    };
  }

  //判断button的disabled属性
  _setButton(obj) {
    //判断是否为空
    if (typeof obj === 'object' && !(obj instanceof Array)) {
      var hasProp = false;
      for (var prop in obj) {
        hasProp = true;
        break;
      }
      if (hasProp) {
      } else {
        return false;
      }
    }
    //判断所有字段
    let flag = true;
    for (let p in obj) {
      if (obj[p] == undefined || obj[p] == '') {
        flag = false;
      }
    }
    return flag;
  }

  _handlePress() {
    //按钮提交的验证
    let res = this.refs.UserInfos.validate();
    if (res.isValid) {
      //TODO 后台请求
      if (this.props.submitUrl) {
        alert(JSON.stringify(this.refs.UserInfos.getValue()));
      } else {
        alert('缺少url');
      }
    } else {
      for (let p in res.error) {
        if (!res.error[p].isValid) {
          alert(res.error[p].message);
          return false;
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        {LAB.render(this.props.itemContent, {
          ref: 'UserInfos',
          onValueChange: value => {
            this.setState({
              disabled: !this._setButton(value),
            });
          },
        })}

        <Button
          style={styles.btn}
          disabled={this.state.disabled}
          style_class={this.props.btnClassName}
          onPress={this._handlePress.bind(this)}
        >
          确认修改
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  btn: {
    marginTop: 40,
  },
});
