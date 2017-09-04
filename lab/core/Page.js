'use strict';
import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LABContext from './LABContext';
import EventEmitter from './emitter/EventEmitter';
import EventConstants from './EventConstants';
import BaseComponentMixin from './BaseComponentMixin';
import RouteUtils from './RouteUtils';
import axios from './axios';
import CommonStyle from './CommonStyle';
import requireComp from './lab/requireComp';
import { hasOwnProp } from '../utils';
import StatusView from './StatusView';
import LABError from './LABError';

let PageStatusView;
let Scroll;

const PageStatus = StatusView.Status;

let loadId = 0;

/**
 * 页面基类
 * renderHeader 重写以绘制头部，若返回的最外层Element带有 overlayHeader 属性，则头部悬浮于内容上方
 * renderContent 重写以实现绘制内容
 * renderPageStatusView 已默认实现的绘制页面状态区域
 * 一般子类不需要重写render，如需实现特殊页面布局，则需在render 中调用renderPageStatusView
 * 
 * TODO route改变?
 */
export default class Page extends LABContext {
  static propTypes = {
    window: PropTypes.object,
    pageContainer: PropTypes.object,
    route: PropTypes.object,
    overlayHeader: PropTypes.bool,
    // content 处于ScrollView中
    scrollable: PropTypes.bool,
    // content 处于ScrollView中，且开启下拉刷新
    refreshable: PropTypes.bool,
    // 是否在componentDidMount之后自动开始加载数据,是否自动加载不仅仅有这个变量确定
    autoLoad: PropTypes.bool,
    // 是否默认静默loadPageData  loadPageData本身的参数可覆盖这一配置
    quietLoad: PropTypes.bool,
    // 传递给Page自带的Scroll的属性
    contentScrollProps: PropTypes.object,
    // 传递给PageStatusView的属性
    pageStatusViewProps: PropTypes.object,
    // PageStatusView是否覆盖整个页面 默认值覆盖content 与 footer
    pageStatusViewFillPage: PropTypes.bool,
  };

  static defaultProps = {
    autoLoad: true,
  };

  static contextTypes = {
    application: PropTypes.object,
    router: PropTypes.object,
    popup: PropTypes.object,
    appPopup: PropTypes.object,
    page: PropTypes.any,
    visibleManager: PropTypes.object,
  };

  static childContextTypes = {
    labContext: PropTypes.object,
    page: PropTypes.object,
    emitter: PropTypes.object,
    pageEmitter: PropTypes.object,
  };

  static Status = PageStatus;

  constructor(props, context) {
    super(props, context);

    if (__DEV__) {
      if (!props || !context) {
        throw new Error('调用Page构造函数时必须传入props和context');
      }
    }

    if (!PageStatusView) {
      PageStatusView = requireComp('com.PageStatusView');
      Scroll = requireComp('com.Scroll');
    }

    //Page内部使用的state
    this._pageState = {
      autoLoad: props.autoLoad,
      scrollable: props.scrollable,
      refreshable: props.refreshable,
      quietLoad: props.quietLoad,
      status: PageStatus.NORMAL,
    };
    this._initEmitter();
    this._initVisibleEvent(context.visibleManager);
    this._childContext = {
      labContext: this,
      page: this,
      emitter: this._emitter,
      pageEmitter: this._emitter,
    };
    this.isLoadingPageData = false;

    this._setPageStatusViewRef = pageStatusView => {
      this._pageStatusView = pageStatusView;
    };
    this._setContentScrollRef = scroll => {
      this._contentScroll = scroll;
    };

    if (__DEV__) {
      if (!this.constructor.__staticChecked) {
        this.constructor.__staticChecked = true;

        // 检查子类继承重写方法时是否调用了父类对应的方法
        const proto = this.constructor.prototype;
        const that = this;
        const checkSuperCall = function(funcName) {
          if (proto.hasOwnProperty(funcName)) {
            if (proto[funcName].toString().indexOf("'" + funcName + "'") < 0) {
              console.warn(
                'Page的子类重写' + funcName + '时必须调用父类的方法!!!',
                that.constructor.name,
                __BROWSER__ && that
              );
            }
          }
        };
        checkSuperCall('componentDidMount');
        checkSuperCall('componentWillReceiveProps');
        checkSuperCall('componentWillUnmount');

        // 检查contextTypes
        let contextTypes = this.constructor.contextTypes;
        if (
          !contextTypes ||
          !contextTypes.router ||
          !contextTypes.popup ||
          !contextTypes.page ||
          !contextTypes.visibleManager
        ) {
          console.warn(
            'Page子类的contextTypes需要包含父类的 ...Parent.contextTypes',
            that.constructor.name
          );
        }
      }
    }
  }

  _initEmitter() {
    this._emitter = new EventEmitter();
  }

