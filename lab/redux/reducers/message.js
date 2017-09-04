'use strict';

const initialState = {
  systemMessageUnreadCount: 0,
  imMessageUnreadCount: 0,
};

module.exports = function(state = initialState, action) {
  switch (action.type) {
    case 'SYSTEM_MESSAGE_UNREAD_CHANGE':
      return {
        ...state,
        systemMessageUnreadCount: Number(action.payload) || 0,
      };
    case 'IM_MESSAGE_UNREAD_CHANGE':
      return {
        ...state,
        imMessageUnreadCount: Number(action.payload) || 0,
      };
    default:
      return state;
  }
};
