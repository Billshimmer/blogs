'use strict';

import ActionTypes from '../ActionTypes';

const initialState = {
  isLoggedIn: false,
};

function user(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOGGED_IN:
    case ActionTypes.INIT_CURRENT_USER:
      return {...action.payload, isLoggedIn: true};
    case ActionTypes.LOGGED_OUT:
      return initialState;
    case ActionTypes.UPDATE_USER_DATA:
      return {isLoggedIn: state.isLoggedIn, ...action.payload};
    default:
      return state;
  }
}

export default user;
