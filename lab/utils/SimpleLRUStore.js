'use strict';

import Storage from 'lab4/utils/Storage';

function prefixKey(key) {
  return 'SimpleLRUStore_' + key;
}

function defaultValueEqual(a, b) {
  return a == b;
}

//简单的队列存储，适用于保存搜索历史记录等
export default {

  /**
   * 存储新值
   * @param key 队列名
   * @param value 数据
   * @param maxLength 队列最大长度
   * @return Promise newData: Array 新的数据
   */
  save(key, value, maxLength = 50, valueEqual = defaultValueEqual) {
    var _key = prefixKey(key);
    return Storage.get(_key)
      .finally((data) => {
        var newData = [value];
        if (Array.isArray(data)) {
          for (let i = 0, len = Math.min(data.length, maxLength - 1); i < len; ++i) {
            if (!valueEqual(data[i], value)) {
              newData.push(data[i]);
            }
          }
        }
        return Storage.save(_key, newData)
          .then(() => newData);
      });
  },

  /**
   * 获取一个队列中的所有数据
   * @param key 对列名
   * @return Promise data: Array
   */
  getAll(key) {
    return Storage.get(prefixKey(key))
      .then((data) => {
        if (__DEV__) {
          if (data && !Array.isArray(data)) {
            throw new Error('数据格式错误');
          }
        }
        return data || [];
      });
  },

  /**
   * 清除一个队列
   * @param key 对列名
   * @return Promise
   */
  clear(key) {
    return Storage.delete(prefixKey(key));
  }
};
