'use strict';

import LAB, {
  DI,
} from 'lab4';
import IMManager from 'lab4/apis/IM/IMManager';

module.exports = {
  updateImMessageUnreadCount() {
    IMManager.getUnreadMessagesCount()
      .then((count) => {
        DI.getStore().dispatch({
          type: 'IM_MESSAGE_UNREAD_CHANGE',
          payload: count,
        });
      });
  },
};
