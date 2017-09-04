'use strict';

import Parse from 'lab4/parse';
import ActionTypes from './ActionTypes';
import updateCurrentUser from './updateCurrentUser';

const User = Parse.User;

export default function (store, config) {
  if (config && config.user === false) {
    return null;
  }
  //初始化用户
  let currentAsyncPromise = User.currentAsync()
    .then((user) => {
      if (user) {
        store.dispatch({
          type: ActionTypes.INIT_CURRENT_USER,
          payload: user.attributes,
        });
      }
      return user;
    }, (error) => {
      if (__DEV__) {
        console.warn('currentAsync error:' + (error && error.message) + '\n', error);
      }
    });
  currentAsyncPromise
    .finally((user) => {
      if (user != null) {
        // cookie已登录的情况下 刷新用户数据
        updateCurrentUser(store);
      }
      return null;
    });
  return currentAsyncPromise;
};
