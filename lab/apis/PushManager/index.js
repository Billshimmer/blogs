/**
 * 推送
 */
'use strict';

import ReactNative, {
  NativeModules,
  Platform,
  NativeAppEventEmitter,
} from 'react-native';
import EventEmitter from 'lab4/core/emitter/EventEmitter';

const PushModule = NativeModules.LABPushModule;
const EventConstants = {
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  NOTIFICATION_RECEIVED: 'NOTIFICATION_RECEIVED',
};

let parseData;
if (Platform.OS === 'android') {
  parseData = function(data) {
    let extra = data.extra;
    if (extra) {
      try {
        extra = JSON.parse(extra);
      } catch (e) {
        if (__DEV__) console.warn('PushManager parseData error', e);
        extra = {};
      }
    } else {
      extra = {};
    }

    return {
      title: data.title,
      alert: data.alert,
      extra,
    };
  };
} else {
  parseData = function(data) {
    return {
      alert: data && data.aps && data.aps.alert,
      extra: data,
    };
  };
}

/**
 * 对外推送数据格式
 * {
 *   title,
 *   alert,
 *   extra: {
 *     ...推送自定义数据 (一般包括type url 等)
 *   },
 *   ... TODO 定义其他标准字段
 * }
 */
class PushManager extends EventEmitter {
  constructor() {
    super();
    NativeAppEventEmitter.addListener('LAB_PUSH_MESSAGE_RECEIVED', data => {
      this.emit(EventConstants.MESSAGE_RECEIVED, parseData(data));
    });
    NativeAppEventEmitter.addListener(
      'LAB_PUSH_NOTIFICATION_RECEIVED',
      data => {
        this.emit(EventConstants.NOTIFICATION_RECEIVED, parseData(data));
      }
    );
  }

  /**
	 * 初始化推送
	 */
  initPush() {
    PushModule.initPush && PushModule.initPush();
  }

  /**
   * 停止推送
   */
  stopPush() {
    PushModule.stopPush && PushModule.stopPush();
  }

  /**
   * 恢复推送
   */
  resumePush() {
    PushModule.resumePush && PushModule.resumePush();
  }

  /**
   * 获取推送状态 (0表示推送关闭， 1表示推送开启)
   */
  getPushState() {
    return new Promise((resolve, reject) => {
      PushModule.getPushState((error, state) => {
        if (error) {
          reject(error);
        } else {
          resolve(state);
        }
      });
    });
  }

  /**
	 * 获取推送信息 如clientId 等...
	 * @return Promise
	 */
  getInfo() {
    return new Promise((resolve, reject) => {
      PushModule.getInfo(data => {
        resolve(data);
      });
    });
  }

  /**
   * 设置tag
   * @param {Array} tag 空数组或为空则会取消所有已设置的tag
   * @return Promise success: resultCode  error: error
   */
  setTags(tag) {
    return new Promise((resolve, reject) => {
      PushModule.setTags(String(tag), (error, resultCode) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultCode);
        }
      });
    });
  }

  /**
   * 设置alias
   * @param {String} alias
   * @return Promise success: resultCode  error: error
   */
  setAlias(alias) {
    return new Promise((resolve, reject) => {
      PushModule.setAlias(String(alias), (error, resultCode) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultCode);
        }
      });
    });
  }

  /**
   * 删除设置的Alias
   * @return Promise success: resultCode  error: error
   */
  removeAlias() {
    return new Promise((resolve, reject) => {
      PushModule.removeAlias((error, resultCode) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultCode);
        }
      });
    });
  }

  /**
 	 * 设置角标
 	 * TODO Android 支持
 	 */
  setBadge(badge) {
    PushModule.setBadge && PushModule.setBadge(badge);
  }

  /**
   * 清除推送通知
   * TODO
   */
  clearAllNotifications() {
    PushModule.clearAllNotifications && PushModule.clearAllNotifications();
  }

  /**
   * 解析推送通知数据为推送数据格式
   */
  parseNotificationData(data) {
    return parseData(data);
  }
}

export default Object.assign(new PushManager(), EventConstants);
