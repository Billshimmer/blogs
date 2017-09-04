'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, StyleSheet } from 'react-native';

// import processStoreTemplate from './processStoreTemplate';
import RouterManager from './RouterManager';
import RouteUtils from './RouteUtils';
import { shallowEqual, shallowEqualEx } from '../utils';
import TemplateManager from './lab/TemplateManager';
import render from './lab/render';
import createElement from './lab/createElement';
import requireComp from './lab/requireComp';

let CommonPage;

function propEqualsFunc(prop1, prop2, key) {
  switch (key) {
    case 'route':
      return true;
    case 'style':
      return shallowEqual(prop1, prop2);
    default:
      return Object.is(prop1, prop2);
  }
}

/**
 * Page容器，根据route 渲染对应页面
 * 可管理需请求网络才能确定Page类型的情况
 * 可实现Page整体的重新加载
 * 加载tpl
 * 数据模板中对store引用的支持
 * TODO 对Page为redux container的支持
 * TODO 对没有url comp tpl的展示错误页面
 *
 * 页面数据预留字段
 * {
 *   _has_localdata, 标记数据中是否有需要本地替换的模板语法, 目前支持{sotre.xxx}
 *   //标记是否为静态模板 不需要网络请求
 * }
 */
export default class PageContainer extends Component {
  // static propTypes = {
  //   route: PropTypes.object,
  // };
  static contextTypes = {
    store: PropTypes.object,
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    RouterManager.prepareRouteConfig(props.route);
    const data = this._getInitData(props);
    this.state = {
      data,
      isDataLoaded: !!props.route.compData,
      //数据是否来自changeData 对于不使用平台数据构建的页面，这个参数没有意义
      pageKey: 0,
    };

    this._setPageRef = this._setPageRef.bind(this);
    // this._handleStoreChange = this._handleStoreChange.bind(this);

    if (!CommonPage) {
      CommonPage = requireComp('com.CommonPage');
    }
  }

  componentWillMount() {
    this._configStore(this.state.data);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.route !== nextProps.route) {
      RouterManager.prepareRouteConfig(nextProps.route);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 本类中更新state一律使用forceUpdate 不会调用shouldComponentUpdate 所以不需要比较state
    if (this.props === nextProps) {
      return false;
    }
    const routeCompareRet = RouteUtils.compareRoute(
      this.props.route,
      nextProps.route
    );
    if (routeCompareRet !== RouteUtils.ROUTE_EQUAL) {
      if (routeCompareRet === RouteUtils.ROUTE_UNEQUAL) {
        // route的重要信息有变，重置状态
        const data = this._getInitData(nextProps);
        this._configStore(data);
        this.state.data = data;
        this.state.isDataLoaded = false;
        // TODO 废弃pageKey 应该直接用route.key route.id 组成key 需要清理那些无法处理componentWillReceiveProps的组件
        this.state.pageKey++;
      }
      return true;
    }

    return !shallowEqualEx(this.props, nextProps, propEqualsFunc);
  }

  // componentWillUnmount() {
  //   this._tryUnsubscribeStore();
  // }

  _configStore(data) {
    if (__DEV__) {
      if (data && data._has_localdata) {
        console.warn('平台模板引用本地store功能已禁用!!!');
      }
    }

    //使用_has_localdata 变量标记data中是否有store或者其它需要本地处理的模板数据
    //目前只支持store
    // if (!data || !data._has_localdata) {
    //   this._currentSubStores = null;
    //   this._tryUnsubscribeStore();
    //   return;
    // }
    // let store = this.context.store;
    // let subStoreNameSet = processStoreTemplate(data, store);
    // this._currentSubStores = Object.create(null);
    // let subStoreName;
    // let needSubscribe = false;
    // for (subStoreName in subStoreNameSet) {
    //   needSubscribe = true;
    //   this._currentSubStores[subStoreName] = store[subStoreName];
    // }
    // if (needSubscribe) {
    //   this._unsubscribeStore = store.subscribe(this._handleStoreChange);
    // } else {
    //   this._tryUnsubscribeStore();
    // }
  }

  // _tryUnsubscribeStore() {
  //   if (this._unsubscribeStore) {
  //     this._unsubscribeStore();
  //     this._unsubscribeStore = null;
  //   }
  // }

  // _handleStoreChange() {
  //   const storeState = this.context.store.getState();
  //   let needUpdate = false;
  //   for (let subStoreName in this._currentSubStores) {
  //     if (this._currentSubStores[subStoreName] !== storeState[subStoreName]) {
  //       this._currentSubStores[subStoreName] = storeState[subStoreName];
  //       needUpdate = true;
  //     }
  //   }
  //   if (needUpdate) {
  //     this.forceUpdate();
  //   }
  // }

  //获取页面的初始数据(模板)
  _getInitData(props) {
    const route = props.route;
    if (!route || route.comp || route.routeConfig.comp) {
      // 如果配置了comp 则不需要模板
      return null;
    }

    // route 自带数据
    if (route.compData) {
      return route.compData;
    }

    const tpl = route.tpl || route.routeConfig.tpl;
    let data;
    if (tpl) {
      //TODO 开发过程中可配置不使用模板
      data = TemplateManager.getTpl(tpl);
      if (__DEV__ && !data) {
        console.warn('未找到模板 tpl:', tpl, 'route:', route);
      }
    }
    if (!data && route.url != null) {
      // 存在url 的才有必要获取默认tpl
      data = TemplateManager.getDefaultTpl();
    }
    return data;
  }

  _setPageRef(page) {
    this._page = page;
  }

  get page() {
    return this._page;
  }

  isDataLoaded() {
    return this.state.isDataLoaded;
  }

  /**
   * 更新页面数据
   */
  changeData(data) {
    this._configStore(data);
    this.state.data = data;
    this.state.isDataLoaded = true;
    this.forceUpdate();
  }

  /**
   * 通过更改key的方式使原来的page无效 实现页面重新加载
   * 不推荐使用
   */
  forceReload() {
    const data = this._getInitData(this.props);
    this._configStore(data);
    this.state.data = data;
    this.state.isDataLoaded = false;
    this.state.pageKey = this.state.pageKey + 1;
    this.forceUpdate();
  }

  render() {
    const route = this.props.route;
    const pageProps = {
      ...(route && route.passProps),
      ...this.props,
      key: this.state.pageKey,
      ref: this._setPageRef,
      pageContainer: this,
    };
    delete pageProps.ui_type;
    if (this.state.data) {
      return render(this.state.data, pageProps);
    }
    if (route) {
      const comp = route.comp || route.routeConfig.comp;
      if (comp) {
        return createElement(comp, pageProps);
      }
      if (route.url != null) {
        return <CommonPage {...pageProps} />;
      }
    }
    // 目前对于非法route(无url tpl comp compData) 渲染空白View
    return <View style={this.props.style} />;
  }
}
