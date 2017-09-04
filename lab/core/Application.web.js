'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Platform,
  BackAndroid,
} from 'react-native';
import LABContext from './LABContext';
import Router from './Router';
import Window from './Window';
import Popup from './Popup';
import PopupContainer from './PopupContainer';
import ToastLayer from 'lab4/basiccomps/Toast/ToastLayer';
import DI from './DI';
import HistoryNavigator from './navigation-web/HistoryNavigator';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import CommonStyle from './CommonStyle';

export default class Application extends LABContext {
  static childContextTypes = {
    labContext: PropTypes.object,
    application: PropTypes.object,
    router: PropTypes.object,
    popup: PropTypes.object,
    appPopup: PropTypes.object,
    //省略了Provider对象 由Application充当Provider,如果redux更新后有修改Provider，Application也需要同步更新
    store: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.store = props.store;
    this.router = new Router();
    this.popup = new Popup();
    this._childContext = {
      labContext: this,
      application: this,
      router: this.router,
      popup: this.popup,
      appPopup: this.popup,
      store: props.store,
    };
    this._setNavigationRef = this._setNavigationRef.bind(this);
    this._renderScene = this._renderScene.bind(this);

    this.history = createBrowserHistory();
  }

  getChildContext() {
    return this._childContext;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _setNavigationRef(navigation) {
    this.router.setNavigation(navigation);
  }

  _renderScene(route, navigator) {
    return <Window route={route} />;
  }

  render() {
    if (!this._initialRouteStack) {
      this._initialRouteStack = this.getInitialLocationRouteStack();
      if (!this._initialRouteStack) {
        this._initialRouteStack = this.getInitialRouteStack && this.getInitialRouteStack();
      }
      if (!this._initialRouteStack) {
        this._initialRouteStack = this.getInitialRoute && [this.getInitialRoute()];
      }
    }
    return (
      <View style={styles.container}>
        <HistoryNavigator
          bodyScrollMode={false}
          recordScrollPosition={false}
          {...this.navigatorProps}
          history={this.history}
          routeToLocation={this.routeToLocation}
          locationToRoute={this.locationToRoute}
          initialRouteStack={this._initialRouteStack}
          renderScene={this._renderScene}
          navigationRef={this._setNavigationRef}
          style={CommonStyle.flex1}
        />
        <PopupContainer popup={this.popup} />
        <ToastLayer />
      </View>
    );
  }

  routeToLocation(route) {
    return {
      pathname: route.url && ('#!' + route.url),
    };
  }

  locationToRoute(location) {
    if (location.hash.startsWith('#!')) {
      return {
        url: location.hash.slice(2),
      };
    }
  }

  /**
   * 根据当前浏览器url 获取routeStack,返回空表示无法从当前location解析route
   */
  getInitialLocationRouteStack() {
    const currentLocation = this.history.getCurrentLocation();
    const initialRoute = this.locationToRoute(currentLocation);
    if (initialRoute) {
      return [initialRoute];
    }
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  // navigator: { flex: 1 },
});
