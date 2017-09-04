'use strict';

import pathToRegexp from 'path-to-regexp';
import URI from 'urijs';
import utils from '../utils';

/**
 * 路由管理，负责路由表配置(url对应page的配置)
 * 使用path-to-regexp
 * https://github.com/pillarjs/path-to-regexp
 */
const RouterManager = {
  _compiledRouteConfigs: [],

  /**
   * 配置路由清单
   * 排在前面的优先级高
   * 只对url path部分匹配
   * @param routeConfigs 路由配置数组
   * 配置项:
   * {
   *   path,
   *   comp,
   *   tpl,
   *   isStaticTpl, //完全静态的模板，不需要请求网络
   *   ignoreLoadError, //忽略网络加载失败
   * }
   */
  configRouteManifest(routeConfigs) {
    for (let i = 0; i < routeConfigs.length; ++i) {
      this.addRouteConfig(routeConfigs[i].path, routeConfigs[i]);
    }
  },

  /**
   * 添加一个路由规则配置
   * @param pattern: String route的匹配字符串
   * @param routeConfig: Object 配置
   */
  addRouteConfig(pattern, routeConfig) {
    const keys = [];
    const re = pathToRegexp(pattern, keys);
    this._compiledRouteConfigs.push({
      re,
      keys,
      config: routeConfig || {},
    });
  },

  /**
   * 获取url path对应的routeConfig
   * @param url
   * @return {
   *   config,  //route配置项
   *   params: Object,   //匹配到的参数
   * } 或者null 未找到匹配的route
   * 
   * TODO 是否需要缓存
   */
  matchUrl(url) {
    //只匹配path部分
    const pathname = new URI(url).path();
    const compiledRouteConfigs = this._compiledRouteConfigs;
    let compiledRouteConfig;
    for (let i = 0, len = compiledRouteConfigs.length; i < len; ++i) {
      compiledRouteConfig = compiledRouteConfigs[i];
      const match = compiledRouteConfig.re.exec(pathname);
      if (match) {
        let params;
        if (compiledRouteConfig.keys.length) {
          params = compiledRouteConfig.keys.reduce((memo, key, index) => {
              memo[key.name] = match[index + 1];
              return memo;
            }, {});
        } else {
          params = null;
        }
        return {
          config: compiledRouteConfig.config,
          params,
        };
      }
    }
    return null;
  },

  /**
   * 为route对象设置 routeConfig params 字段
   */
  prepareRouteConfig(route) {
    if (!route) {
      return;
    }
    if (utils.hasOwnProp(route, 'routeConfig')) {
      return;
    }
    Object.defineProperty(route, 'routeConfig', {
      get() {
        const match = matchRouteAndSet(this);
        return match.config;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(route, 'params', {
      get() {
        const match = matchRouteAndSet(this);
        return match.params;
      },
      enumerable: false,
      configurable: true,
    });
  },
};

function matchRouteAndSet(route) {
  const match = (route.url && RouterManager.matchUrl(route.url)) || { config: {}, params: null };
  Object.defineProperty(route, 'routeConfig', {
    value: match.config,
    enumerable: false,
  });
  Object.defineProperty(route, 'params', {
    value: match.params,
    enumerable: false,
  });
  return match;
}

export default RouterManager;
