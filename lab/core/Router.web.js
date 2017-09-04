'use strict';

/**
 * 路由对象 route
 * ```
 * {
 *   id: String,
 *   url: String,
 *   comp: CompClass | String,
 *   tpl: String, //原defaultData
 *   data: any 附带数据
 *   passProps: object, //传递给route对应comp的数据
 *   config 对目标scene的配置 如title 等 TODO
 *   //navigator 控制相关 如configScene等 TODO
 *   _$lab_route_prepare_flag  //标记route是否已经处理过 内部使用
 *
 *   routeConfig: Object, //根据路由规则获取的路由配置 由框架添加
 *   params: Array, //根据路由规则匹配到的url的参数 由框架添加
 *
 *   TODO 其他参数 如 sceneConfig  函数类型参数 如renderScene等
 *   ... Navigator支持的属性
 *   ... Navigator内部使用的属性
 * }
 * ```
 */
export default class Router {
  constructor() {}

  setNavigation(navigator) {
    this.navigator = navigator;
  }

  /**
   * 用于代替push 默认行为会检查是否已存在相同的route 并选择是push还是...
   * XXX 暂时只检查url
   */
  navigate(route) {
    this._prepareRoute(route);
    if (!route.url) {
      this.navigator.push(route);
    }
    let url = route.url;
    let routes = this.navigator.getCurrentRoutes();
    let i = routes.length - 1;
    for (; i >= 0; --i) {
      if (routes[i].url === url) {
        this.navigator.popToRoute(routes[i]);
        return;
      }
    }
    this.navigator.push(route);
  }

  push(route) {
    this._prepareRoute(route);
    this.navigator.push(route);
  }

  pop() {
    if (this.navigator.getCurrentRoutes().length > 1) {
      this.navigator.pop();
    }
  }

  replace(route) {
    this._prepareRoute(route);
    this.navigator.replace(route);
  }

  /**
   * pop到第一个场景
   */
  popToTop() {
    this.navigator.popToTop();
  }

  replaceAtIndex(route, index) {
    this._prepareRoute(route);
    this.navigator.replaceAtIndex(route, index);
  }

  replacePrevious(route) {
    this._prepareRoute(route);
    this.navigator.replacePrevious(route);
  }

  /**
   * 重置堆栈
   */
  resetTo(route) {
    this._prepareRoute(route);
    this.navigator.resetTo(route);
  }

  reset(routeStack) {
    this._prepareRouteStack(routeStack);
    this.navigator.immediatelyResetRouteStack(routeStack);
  }

  /**
   * 重置堆栈为 新的routeStack
   */
  resetRouteStack(routeStack) {
    this.reset(routeStack);
  }

  popToRoute(route) {
    this._prepareRoute(route);
    this.navigator.popToRoute(route);
  }

  popBack(n) {
    this.navigator.popN(n);
  }

  popById(id, include) {
    let routes = this.navigator.getCurrentRoutes();
    let i = routes.length - 1;
    for (; i >= 0; --i) {
      if (routes[i].id === id) {
        if (include) {
          if (i > 0) {
            this.navigator.popToRoute(routes[i - 1]);
          } else {
            console.warn('Cannot pop below zero');
          }
        } else {
          this.navigator.popToRoute(routes[i]);
        }
        break;
      }
    }
  }

  replacePreviousAndPop(route) {
    this._prepareRoute(route);
    this.navigator.replacePreviousAndPop(route);
  }

  updateById(id, route) {
    this._prepareRoute(route);
    //TODO
  }

  /**
   * pop 不会pop掉第一个场景， XXX 废弃这应该作为pop的默认行为
   */
  safePop() {
    this.pop();
  }

  _prepareRoute() {}

  _prepareRouteStack() {}

  getRoutes() {
    return this.navigator.getCurrentRoutes();
  }
}