  _initVisibleEvent(visibleManager) {
    // 兼容原来的focus blur事件
    if (this.componentWillFocus) {
      visibleManager.on('willShow', this.componentWillFocus, this);
      this.__registedVisibleEvent = true;
    }
    if (this.componentDidFocus) {
      visibleManager.on('didShow', this.componentDidFocus, this);
      this.__registedVisibleEvent = true;
    }
    if (this.componentWillBlur) {
      visibleManager.on('willHide', this.componentWillBlur, this);
      this.__registedVisibleEvent = true;
    }
    if (this.componentDidBlur) {
      visibleManager.on('didHide', this.componentDidBlur, this);
      this.__registedVisibleEvent = true;
    }
  }

  getChildContext() {
    return this._childContext;
  }

  componentDidMount() {
    if (
      this._pageState.autoLoad &&
      this.url &&
      (!this.props.pageContainer || !this.props.pageContainer.isDataLoaded()) &&
      (!this.props.route || !this.props.route.routeConfig.isStaticTpl)
    ) {
      //XXX 是否为静态模板在这里判断是否合适?
      this.loadPageData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scrollable !== this.props.scrollable) {
      this._pageState.scrollable = nextProps.scrollable;
    }
    if (nextProps.refreshable !== this.props.refreshable) {
      this._pageState.refreshable = nextProps.refreshable;
    }
    if (nextProps.quietLoad !== this.props.quietLoad) {
      this._pageState.quietLoad = nextProps.quietLoad;
    }
  }

  componentWillUnmount() {
    if (this._lastLoadPagePromise) {
      this._lastLoadPagePromise.cancel();
      this._lastLoadPagePromise = null;
    }
    if (this.__registedVisibleEvent) {
      this.context.visibleManager.offByTag(this);
    }
    if (__DEV__) {
      //检查emitter是否发生内存泄漏
      this._emitter.offByTag(this);
      setTimeout(() => {
        this._emitter.debugTraverseAll(evt => {
          console.warn(
            'Page emitter 内存泄漏!!!',
            this.constructor.name,
            __BROWSER__ && evt
          );
        }, 5);
      });
    } else {
      this._emitter.removeAllListeners();
    }
  }

  isMounted() {
    // React.Component 中已经废弃了isMounted 并通过defineProperty设置使其不可写
    // TODO React内部使用的方式  接口可能会变
    return this.updater.isMounted(this);
  }

  get url() {
    if (this.__url != null) {
      return this.__url;
    }
    return this.props.route && this.props.route.url;
  }

  /**
   * 设置页面的url 覆盖route的url设置
   */
  set url(url) {
    this.__url = url;
  }

  get router() {
    return this.context.router;
  }

  //页面内的事件总线
  get emitter() {
    return this._emitter;
  }

  get pageEmitter() {
    return this._emitter;
  }

  /**
   * 获取父页面
   */
  getParent() {
    return this.context.page;
  }

  getRoute() {
    return this.props.route;
  }

  /**
   * 配置页面，最好在构造函数中完成配置
   * 支持配置的属性:
   * {
   *   autoLoad: bool,
   *   quietLoad: bool,
   *   scrollable: bool,
   *   refreshable: bool,
   *   style, //用于配置页面容器的样式(优先级最高)， 一般可用于设置背景颜色
   * }
   * NOTE: 如果page外部传入的属性有变，在componentWillReceiveProps之后会覆盖之前的配置
   */
  configPage(config) {
    let needUpdate;
    for (let key in config) {
      if (hasOwnProp(config, key)) {
        this._pageState[key] = config[key];
        if (key !== 'autoLoad' && key !== 'quietLoad') {
          needUpdate = true;
        }
      }
    }
    if (needUpdate && this.isMounted()) {
      this.forceUpdate();
    }
  }

  getPageState() {
    return this._pageState;
  }

  isLoading() {
    return this.isLoadingPageData;
  }

  showLoading(options) {
    this.updatePageStatusView(PageStatus.LOADING, options);
  }

  /**
   * 如果当前处于loading 则隐藏 并切换到NORMAL
   */
  hideLoading() {
    if (this._pageState.status === PageStatus.LOADING) {
      this.updatePageStatusView(PageStatus.NORMAL);
    }
  }

  showError(options) {
    this.updatePageStatusView(PageStatus.ERROR, options);
  }

  showEmpty(options) {
    this.updatePageStatusView(PageStatus.EMPTY, options);
  }

  showContent() {
    this.updatePageStatusView(PageStatusView.NORMAL);
  }

  updatePageStatusView(status, options) {
    this._pageState.status = status;
    this._pageState.statusOptions = options;
    if (this._pageStatusView) {
      this._pageStatusView.update(status, options);
    }
  }

  getPageStatusView() {
    return this._pageStatusView;
  }

  getPageContainer() {
    return this.props.pageContainer;
  }

