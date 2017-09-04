'use strict';

import {
  applyMiddleware,
  createStore,
  combineReducers,
} from 'redux';
import userReducer from './reducers/user';

export default function (reducers, preloadedState) {
  const reducer = combineReducers({
      ...reducers,
      user: userReducer,
    },
    preloadedState
  );
  return createStore(reducer, preloadedState);
};
