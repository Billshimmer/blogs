'use strict';

/**
 * NOTE
 * 1.约定subStore上的成员的key需符合js变量命名，使用subStore.xxx 获取
 * {store.xxx.aaa[0].bbb['ccc']}
 */

const storeReg = /^\{store\.([A-Za-z\d_]+).*\}$/;
const codeSplitReg = /[\.\[\]'"]+/;

function defineStoreGetter(data, key, subStoreName, code, store) {
  let subscripts;
  Object.defineProperty(data, key, {
    get() {
      if (!code) {
        return store.getState()[subStoreName];
      }
      if (!subscripts) {
        subscripts = code.split(codeSplitReg);
        if (!subscripts[subscripts.length - 1]) {
          subscripts.pop();
        }
      }
      let result = store.getState()[subStoreName];
      let subscriptIndex = 0;
      for (
        ;
        subscriptIndex < subscripts.length && result != null;
        ++subscriptIndex
      ) {
        result = result[subscript];
      }
      if (__DEV__) {
        if (subscriptIndex != subscripts.length) {
          console.warn(
            '执行store模板时遇到null，执行终止 code:',
            code,
            'subscripts:',
            subscripts,
            'subscript:',
            --subscriptIndex < 0 ? subStoreName : subscripts[subscriptIndex],
            'subscriptIndex:',
            subscriptIndex
          );
        }
      }
      return result;
    },
  });
}

function r(data, subStoreNameSet, store) {
  let key;
  let value;
  let matchResult;
  let subStoreName;
  for (key in data) {
    value = data[key];
    if (!value) {
      continue;
    }
    if (typeof value === 'string' && value.length < 64) {
      //代码长度不能超过64
      matchResult = storeReg.exec(value);
      if (!matchResult) {
        continue;
      }
      subStoreName = matchResult[1];
      subStoreNameSet[subStoreName] = true;
      // {store.. = 8
      defineStoreGetter(
        data,
        key,
        subStoreName,
        value.slice(8 + subStoreName.length, value.length - 1),
        store
      );
      continue;
    }
    if (value.ui_type || Array.isArray(value)) {
      r(value, subStoreNameSet, store);
    }
  }
}

function performanceNow() {
  if (global.performance && global.performance.now) {
    return performance.now();
  }
  return Date.now();
}

/**
 * 处理平台数据，替换store模板
 * @param  {Object} data 平台json数据
 * @param  {Object} store REDUX 的store
 * @return {Object}      subStore name set
 * 
 * NOTE: 处理过的数据会有缓存，所以不能更换store
 */
export default function(data, store) {
  let subStoreNameSet = data.__lab__subStoreNameSet;
  if (!subStoreNameSet) {
    if (__DEV__) {
      var startTime = performanceNow();
    }
    subStoreNameSet = Object.create(null);
    r(data, subStoreNameSet, store);
    //数据已被处理过的标记，同时也是数据包含的subStore的缓存
    Object.defineProperty(data, '_$lab_subStoreNameSet', {
      enumerable: false,
      value: subStoreNameSet,
    });
    if (__DEV__) {
      var totalTime = performanceNow() - startTime;
      if (totalTime > 2) {
        console.warn('processStoreTemplate time:', totalTime, 'data:', data);
      }
    }
  }
  return subStoreNameSet;
};
