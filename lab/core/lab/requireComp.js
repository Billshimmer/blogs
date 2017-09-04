'use strict';

import invariant from 'fbjs/lib/invariant';
import getNotFoundErrorComp from './getNotFoundErrorComp';

let compMap;

/**
 * 配置框架build产生的comps
 */
export function configComps(comps) {
  if (!comps) {
    throw new Error('configComps comps不能为空');
  }
  compMap = comps.cps2;
  // 不建议使用全局的cps对象 延迟初始化全局cps对象
  Object.defineProperty(global, 'cps', {
    get: function() {
      if (__DEV__/* && !global.__ALLOW_CPS__ */) {
        try {
          throw new Error('cps 已经废弃，请使用LAB.requireComp');
        } catch (e) {
          console.warn(e);
        }
      }
      const cps1 = comps.cps1();
      Object.defineProperty(global, 'cps', {
        value: cps1,
        writable: false,
        enumerable: true,
        configurable: true,
      });
      return cps1;
    },
    enumerable: true,
    configurable: true,
  });
}

/**
 * 获取comp 不检查是否存在
 * @param {any} compId 
 */
export function getComp(compId) {
  return compMap[compId];
}

/**
 * require lab4组件
 * @param compId 如 com.Button
 */
export default function requireComp(compId) {
  if (__DEV__) {
    invariant(compMap, '必须先调用initialize');
  }
  const comp = compMap[compId];
  if (comp) {
    return comp;
  }
  if (__DEV__) {
    console.warn(`未找到组件 ${compId} 尝试npm run build`);
  }
  return getNotFoundErrorComp(compId);
  //throw new Error(`未找到组件 ${compId}`);
}