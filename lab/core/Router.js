'use strict';

import NavigationStateUtils from 'react-navigation/src/StateUtils';

/**
 * 路由堆栈控制
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
 *   key 唯一区分一个route 一般不需要给出 会自动生成唯一值
 *   compData: object, //平台数据
 * 
 *   //navigator 控制相关 如configScene等 TODO
 *
 *   routeConfig: Object, //根据路由规则获取的路由配置 由框架添加
 *   params: Array, //根据路由规则匹配到的url的参数 由框架添加
 *
 *   TODO 其他参数 如 sceneConfig
 * }
 * ```
 */
export default class Router {
  constructor(navigation) {
    this.navigation = navigation;
  }

  setNavigation(navigation) {
    this.navigation = navigation;
  }

  /**
   * 用于代替push 默认行为会检查是否已存在相同的route 并选择是push还是...
   * XXX 暂时只检查url
   * TODO
   */
  navigate(route) {
    this.push(route);
  }

  push(route) {
    if (!__DEV__ && !this.navigation) return;
    this.navigation.prepareRoute(route);
    this.navigation.updateNavigationState(
      NavigationStateUtils.push(this.navigation.getNavigationState(), route)
    );
  }

  pop() {
    if (!__DEV__ && !this.navigation) return true;
    let curState = this.navigation.getNavigationState();
    let nextState = NavigationStateUtils.pop(curState);
    if (curState !== nextState) {
      this.navigation.updateNavigationState(nextState);
      return true;
    }
    return false;
  }

  replace(route) {
    if (!__DEV__ && !this.navigation) return;
    this.navigation.prepareRoute(route);
    let curState = this.navigation.getNavigationState();
    this.navigation.updateNavigationState(
      NavigationStateUtils.replaceAtIndex(
        curState,
        curState.routes.length - 1,
        route
      )
    );
  }

  /**
   * pop到第一个场景
   */
  popToTop() {
    if (!__DEV__ && !this.navigation) return;
    let curState = this.navigation.getNavigationState();
    if (curState.routes.length < 2) {
      return;
    }
    this.navigation.updateNavigationState({
      index: 0,
      routes: curState.routes.slice(0, 1),
    });
  }

  replaceAtIndex(route, index) {
    if (!__DEV__ && !this.navigation) return;
    let curState = this.navigation.getNavigationState();
    if (index < 0 || curState.routes.length <= index) {
      if (__DEV__) {
        console.warn(
          'replaceAtIndex index < 0 || curState.routes.length <= index',
          index
        );
      }
      return;
    }
    this.navigation.prepareRoute(route);
    let routes = curState.routes.slice();
    routes[index] = route;
    this.navigation.updateNavigationState({
      index: curState.index,
      routes,
    });
  }

  /**
   * 替换上一个
   */
  replacePrevious(route) {
    if (!__DEV__ && !this.navigation) return;
    this.replaceAtIndex(route, this.navigation.getNavigationState().index - 1);
  }

  /**
   * 重置堆栈到单个route
   */
  resetTo(route) {
    if (!__DEV__ && !this.navigation) return;
    this.navigation.prepareRoute(route);
    this.navigation.updateNavigationState({
      index: 0,
      routes: [route],
    });
  }

  /**
   * 重置堆栈
   */
  reset(routes) {
    if (!__DEV__ && !this.navigation) return;
    this.navigation.prepareRoutes(routes);
    this.navigation.updateNavigationState({
      index: routes.length - 1,
      routes,
    });
  }

  /**
   * 重置堆栈
   * @DEPRECATED 使用reset代替
   */
  resetRouteStack(routes) {
    if (__DEV__) {
      if (!this._resetRouteStackWarned) {
        this._resetRouteStackWarned = true;
        console.warn('resetRouteStack 已废弃 请使用router.reset()代替');
      }
    }

    this.reset(routes);
  }

  popToRoute(route) {
    if (!__DEV__ && !this.navigation) return;
    let curState = this.navigation.getNavigationState();
    let index = curState.routes.indexOf(route);
    if (index < 0) {
      if (__DEV__) {
        console.warn('popToRoute route不存在!');
      }
      return;
    }
    this.navigation.updateNavigationState({
      index,
      routes: curState.routes.slice(0, index + 1),
    });
  }

  popBack(n) {
    if (!__DEV__ && !this.navigation) return;
    let curState = this.navigation.getNavigationState();
    let index = curState.routes.length - 1 - n;
    if (index < 0) {
      if (__DEV__) {
        console.warn('popBack index < 0 index:', index, 'n:', n);
      }
      return;
    }
    this.navigation.updateNavigationState({
      index,
      routes: curState.routes.slice(0, index + 1),
    });
  }

  popById(id, include) {
    if (!__DEV__ && !this.navigation) return;
    let curState = this.navigation.getNavigationState();
    let routes = curState.routes;
    let i = routes.length - 1;
    for (; i >= 0; --i) {
      if (routes[i].id === id) {
        if (include) {
          --i;
        }
        break;
      }
    }
    if (i < 0) {
      if (__DEV__) {
        console.warn('popById id not found', id);
      }
      return;
    }
    this.navigation.updateNavigationState({
      index: i,
      routes: routes.slice(0, i + 1),
    });
  }

  replacePreviousAndPop(route) {
    if (!__DEV__ && !this.navigation) return;
    let curState = this.navigation.getNavigationState();
    let routes = curState.routes;
    if (routes.length < 2) {
      console.warn('replacePreviousAndPop routes.lenght < 2');
      return;
    }
    this.navigation.prepareRoute(route);
    let index = routes.length - 2;
    routes = routes.slice(0, index + 1);
    routes[index] = route;
    this.navigation.updateNavigationState({
      index,
      routes,
    });
  }

  /**
   * pop 不会pop掉第一个场景， XXX 废弃这应该作为pop的默认行为
   */
  safePop() {
    if (__DEV__) {
      if (!this._safePopWarned) {
        this._safePopWarned = true;
        console.warn('safePop 已经废弃，请使用router.pop()代替');
      }
    }
    this.pop();
  }

  getRoutes() {
    if (!__DEV__ && !this.navigation) return [];
    return this.navigation.getNavigationState().routes;
  }
}
