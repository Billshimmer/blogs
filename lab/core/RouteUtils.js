'use strict';
import utils from '../utils';
const { shallowEqual } = utils;

export default {
  ROUTE_UNEQUAL: 0,
  ROUTE_EQUAL: 1,
  ROUTE_CORE_EQUAL: 2,
  /**
   * 复制route 前后route属性相同，但对navigation来说属于不同的route
   */
  cloneRoute(route) {
    const clonedRoute = Object.assign({}, route);
    delete clonedRoute.key;
    return clonedRoute;
  },
  /**
   * 简单比较route是否相等
   */
  isRouteEqual(route1, route2) {
    return this.compareRoute(route1, route2) === 1;
  },
  compareRoute(route1, route2) {
    if (route1 === route2) {
      return 1;
    }
    if (!route1 || !route2) {
      return 0;
    }
    if (!this.isRouteCoreEqual(route1, route2)) {
      return 0;
    }
    if (
      shallowEqual(route1.data, route2.data) &&
      shallowEqual(route1.passProps, route2.passProps)
    ) {
      return 1;
    }
    return 2;
  },
  /**
   * 判断route的关键信息是否相等
   */
  isRouteCoreEqual(route1, route2) {
    if (route1 === route2) {
      return true;
    }
    if (!route1 || !route2) {
      return false;
    }
    return (
      route1.key === route2.key &&
      route1.id === route2.id &&
      route1.url === route2.url &&
      route1.comp === route2.comp &&
      route1.tpl === route2.tpl &&
      route1.config === route2.config &&
      route1.compData === route2.compData
    );
  },
};
