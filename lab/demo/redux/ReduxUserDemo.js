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
  ScrollView,
} from 'react-native';

import LAB, {
  Page,
  Link,
  User,
} from 'lab4';

import ActionTypes from 'lab4/redux/ActionTypes';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import {
  connect,
} from 'react-redux';

//封装了Parse User的操作和 redux user store Action的dispatch
import UserActions from 'lab4/redux/actions/user';

/**
 * User模块包括两部分
 * user 数据本地存储 Parse
 * user redux lab4/redux/reducers/user.js
 *
 * 使用Parse User api 操作用户数据之后需要调用redux 发送相应的action
 * UserActions lab4/redux/actions/user 中封装了相关user redux 事件的发送方法
 * 也封装了几个常用的修改用户数据之后发送action的方法
 */
//redux 参考: http://cn.redux.js.org/index.html
class ReduxUserDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  testLogin() {
    UserActions.login({
      login_name: '15067145800',
      password: '123456',
    }).then((user) => {
      console.log('login success user:', user.attributes);
    }).catch((e) => {
      console.log('login error', e);
    });
  }

  testLogout() {
    UserActions.logout()
      .then(() => {
        console.log('logout success');
      }).catch((e) => {
        console.log('logout error', e);
      });
  }

  //修改用户资料
  // 先调用parse User 再调用 redux
  testUpdate() {
    if (!User.isLoggedIn()) {
      console.log('!isLoggedIn');
      return;
    }
    let user = User.current();
    user.set({
      name: 'xxx',
    });

    user.save()
      .then((user) => {
        console.log('save success');
        UserActions.dispatchUpdateUser(user);
        //或者
        // this.props.dispatch({
        //   type: ActionTypes.UPDATE_USER_DATA,
        //   payload: user.attributes
        // });
      })
      .catch((e) => {
        console.log('save error', e);
      });
  }

  //每次打开app都会调用，与服务器端用户数据同步
  testUpdateCurrentUser() {
    User.updateCurrentUser()
      .then((user) => {
        console.log('updateCurrentUser user', user.attributes);
        UserActions.dispatchUpdateUser(user);
      })
      .catch((e) => {
        console.log('updateCurrentUser error', e);
      });
  }

  //直接使用新的数据更新当前用户 attr必须是完整的当前登录的用户数据
  //NOTE 不安全 一般用于注册之后直接登录
  testUnsafeUpdateCurrentUser() {
    let attr = {
      objectId: 'xxx',
      name: 'xxx',
      email: 'xxx@xxx.xxx',
    };
    // 使用UserActions 封装的 包括了调用parse 和 redux
    UserActions.unsafeUpdateCurrentUser(attr)
      .then((user) => {
        console.log('unsafeUpdateCurrentUser ', user);
      })
      .catch((e) => {
        //保存本地数据失败，一般不会发生
        console.log('unsafeUpdateCurrentUser error', e);
      });
  }

  // 使用UserActions 封装的 包括了调用parse 和 redux
  // 不安全 不会与服务器同步
  testUnsafeLogOut() {
    UserActions.unsafeLogout();
  }

  //发送修改用户数据Action 只是修改redux的user store
  testDispatch() {
    this.props.dispatch({
      type: ActionTypes.UPDATE_USER_DATA,
      payload: {
        name: 'xxx',
        email: 'xxx@xxx.xxx',
      }
    });
  }

  testDispatch2() {
    this.props.dispatch({
      type: ActionTypes.UPDATE_USER_DATA,
      payload: {
        name: 'aaa',
        email: 'aaa@aaa.aaa',
      }
    });
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
        <Text>current user: {JSON.stringify(this.props.user)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    dispatch,
  };
}

const Container = connect(select, actions)(ReduxUserDemo);
Container.title = 'ReduxUserDemo';
export default Container;
