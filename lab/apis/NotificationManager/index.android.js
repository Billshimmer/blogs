'use strict';

import ReactNative, {
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import PushManager from 'lab4/apis/PushManager';
import EventEmitter from 'lab4/core/emitter/EventEmitter';
import EventConstants from './Constants';
const NotificationModule = NativeModules.LABNotificationModule;

/**
 * 对外通知对象
 * {
 *  notificationType, //通知的类型 目前有 IM 与 PUSH
 *  isNotificationClick, //ios 标记通知是直接触发还是通过点击触发 对getInitialNotification没有意义
 *  isRemote, //ios 标记通知是否为remote
 *  data, //通知数据
 *  ..., //其他配置
 *  notificationAndroid, //android native 通知对象
 *  notificationIOS, //ios native 通知对象(PushNotificationIOS对象)
 *}
 *
 * android native通知对象
 * {
 *   notification: {
 *     lab_notification_type, //通知的类型 目前有 IM 与 PUSH
 *     ...其它通知数据 最后会放入对外通知对象的data中
 *   },
 * }
 */
class NotificationManager extends EventEmitter {

  constructor() {
    super();

    DeviceEventEmitter.addListener('LAB_NOTIFICATION_OPENED', (data) => {
      this.emit(EventConstants.NOTIFICATION_OPENED, this._convertNotification(data));
    });
  }

  _convertNotification(nativeNotification) {
    let {
      lab_notification_type,
      ...data,
    } = nativeNotification.notification;
    if (lab_notification_type === 'PUSH') {
      data = PushManager.parseNotificationData(data);
    }
    return {
      notificationType: lab_notification_type,
      data,
      notificationAndroid: nativeNotification,
    };
  }

  /**
   * 获取打开程序的初始通知
   */
  getInitialNotification() {
    let p = NotificationModule.getInitialNotification()
    p.then((data) => {
      let notification = data ? this._convertNotification(data) : null;
      this._cachedInitialNotification = notification;
      return notification;
    });
    return p;
  }

  /**
   * 获取缓存的初始通知，一般调用这个就可以
   */
  getCachedInitialNotification() {
    return this._cachedInitialNotification;
  }

  /**
   * 关闭通知栏的所有通知
   */
  cancelAll() {
    NotificationModule.cancelAll();
  }
}

const notificationManager = new NotificationManager();
Object.assign(notificationManager, EventConstants);

export default notificationManager;
