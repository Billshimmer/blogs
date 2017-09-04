'use strict';

import ParseObject from '../src/ParseObject';
import ParsePromise from '../src/ParsePromise';
import Storage from '../src/Storage';

let cache = Object.create(null);

function stringToObjList(str) {
  let list;
  if (!str) {
    list = [];
  } else {
    list = JSON.parse(str);
    if (Array.isArray(list)) {
      //TODO 对于有本地改动为提交的 读取时将所有属性set一遍 使其进入peindOps?
      // FIXME 从本地存储反序列化的对象 通过fromJSON 没有记录pendingOps 导致无法save到服务器
      list = list.map((v) => {
        let obj = ParseObject.fromJSON(v);
        if (v._isLocalChanged) {
          obj.save(obj.attributes); //XXX
        }
        return obj;
      });
    } else {
      list = [];
    }
  }
  return list;
}

function objListToString(list) {
  let jsonList = list.map((v) => {
    return v._toFullJSON();
  });
  return JSON.stringify(jsonList);
}

let CollectionObjectStorage = {

  /**
   * 获取所有,按存储顺序返回
   */
  getAll(key) {
    let result = cache[key];
    if (result) {
      return ParsePromise.as(result);
    }
    return Storage.getItemAsync(key)
      .then((data) => {
        data = stringToObjList(data);
        cache[key] = data;
        return data;
      });
  },

  /**
   * 保存一个,按照labId 查找更新
   * prepend 是否将新创建的加入到数组开头，默认append
   */
  save(key, obj, prepend) {
    let data = cache[key];
    let dataPromise;
    if (data) {
      dataPromise = ParsePromise.as(data);
    } else {
      dataPromise = this.getAll(key);
    }
    return dataPromise.then((data) => {
      let objId = obj.labId;
      let i = 0;
      let oriObj;
      for (; i < data.length; ++i) {
        oriObj = data[i];
        if (objId === oriObj.labId) {
          break;
        }
      }
      if (i === data.length) {
        if (prepend) {
          data.unshift(obj);
        } else {
          data.push(obj);
        }
      } else {
        data[i] = obj;
      }

      return this.replaceAll(key, data);
    });
  },

  replaceAll(key, list) {
    return Storage.setItemAsync(key, objListToString(list))
      .then(() => {
        cache[key] = list;
        return ParsePromise.as(list);
      })
  },

  removeAll(key) {
    delete cache[key];
    return Storage.removeItemAsync(key);
  },

  removeOne(key, obj) {
    this.getAll(key)
      .then((list) => {
        let objId = obj.labId;
        let newList = list.filter((oriObj) => {
          return objId !== oriObj.labId;
        });
        if (newList.length === list.length) {
          return;
        }

        return this.replaceAll(key, newList);
      });
  }
};

export default CollectionObjectStorage;
