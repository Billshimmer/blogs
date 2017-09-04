'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Platform,
  BackAndroid,
} from 'react-native';
import LABContext from './LABContext';
import Window from './Window';
import Popup from './Popup';
import PopupContainer from './PopupContainer';
import ToastLayer from 'lab4/basiccomps/Toast/ToastLayer';
import LABNavigation from './navigation/LABNavigation';
import Router from './Router';
import CommonStyle from './CommonStyle';
import globalEmitter from './GlobalEventEmitter';
import Parse from '../parse';
const User = Parse.User;

export default class Application extends LABContext {
  static childContextTypes = {
    labContext: PropTypes.object,
    application: PropTypes.object,
    popup: PropTypes.object,
    appPopup: PropTypes.object,
    //省略了Provider对象 由Application充当Provider,如果redux更新后有修改Provider，Application也需要同步更新
    store: PropTypes.object,
    router: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    if (Platform.OS === 'android') {
      //TODO
      //提供全局的back事件订阅机制 如果返回true 则不会执行默认的操作
      //程序在加载过程中的短暂阶段 BackAndroid未添加事件监听 此时后退会直接调用native default行为
      //BackHandler
      this._backHandlerSubscription = BackAndroid.addEventListener(
        'hardwareBackPress',
        this._hardwareBackPress.bind(this)
      );
    }

    this.router = new Router();
    this.store = props.store;
    this.popup = new Popup();
    this._childContext = {
      labContext: this,
      application: this,
      popup: this.popup,
      appPopup: this.popup,
      store: props.store,
      router: this.router,
    };
    this._setNavigationRef = this._setNavigationRef.bind(this);
    this._renderScene = this._renderScene.bind(this);

    // TODO 检测子类重写方法时是否调用了父类
  }

  getChildContext() {
    return this._childContext;
  }

  componentDidMount() {}

  componentWillUnmount() {
    // XXX 清理内存
    globalEmitter.removeAllListeners();
    User.emitter.removeAllListeners();
    if (this._backHandlerSubscription) {
      this._backHandlerSubscription.remove();
    }
  }

  _setNavigationRef(navigation) {
    this.router.setNavigation(navigation);
  }

  //android返回按键事件，默认不拦截事件，程序会退出。可重写提供其它实现
  onBack() {
    return false;
  }

  _hardwareBackPress() {
    if (this.router.navigation && this.router.navigation.isInTransition()) {
      return true;
    }
    return this.router.pop();
  }

  _renderScene(transitionProps) {
    return <Window route={transitionProps.scene.route} />;
  }

  render() {
    if (!this._initialNavigationState) {
      const initialRouteStack = (this.getInitialRouteStack &&
        this.getInitialRouteStack()) || [this.getInitialRoute()];
      this._initialNavigationState = {
        index: initialRouteStack.length - 1,
        routes: initialRouteStack,
      };
    }

    return (
      <View style={CommonStyle.flex1}>
        <LABNavigation
          {...this.navigatorProps}
          initialNavigationState={this._initialNavigationState}
          renderScene={this._renderScene}
          navigationRef={this._setNavigationRef}
          style={CommonStyle.flex1}
        />
        <PopupContainer popup={this.popup} />
        <ToastLayer />
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   navigator: { flex: 1 },
// });