  forceReload() {
    if (__DEV__) {
      console.warn('不建议使用,请使用loadPageData代替,将在2.3版本删除此函数');
    }
    this.props.pageContainer && this.props.pageContainer.forceReload();
  }

  /**
   * 设置页面的主scroll
   */
  setPageMainScroll(scroll) {
    // TODO 防止一个页面有多个PageMainScroll
    this._pageMainScroll = scroll;
  }

  unsetPageMainScroll(scroll) {
    if (this._pageMainScroll === scroll) {
      this._pageMainScroll = null;
    }
  }

  /**
   * 刷新页面
   * 由pageMainScroll 调用
   * @param refreshOptions
   * @return true 处理了刷新页面 false 其他情况
   */
  scrollRefreshPage(refreshOptions) {
    if (!this.isMounted()) {
      if (__DEV__) {
        console.warn('scrollRefreshPage !isMounted');
      }
      return false;
    }
    if (this.isLoadingPageData) {
      return false;
    }
    this.loadPageData({
      isRefresh: true,
      showLoading: false,
      showError: false,
      refreshOptions,
    });
    return true;
  }

  /**
   * 加载页面数据
   * @param options: Object | Boolean
   * {
   *   isRefresh: Boolean, //是否为刷新页面(下拉刷新)
   *   showLoading: Boolean, //加载过程是否显示loading
   *   showError: Boolean, //加载失败是否显示error
   *   reloadType: Number, // 当前有正在进行的加载时 决定如果处理新的加载 0: 强制重新加载取消上一次加载(默认) 1: 不进行新的加载 TODO 需要判断加载条件是否改变(url 等)
   *   loadOptions, // 传递给底层加载模块的参数(一般为http模块)
   * }
   * 为Boolean 时 true 代表完全静默 TODO 废弃
   * 
   * @return Promise: {response, error} 没有reject 状态
   */
  loadPageData(options) {
    if (!this.isMounted()) {
      if (__DEV__) {
        console.warn('loadPageData !this.isMounted()');
      }
      return Promise.resolve({ error: new Error('!isMounted') });
    }
    if (!this.url) {
      if (__DEV__) {
        throw new Error('page url不存在');
      }
      return Promise.resolve({ error: new Error('!url') });
    }

    if (options === true) {
      options = {
        showLoading: false,
        showError: false,
      };
    }
    options = {
      showLoading: !this._pageState.quietLoad,
      // TODO ignoreLoadError 配置应该放在Page 上
      showError: !(
        this.props.route && this.props.route.routeConfig.ignoreLoadError
      ),
      ...options,
    };
    options.loadId = ++loadId;
    options.url = this.url;
    options.oriOptions = arguments[0];

    if (this.isLoadingPageData) {
      if (options.reloadType === 1) {
        return Promise.resolve(this._lastLoadPromise);
      }
      if (this._lastLoadPromise) {
        this._lastLoadPromise.cancel();
        this._lastLoadPromise = null;
      } else if (__DEV__) {
        console.warn('isLoadingPageData _lastLoadPromise == null');
      }
    }

    this.isLoadingPageData = true;

    if (options.showLoading) {
      this.showLoading();
    }
    this._onloadStart(options);
    const result = {};
    let loadPromise = this._lastLoadPromise = this.doLoadPageData(options)
      .then(
        response => {
          result.response = response;
          if (this.isMounted()) {
            this.onLoadResponse(response, options);
          } else if (__DEV__) {
            console.warn('loadPageData then !isMounted', this.url);
          }
          return result;
        },
        error => {
          result.error = error;
          if (this.isMounted()) {
            this.onLoadError(error, options);
            if (options.showError && !error.isErrorProcessed) {
              this.showLoadPageDataError(error, options);
            }
          }
          return result;
        }
      )
    .finally(() => {
      if (loadPromise === this._lastLoadPromise) {
        this.isLoadingPageData = false;
        this._lastLoadPromise = null;
        if (this.isMounted()) {
          if (options.showLoading) {
            this.hideLoading();
          }
        }
      }
      if (this.isMounted()) {
        this._onLoadComplete(result.error, result.response, options);
      }
    });

    if (__DEV__) {
      // 用于将未处理的错误抛出 方便调试
      loadPromise.done();
    }

    return loadPromise;
  }

  /**
   * 执行加载页面数据
   * 可通过重写实现不同的加载方式(如加载本地数据库)
   * 默认使用axios 加载服务端数据
   */
  doLoadPageData(options) {
    return axios(options.url, {
      timeout: 40000, // 默认40s 超时
      ...options.loadOptions,
    }).then(response => {
      if (!this.isMounted()) {
        return;
      }
      return this.handlePageAPIResponse(response, options);
    });
  }

