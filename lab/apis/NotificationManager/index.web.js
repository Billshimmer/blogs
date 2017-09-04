'use strict';

class NotificationManager {

  getInitialNotification() {
    return Promise.resolve(null);
  }

  getCachedInitialNotification() {
    return null;
  }

  cancelAll() {
  }
}

export default new NotificationManager();
