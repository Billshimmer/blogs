'use strict';

import Parse from 'lab4/parse';
import ActionTypes from './ActionTypes';
import updateCurrentUser from './updateCurrentUser';

const User = Parse.User;

function getLABUserData() {
  let userDiv = document.getElementById('lab-user-data');
  if (userDiv) {
    try {
      let user = JSON.parse(userDiv.innerText);
      if (user.objectId) {
        return user;
      }
    } catch(e) {
    }
  }
}

export default function (store, config) {
  if (config && config.user === false) {
    return null;
  }
  //初始化用户
  const currentAsyncPromise = User.currentAsync()
    .then((user) => {
      if (user != null) {
        // 从存储在页面上的当前用户信息初始化
        const userData = getLABUserData();
        if (userData) {
          User.unsafeUpdateCurrentUser(userData);
          user = User.current();
        } else {
          // 页面上不存在用户数据切cookie登录的情况下 更新用户数据
          updateCurrentUser(store);
        }
      }
      if (user) {
        store.dispatch({
          type: ActionTypes.INIT_CURRENT_USER,
          payload: user.attributes,
        });
      }
      return null;
    }, (error) => {
      if (__DEV__) {
        console.warn('currentAsync error:' + (error && error.message) + '\n', error);
      }
    });
  return currentAsyncPromise;
};