  /**
   * 显示loadPageData error
   */
  showLoadPageDataError(error, loadOptions) {
    this.showError({
      message: error.isAPIError && error.message,
      error,
      refreshCallback: this.loadPageData.bind(this, loadOptions.oriOptions),
    });
  }

  /**
   * 验证结果数据是否有效
   */
  validateLoadResponse(response) {
    return response.CODE
      ? response.CODE === 'ok'
      : !!response.ui_type && response.ui_type !== 'com.Message';
  }

  _onloadStart(options) {
    if (options.isRefresh && this._pageMainScroll) {
      this._pageMainScroll.pageRefreshStart(options.refreshOptions);
    }
    this.onLoadStart(options);
  }

  /**
   * 页面加载开始
   * @param options loadPageData参数
   */
  onLoadStart(options) {}

  /**
   * 页面加载成功
   */
  onLoadResponse(response, options) {}

  /**
   * 页面加载失败
   */
  onLoadError(error, options) {}

  _onLoadComplete(error, response, options) {
    if (options.isRefresh && this._pageMainScroll) {
      this._pageMainScroll.pageRefreshComplete(options.refreshOptions);
    }
    this.onLoadComplete(error, response, options);
  }

  /**
   * 页面加载结束
   * 请求被取消也会调用 此时error response都为空
   */
  onLoadComplete(error, response, options) {}

  /**
   * 处理页面接口数据
   * @return Promise 接口数据错误则返回reject
   * 
   * XXX 需要在考虑设计一下
   * // TODO 新的后端api规范
   */
  handlePageAPIResponse(response, options) {
    const isSuccess = this.validateLoadResponse(response);
    if (!isSuccess) {
      const error = new LABError({
        code: response.CODE,
        message: response.MESSAGE || response.message,
      });
      error.response = response;
      error.isAPIError = true; //标记error是API接口错误
      if (response.CODE === 'redirect' && response.DATA && response.DATA.href) {
        error.isErrorProcessed = true; //标记error 已被处理 不需要再showError
        //TODO 1.需要有一个跳转管理器，2.多个页面存在跳转时 重复replace问题
        //处理跳转
        //TODO 其它信息处理  处理页面在ViewPager中的情况?
        let topPage = this;
        while (topPage.getParent()) {
          topPage = topPage.getParent();
        }
        this.router.replace({
          url: response.DATA.href,
          redirect: {
            navType: 'replace',
            originalRoute: RouteUtils.cloneRoute(topPage.getRoute()),
            originalChildRoute: topPage === this
              ? null
              : RouteUtils.cloneRoute(this.getRoute()),
          },
        });
      }
      return Promise.reject(error);
    }
    return Promise.resolve(response);
  }

  handlePageAPIError() {}

  renderHeader() {}

  /**
   * 渲染content 可能包含ScrollView
   */
  renderContentInner() {
    if (this._pageState.refreshable || this._pageState.scrollable) {
      return (
        <Scroll
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          {...this.props.contentScrollProps}
          ref={this._setContentScrollRef}
          refreshable={this._pageState.refreshable}
          bindPageRefresh={true}
          style={CommonStyle.flex1}
        >
          {this.renderContent()}
        </Scroll>
      );
    }
    return (
      <View style={CommonStyle.flex1}>
        {this.renderContent()}
      </View>
    );
  }

  renderContent() {}

  renderFooter() {}

  renderPageStatusView() {
    return (
      <PageStatusView
        {...this.props.pageStatusViewProps}
        ref={this._setPageStatusViewRef}
        initialStatus={this._pageState.status}
        initialOptions={this._pageState.statusOptions}
        page={this}
        style={[CommonStyle.absoluteFill, this.getStyle('pageStatusView')]}
      />
    );
  }

  render() {
    const props = this.props;
    let header = this.renderHeader();
    let overlayHeader;
    if (header) {
      overlayHeader = header.props.overlayHeader;
      if (overlayHeader == null) {
        overlayHeader = props.overlayHeader;
      }
      if (overlayHeader) {
        header = React.cloneElement(header, {
          style: [header.props.style, styles.overlayHeader],
        });
      }
    }
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: Theme.pageBackgroundColor,
          },
          this.getStyle('container'),
          props.style,
          this._pageState.style,
        ]}
      >
        {!overlayHeader && header}
        <View style={styles.pageContent}>
          {this.renderContentInner()}
          {this.renderFooter()}
          {!props.pageStatusViewFillPage && this.renderPageStatusView()}
        </View>
        {overlayHeader && header}
        {props.pageStatusViewFillPage && this.renderPageStatusView()}
      </View>
    );
  }
}

BaseComponentMixin(Page.prototype);

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: Theme.pageBackgroundColor,
  // },
  pageContent: {
    flex: 1,
    overflow: 'hidden',
  },
  // contentWrapper: {
  //   flex: 1,
  // },
  // header: {
  // },
  overlayHeader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
});
