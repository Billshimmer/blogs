'use strict';

import ReactNative, {
  PushNotificationIOS,
} from 'react-native';
import PushManager from 'lab4/apis/PushManager';
import EventEmitter from 'lab4/core/emitter/EventEmitter';
import EventConstants from './Constants';

/**
 * PushNotificationIOS对象的
 * {
 *   getBadgeCount(),
 *   ...
 *
 *   getData() : {
 *     lab_notification_type, //通知的类型 目前有 IM 与 PUSH
 *     lab_is_notification_click, //ios 标记通知是直接触发还是通过点击触发 一般只有localNotification才会有
 *     remote, //标记通知是否为remote 只有getInitialNotification会有
 *     ...其它通知数据
 *   }
 * }
 */
class NotificationManager extends EventEmitter {

  constructor() {
    super();

    PushNotificationIOS.addEventListener('notification', (notificationObj) => {
      const notification = this._convertNotification(notificationObj);
      //ios remote 的触发一定是click ?
      notification.isNotificationClick = true;
      notification.isRemote = true;
      this.emit(EventConstants.NOTIFICATION_OPENED, notification);
    });
    PushNotificationIOS.addEventListener('localNotification', (notificationObj) => {
      const notification = this._convertNotification(notificationObj);
      notification.isRemote = false;
      if (notification.isNotificationClick) {
        this.emit(EventConstants.NOTIFICATION_OPENED, notification);
      } else {
        this.emit(EventConstants.NOTIFICATION_RECEIVED, notification);
      }
    });
  }

  _convertNotification(pushNotificationIOS) {
    let {
      lab_notification_type,
      lab_is_notification_click,
      remote,
      ...data,
    } = pushNotificationIOS.getData();
    if (lab_notification_type === 'PUSH') {
      data = PushManager.parseNotificationData(data);
    }
    return {
      notificationType: lab_notification_type,
      isNotificationClick: !!lab_is_notification_click,
      isRemote: !!remote,
      data,
      notificationIOS: pushNotificationIOS,
    };
  }

  getInitialNotification() {
    return PushNotificationIOS.getInitialNotification().then((data) => {
      let notification = data ? this._convertNotification(data) : null;
      if (notification) {
        delete notification.isNotificationClick;
      }
      this._cachedInitialNotification = notification;
      return notification;
    });
  }

  getCachedInitialNotification() {
    return this._cachedInitialNotification;
  }

  cancelAll() {
    PushNotificationIOS.cancelAllLocalNotifications();
  }
}

const notificationManager = new NotificationManager();
Object.assign(notificationManager, EventConstants);

export default notificationManager;
