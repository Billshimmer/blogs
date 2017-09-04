'use strict';

import CoreManager from '../src/CoreManager';
import ParseObject from '../src/ParseObject';
import ParseQuery from '../src/ParseQuery';
import Storage from '../src/Storage';
import ParsePromise from '../src/ParsePromise';
import CollectionObjectStorage from './CollectionObjectStorage';
import User from './LABUser';
import PromiseQueue from 'promise-queue';

let __loadAllQueue = new PromiseQueue(1); //TODO

let labLocalCount = 0;

let localChangeMark = Object.create(null);

/**
 * 对ParseObject的扩展
 * 设置prependNewObj为true 则新创建的元素保存到本地时会插入到数组的开头
 * TODO 本地数据缓存与用户登录相关
 */
export default class LABObject extends ParseObject {

  constructor(className, attributes: ?AttributeMap) {
    super(className);
    if (attributes && typeof attributes === 'object'){
      this.set(attributes);
    }
  }

  get labId() {
    return this.id || this.labLocalId;
  }

  get labLocalId() {
    let _lab_localId = this._lab_localId;
    if (_lab_localId) {
      return _lab_localId;
    }
    _lab_localId = this.get('_lab_localId');
    if (_lab_localId) {
      return _lab_localId;
    }
    //XXX 防重复
    _lab_localId = this._lab_localId = '_l' + Date.now() + '_' + (labLocalCount++);
    this._finishFetch({
      _lab_localId,
    });
    return _lab_localId;
  }

  static _getCollectionStoreKey(className) {
    let key = className + '_list';
    if (this.IS_USER_PRIVATE) {
      //属于用户私有数据
      if (User.isLoggedIn()) {
        key = key + '_uid' + User.current().id;
      }
    }
    return Storage.generatePath(key);
  }

  /**
   * 获取扩展属性 子类可重写，用于在将ParseObject转化为redux 纯对象时的额外属性
   */
  // getExtAttr() {
  //
  // }

  /**
   * 如果网络良好会保存到服务端同时更新本地存储
   * 否则保存到本地，会自动生成唯一_localId与_isLocalChanged, _isLocalChanged表示本地有更新未提交
   * 一旦网络恢复或者程序下次启动的时候都会触发与服务器的同步
   * @return Promise
   */
  saveEventually(options) {
    let storeKey = this.constructor._getCollectionStoreKey(this.className);
    return this.save()
      .then(
        () => {
          //保存到服务端成功，更新本地缓存
          if (!options || options.updateLocalChanged) {
            this._finishFetch({
              _isLocalChanged: false,
            });
          }
          return CollectionObjectStorage.save(storeKey, this, this.prependNewObj)
            .then(() => this);
        },
        () => {
          //保存到服务端失败，保存到本地
          this._finishFetch({
            _isLocalChanged: true,
          });
          //标记需要在有网络之后同步数据
          localChangeMark[storeKey] = true;
          return CollectionObjectStorage.save(storeKey, this, this.prependNewObj)
            .then(() => this);
        });
  }

  /**
   * 保存到本地存储
   * @return Promise
   */
  saveToLocalStore() {
    // 有可能数据相对于上次没有改变，但这里不处理了
    let storeKey = this.constructor._getCollectionStoreKey(this.className);
    this._finishFetch({
      _isLocalChanged: true,
    });
    return CollectionObjectStorage.save(storeKey, this, this.prependNewObj)
      .then(() => this);
  }

  destroy(...args: Array<any>): ParsePromise {
    let storeKey = this.constructor._getCollectionStoreKey(this.className);
    return super.destroy.apply(this, args).then(() => {
      //删除本地缓存
      CollectionObjectStorage.removeOne(storeKey, this);
      return this;
    });
  }

  static getLocalChangeMark() {
    return localChangeMark;
  }

  /**
   * 同步所有本地改变到服务器
   * @return Promise
   */
  static syncingAllLocalChanges(className) {
    className = className || this.CLASS_NAME;
    let storeKey = this._getCollectionStoreKey(className);
    //TODO 应该放入队列执行
    return CollectionObjectStorage.getAll(storeKey)
      .then((list) => {
        list = list.filter((obj) => obj.get('_isLocalChanged'))
          .map((obj) => obj.saveEventually());
        if (!list.length) {
          return list;
        }
        return ParsePromise.all(list);
      })
      .then((list) => {
        //设置是否有未同步数据标记
        localChangeMark[storeKey] = list.some((obj) => obj.get('_isLocalChanged'));
        return list;
      });
  }

  // 合并服务端新获取的数据与客户端保存的数据
  static _mergeToLocal(className, serverList) {
    let storeKey = this._getCollectionStoreKey(className);
    return CollectionObjectStorage.getAll(className).then((localList) => {
      let unsavedList = [];
      let savedUnSyncMap = Object.create(null);
      localList.forEach((obj) => {
        if (!obj.id) {
          unsavedList.push(obj);
        } else if(obj.get('_isLocalChanged')) {
          savedUnSyncMap[obj.id] = obj;
        }
      });

      let mergedList = serverList.map((serverObj) => {
        if (savedUnSyncMap[serverObj.id]) {
          return savedUnSyncMap[serverObj.id];
        } else {
          return serverObj;
        }
      });
      mergedList = mergedList.concat(unsavedList);

      return CollectionObjectStorage.replaceAll(storeKey, mergedList);
    });
  }

  /**
   * 确保所有未提交同步完成之后，向服务器请求所有数据并更新缓存
   * 如果请求网络失败则返回本地缓存
   * @return Promise
   */
  static getAllWithLocalStore(className) {
    className = className || this.CLASS_NAME;
    let storeKey = this._getCollectionStoreKey(className);

    //FIXME 确保顺序执行
    return __loadAllQueue.add(() => {
      //获取服务端新数据之前先同步所有数据
      let syncingPromise;
      if (localChangeMark[storeKey] === false) {
        syncingPromise = ParsePromise.as();
      } else {
        //如果localChangeMark[storeKey]为undefined 说明本次程序打开还没有同步过，所以也需要先同步
        syncingPromise = this.syncingAllLocalChanges(className);
      }
      const always = () => {
        //不管同步是否成功都请求新数据
        return new ParseQuery(className).find();
      };
      return syncingPromise.then(always, always)
        .then((list) => {
          return this._mergeToLocal(className, list);
        })
        .catch((error) => {
          if (__DEV__) {
            console.log('getAllWithLocalStore error:', error);
          }
          //失败时获取本地数据
          return CollectionObjectStorage.getAll(storeKey);
        });
    });
  }

  static getFromLocalStore(id, className) {
    className = className || this.CLASS_NAME;
    let storeKey = this._getCollectionStoreKey(className);
    if (!className) {
      throw new Error('!className');
    }
    return CollectionObjectStorage.getAll(storeKey)
      .then((list) => {
        return list.find((ele) => {
          return ele.labId === id;
        });
      });
  }

}
