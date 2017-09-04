'use strict';

import Parse from 'lab4/parse';
import ActionTypes from './ActionTypes';

const User = Parse.User;

// 请求服务器刷新用户数据
export default function updateCurrentUser(store) {
  return User.updateCurrentUser()
    .then((user) => {
      //console.log('update success', user.attributes);
      store.dispatch({
        type: ActionTypes.INIT_CURRENT_USER,
        payload: user.attributes,
      });
    }, (error) => {
      if (__DEV__) {
        console.log('init user updateCurrentUser error:', error);
      }
      if (error && (error.isLoggedIn === false)) {
        store.dispatch({
          type: ActionTypes.LOGGED_OUT,
        });
      }
    });
};