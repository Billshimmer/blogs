'use strict';

import DI from 'lab4/core/DI';
import Parse from 'lab4/parse';
import ActionTypes from 'lab4/redux/ActionTypes';
const User = Parse.User;

/**
 * 登录 调用parse user 登录之后发送action LOGGED_IN
 * @param  attrs 用户数据 json
 * @return promise parse user
 */
function login(attrs) {
  let user = new User();
  return user.logIn(attrs)
    .then((user) => {
      dispatchLogin(user);
      return user;
    });
}

/**
 * 退出登录
 * 调用parser user 退出之后发送action LOGGED_OUT
 */
function logout() {
  return User.logOut()
    .finally(() => {
      //logout 不管成功还是失败
      DI.getStore().dispatch({
        type: ActionTypes.LOGGED_OUT,
      });
    });
}

/**
 * 调用parse user的 unsafeUpdateCurrentUser 之后发送action UPDATE_USER_DATA
 * @return parse user
 */
function unsafeUpdateCurrentUser(attrs) {
  let user = User.unsafeUpdateCurrentUser(attrs);
  dispatchUpdateUser(user);
  return user;
}

/**
 * 调用parse user的 unsafeLogOut 之后发送 LOGGED_OUT
 * @return {[type]} [description]
 */
function unsafeLogout() {
  User.unsafeLogOut();
  dispatchLogout();
}

/**
 * dispatch LOGGED_IN
 * @param user parse user 对象
 */
function dispatchLogin(user) {
  DI.getStore().dispatch({
    type: ActionTypes.LOGGED_IN,
    payload: user.attributes,
  });
}

/**
 * dispatch UPDATE_USER_DATA
 * @param user parse user 对象
 */
function dispatchUpdateUser(user) {
  DI.getStore().dispatch({
    type: ActionTypes.UPDATE_USER_DATA,
    payload: user.attributes,
  });
}

/**
 * dispatch LOGGED_OUT
 */
function dispatchLogout() {
  DI.getStore().dispatch({
    type: ActionTypes.LOGGED_OUT,
  });
}

export default {
  login,
  logout,
  unsafeUpdateCurrentUser,
  unsafeLogout,
  dispatchLogin,
  dispatchUpdateUser,
  dispatchLogout,
};
