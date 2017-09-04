'use strict';

import ReactNative, {
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import LAB, {
  EventEmitter,
  utils,
  http,
} from 'lab4';
import throttle from 'lodash/throttle';

const LABIMModule = NativeModules.LABIMModule;

class IMManager extends EventEmitter {

  constructor() {
    super();
    this.CONVERSION_LIST_CHANGE = 'CONVERSION_LIST_CHANGE';
    this.DISCONNECTED = 'DISCONNECTED';
    this.CONNECTED = 'CONNECTED';
    this.MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';

    this.LINKING_PATH = '/im';

    DeviceEventEmitter.addListener('LAB_IM_MESSAGE_RECEIVED', throttle((data) => {
      this.emit(this.MESSAGE_RECEIVED, data);
      this.emit(this.CONVERSION_LIST_CHANGE, data);
    }, 1100));
    DeviceEventEmitter.addListener('LAB_IM_DISCONNECTED', (data) => {
      this.emit(this.DISCONNECTED, data);
    });
    DeviceEventEmitter.addListener('LAB_IM_CONNECTED', (data) => {
      this.emit(this.CONNECTED, data);
    });
  }

  init(options) {
    this._loginUrl = options.loginUrl;
    this._contactInfoUrl = options.contactInfoUrl;
    LABIMModule.init({
      chatRecordUrl: utils.getAbsoluteUrl(options.chatRecordUrl),
      latestContactsUrl: utils.getAbsoluteUrl(options.latestContactsUrl),
    });
  }

  login(options) {
    return http.fetch(this._loginUrl)
      .then((data) => {
        if (data.CODE !== 'ok') {
          return Promise.reject(data);
        }
        return new Promise((resolve, reject) => {
          LABIMModule.login({
            imId: data.DATA.IMUser.id,
            password: data.DATA.IMUser.password,
          }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      });
  }

  logout() {
    return new Promise((resolve, reject) => {
      LABIMModule.logout((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  getUnreadMessagesCount() {
    return new Promise((resolve, reject) => {
      LABIMModule.getUnreadMessagesCount((error, count) => {
        if (error) {
          if (__DEV__) {
            console.warn('LABIMModule.getUnreadMessagesCount error:', error);
          }
          resolve(0);
        } else {
          resolve(count);
        }
      });
    });
  }

  /**
   * 获取当前登录的用户信息
   * 如果未登录，则回调null
   * resolve: {
   * 	 imId,
   * }
   */
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      LABIMModule.getCurrentUser((error, user) => {
        if (error) {
          reject(error);
        } else {
          resolve(user);
        }
      })
    });
  }

  /**
   * 获取最近联系人列表
   */
  getConversationList() {
    return new Promise((resolve, reject) => {
      LABIMModule.getConversationList((error, list) => {
        if (error) {
          reject(error);
        } else {
          resolve(list);
        }
      });
    }).then((list) => {
      list = list || [];
      if (!list.length) {
        return list;
      }
      let needRequest;
      if (this._contactCache) {
        list = list.map((conversation) => {
          let contachInfo = this._contactCache[conversation.imId];
          if (contachInfo) {
            return {
              ...conversation,
              ...contachInfo,
            };
          } else {
            needRequest = true;
            return conversation;
          }
        });
      } else {
        needRequest = true;
      }
      if (!needRequest) {
        return list;
      }
      let imIdStr = list.map(conversation => conversation.imId).join(',');
      return http.fetch(this._contactInfoUrl + imIdStr)
        .then((data) => {
          if (data.CODE !== 'ok') {
            return Promise.reject(data);
          }
          let contactInfo = data.DATA.contact_info;
          this._updateContactCache(contactInfo);
          return list.map((conversation) => {
            return {
              ...conversation,
              ...contactInfo[conversation.imId],
            };
          });
        });
    });
  }

  _updateContactCache(contactInfoMap) {
    if (!this._contactCache) {
      this._contactCache = contactInfoMap;
    } else {
      Object.assign(this._contactCache, contactInfoMap);
    }
  }

  /**
   * 更新联系人缓存
   * @param contactMap {
   *   [imId]: {
   *     ...userInfo
   *   },
   *   ...
   * }
   */
  updateContactCache(contactInfoMap) {
    this._updateContactCache(contactInfoMap);
    setTimeout(() => {
      this.emit(this.CONVERSION_LIST_CHANGE);
    });
  }
}

export default new IMManager();
