'use strict';

import React from 'react';
import DI from './DI';
import configureStore from '../redux/configureStore';
import initLABStore from '../redux/initLABStore'
import NotificationManager from 'lab4/apis/NotificationManager';

/**
 * 启动App
 * @param options: {
 *   app, //继承自Application的组件
 *   load: Function(store), //程序启动之前执行的函数，需返回Promise
 *   store, //store
 *   reducers, //redux reducers 对象 当提供store时忽略
 *   labStoreConfig: { //配置lab内置store的初始化
 *     user: Boolean, //是否需要user
 *   },
 * }
 * @return 返回根节点组件的函数
 */
export default function bootstrap(options) {
  // console.time('xxxx');
  // console.time('xxxx1');
  const App = options.app;
  if (__DEV__) {
    if (!App) {
      throw new Error('必须提供App参数!');
    }
  }

  //初始化store
  let store = options.store;
  if (!store) {
    store = configureStore(options.reducers);
  }
  DI.setStore(store);
  if (__DEV__ && !!window.navigator.userAgent) {
    //方便浏览器调试环境
    window.store = store;
  }

  //加载数据 TODO 将结果传给App组件?
  let loadPromise = Promise.all([
    options.load &&
      options.load(store).catch(error => {
        if (__DEV__) console.warn('bootstrap load error:', error);
        // XXX load失败该如何处理?
      }),
    // TODO 可配置不需要user 初始化
    // TODO 当store由外部提供时如何处理?
    initLABStore(store, options.labStoreConfig),
    // 加载初始通知,使得之后可同步获取
    NotificationManager.getInitialNotification(),
  ]);
  if (__DEV__) {
    loadPromise.catch(error => {
      console.warn('bootstrap loadPromise error', error);
    });
  }
  loadPromise.finally(() => {
    loadPromise = null; //表示加载结束
  });

  return function getComponentFunc() {
    return class LABRoot extends React.Component {
      constructor() {
        super();
        //console.timeEnd('xxxx');
        this.state = { isLoading: !!loadPromise };
        if (loadPromise) {
          loadPromise.finally(() => {
            //console.timeEnd('xxxx1');
            this.state.isLoading = false;
            this.forceUpdate();
          });
        }
      }

      render() {
        if (this.state.isLoading) {
          return null;
        }
        return (
          <App
            {...this.props}
            //由native传入的props
            store={store}
          />
        );
      }
    };
  };
}
