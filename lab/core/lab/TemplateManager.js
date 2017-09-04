'use strict';

let tplMap = {};
let defaultTpl;
let defaultTplName = 'lab.DefaultPage-default';

/**
 * 配置预打包的默认模板
 */
export function configTpls(tpls) {
  tplMap = tpls;
}

/**
 * 获取模板数据
 * @param name 模板名(规则 组件名-默认数据名 如: com.TestPage-default)
 */
export function getTpl(name) {
  return tplMap[name];
}

/**
 * 获取默认模板
 */
export function getDefaultTpl() {
  return defaultTpl || tplMap[defaultTplName];
}

/**
 * 配置默认模板 优先级高于模板配置中的default模板
 */
export function setDefaultTpl(tpl) {
  defaultTpl = tpl;
}

/**
 * 设置默认模板名字 默认使用lab.DefaultPage-default
 */
export function setDefaultTplName(tplName) {
  defaultTplName = tplName;
}

export default {
  configTpls,
  getTpl,
  getDefaultTpl,
  setDefaultTpl,
  setDefaultTplName,
};