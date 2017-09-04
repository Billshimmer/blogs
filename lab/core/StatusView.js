'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import BaseComponent from './BaseComponent';
import { shallowEqual, shallowEqualEx } from '../utils';
import LoadingView from 'lab4/basiccomps/LoadingView'
import requireComp from './lab/requireComp'

let Button;

const NORMAL = 1;
const LOADING = 2;
const ERROR = 3;
const EMPTY = 4;
const NOT_LOGIN = 5;

const Status = {
  NORMAL,
  LOADING,
  ERROR,
  EMPTY,
  NOT_LOGIN,
};

const EMPTY_OPTIONS = {};

function propEqualsFunc(prop1, prop2, key) {
  switch (key) {
    case 'initialStatus':
    case 'initialOptions':
      // 忽略initial 改变
      return true;
    case 'style':
      return shallowEqual(prop1, prop2);
    default:
      return Object.is(prop1, prop2);
  }
}

/**
 * 支持多状态切换的View
 * 扩展支持:
 * 1. 继承扩展
 * 2. props 提供renderStatus 扩展
 * 3. 静态配置 StatusView.renderStatus = xxx (继承之后需要设置在继承的View上)
 * 
 * TODO
 * 1. 动画
 * 2. 考虑作为容器 NORMAL 状态的content 作为children传入?
 */
export default class StatusView extends BaseComponent {

  static propTypes = {
    /**
     * 控制view的状态 <= 100为预留值 自定义可使用 > 100的数值
     */
    status: PropTypes.number,
    /**
     * status的其它配置项
     * {
     *   message, // loading 的文字; error 的错误信息
     *   error, // error
     *   refreshCallback, // error 时刷新按钮的回调
     *   ... // 其他状态需要的配置
     * }
     */
    options: PropTypes.object,

    /**
     * Function(status, options, StatusView): Element
     */
    renderStatus: PropTypes.func,
    
    // initial 配置项 只有首次传入起作用 后续改变忽略
    initialStatus: PropTypes.number,
    initialOptions: PropTypes.object,
  };

  static Status = Status;

  // StatusView 不通过requireComp 依赖
  static comp_name = 'com.StatusView';

  constructor(props, context) {
    super(props, context);

    if (!Button) {
      Button = requireComp('com.Button');
    }

    this.state = {
      status: props.status || props.initialStatus || NORMAL,
      options: props.options || props.initialOptions,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.status != null) {
      this.state.status = nextProps.status;
    }
    if (nextProps.options != null) {
      this.state.options = nextProps.options;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqualEx(this.props, nextProps, propEqualsFunc) || !shallowEqual(this.state, nextState);
  }

  /**
   * 更新状态
   * 必须是非control 模式
   */
  update(status, options) {
    if (this.props.status != null) {
      if (__DEV__) {
        console.warn('StatusView update props.status != null');
      }
      return;
    }
    this.state.status = status;
    this.state.options = options;
    this.forceUpdate();
  }

  renderLoading() {
    return (
      <View style={this.getStyle('loadingContainer')}>
        <LoadingView />
      </View>
    );
  }

  renderError() {
    const options = this.state.options || EMPTY_OPTIONS;
    const message = options.message || '加载失败';
    return (
      <View style={this.getStyle('errorContainer')}>
        <Text style={this.getStyle('errorText')}>{message}</Text>
        {options.refreshCallback &&
          <Button onPress={options.refreshCallback}>刷新</Button>}
      </View>
    );
  }

  renderEmpty() {

  }

  renderNotLogin() {

  }

  renderStatus() {
    const ret = this.renderStatusInner();
    if (ret) {
      return ret;
    }
    switch (this.state.status) {
      case Status.LOADING:
        return this.renderLoading();
      case Status.ERROR:
        return this.renderError();
      case Status.EMPTY:
        return this.renderEmpty();
      case Status.NOT_LOGIN:
        return this.renderNotLogin();
      default:
        return null;
    }
  }

  renderStatusInner() {
    let ret;
    if (this.props.renderStatus) {
      ret = this.props.renderStatus(this.state.status, this.state.options, this);
    }
    if (!ret && this.constructor.renderStatus) {
      ret = this.constructor.renderStatus(this.state.status, this.state.options, this);
    }
    return ret;
  }

  render() {
    const statusView = this.renderStatus();
    if (statusView) {
      return (
        <View style={this.props.style}>
          {statusView}
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
StatusView.defaultStyles = styles;
