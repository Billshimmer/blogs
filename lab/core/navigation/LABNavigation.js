'use strict';

import React, {
  PropTypes,
  Component,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Animated,
  Platform,
} from 'react-native';
import NavigationTransitioner from 'react-navigation/src/views/Transitioner';
import NavigationCardStackPanResponder from 'react-navigation/src/views/CardStackPanResponder';
import NavigationStateUtils from 'react-navigation/src/StateUtils';
import NavigationPropTypes from 'react-navigation/src/PropTypes';
import { shallowEqualProps } from '../../utils';
import {
  forHorizontal as styleInterpolatorForHorizontal,
} from './LABNavigationStyleInterpolator';
import {
  VisibleController,
  VisibleManagerProvider,
} from '../VisibleManager';

const ENABLED_SCENE_PROPS = {};
const DISABLED_SCENE_PROPS = {};
if (Platform.OS === 'android') {
  ENABLED_SCENE_PROPS.style = {
    top: 0,
    bottom: 0,
  };
  DISABLED_SCENE_PROPS.style = {
    top: -100000,
    bottom: 100000,
  };
}

let routeKeyNumber = 1;

/**
 * 导航堆栈管理，基于NavigationExperimental
 * TODO _renderedSceneMap 只缓存VisibleManagerProvider和scene 不缓存外部的Animated.View,用于实现可配置的动画
 * TODO 将NavigationTransitioner改为native实现
 * 
 * 目前visibleManager 对将要unmount的scene 可能不会发送willHide didHide事件
 * 
 * 使用removeClippedSubviews降低内存消耗 只保留当前scene和前一个scene
 * ios 使用 translateX实现
 * android 使用top: -100000, bottom: 100000,实现
 */
export default class LABNavigation extends Component {
  static propTypes = {
    /**
     * Styles to apply to the container of each scene.
     */
    sceneStyle: PropTypes.any,

    /**
     * The distance from the edge of the card which gesture response can start
     * for. Defaults value is `30`.
     * 初始化之后再修改可能不会立即起作用
     */
    gestureResponseDistance: PropTypes.number,

    /**
     * Enable gestures. Default value is true.
     *
     * When disabled, transition animations will be handled natively, which
     * improves performance of the animation. In future iterations, gestures
     * will also work with native-driven animation.
     * 初始化之后再修改可能不会立即起作用
     */
    enableGestures: PropTypes.bool,

    /**
     * Function that renders the a scene for a route.
     */
    renderScene: PropTypes.func.isRequired,

    /**
     * Custom style applied to the cards stack.
     */
    style: View.propTypes.style,

    /**
     * 初始navigationState 后续修改无效
     */
    initialNavigationState: PropTypes.object,

    navigationRef: PropTypes.func,
  };

  static defaultProps = {
    enableGestures: Platform.OS === 'android' ? Platform.Version > 19 : true,
    gestureResponseDistance: 40,
  };

  constructor(props, context) {
    super(props, context);

    const navigationState = props.initialNavigationState;
    this.prepareRoutes(navigationState.routes);
    this.state = {
      navigationState,
    };

    this._visibleController = new VisibleController();
    this._renderedSceneMap = Object.create(null);
    this._sceneRefs = Object.create(null);
    this._transitionCount = 0;

    this._renderScenes = this._renderScenes.bind(this);
    this._handleStartShouldSetResponderCapture = this._handleStartShouldSetResponderCapture.bind(
      this
    );
    this._onTransitionStart = this._onTransitionStart.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onNavigateBack = this._onNavigateBack.bind(this);
  }

  componentWillMount() {
    this.props.navigationRef && this.props.navigationRef(this);
  }

  componentDidMount() {
    const activeKey = this._getActiveSceneKey();
    this._visibleController.emit(activeKey, 'willShow');
    this._visibleController.emit(activeKey, 'didShow');
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 内部统一使用forceUpdate 更新，所以不比较state
    return !shallowEqualProps(this.props, nextProps);
  }

  componentWillUnmount() {
    this.props.navigationRef && this.props.navigationRef(null);
  }
  
  render() {
    return (
      <NavigationTransitioner
        navigation={{
          state: this.state.navigationState,
        }}
        configureTransition={this._configureTransition}
        render={this._renderScenes}
        onTransitionStart={this._onTransitionStart}
        onTransitionEnd={this._onTransitionEnd}
        style={this.props.style}
      />
    );
  }

  _renderScenes(transitionProps, prevTransitionProps) {
    let newRenderedSceneMap = Object.create(null);
    let activeKey = transitionProps.scene.route.key;
    let prevActiveKey =
      prevTransitionProps && prevTransitionProps.scene.route.key;
    let beforeActiveKey;
    let beforeActiveIndex = transitionProps.scene.index - 1;
    if (beforeActiveIndex >= 0) {
      beforeActiveKey = transitionProps.scenes[beforeActiveIndex].route.key;
    }
    // console.log('_renderScenes', activeKey, prevActiveKey, beforeActiveKey, transitionProps, prevTransitionProps);
    const scenes = transitionProps.scenes.map(scene => {
      let renderedScene;
      let sceneKey = scene.route.key;
      if (sceneKey === activeKey || !this._renderedSceneMap[sceneKey]) {
        let disabledSceneStyle;
        if (
          sceneKey !== activeKey &&
          sceneKey !== prevActiveKey &&
          sceneKey !== beforeActiveKey
        ) {
          disabledSceneStyle = DISABLED_SCENE_PROPS.style;
        }
        renderedScene = this._renderScene(
          {
            ...transitionProps,
            scene,
          },
          disabledSceneStyle
        );
      } else {
        renderedScene = this._renderedSceneMap[sceneKey];
      }
      newRenderedSceneMap[sceneKey] = renderedScene;
      return renderedScene;
    });
    if (transitionProps.layout.isMeasured) {
      // 在没有measured的时候不缓存 TODO 应该根据使用的transitionProps中的属性是否改变来判断是否需要缓存
      this._renderedSceneMap = newRenderedSceneMap;
    }

    return (
      <View
        onStartShouldSetResponderCapture={
          this._handleStartShouldSetResponderCapture
        }
        removeClippedSubviews={true}
        style={styles.container}
      >
        {scenes}
      </View>
    );
  }

  _renderScene(transitionProps, sceneStyle) {
    // console.log('_renderScene', transitionProps, sceneStyle);
    // TODO 可根据配置决定每个scene的动画类型
    const animStyle = styleInterpolatorForHorizontal(
      transitionProps
    );

    // TODO 可根据配置决定每个scene手势类型
    let panHandlers = null;
    if (this.props.enableGestures) {
      const panHandlersProps = {
        ...transitionProps,
        onNavigateBack: this._onNavigateBack,
        gestureResponseDistance: this.props.gestureResponseDistance,
      };
      panHandlers = NavigationCardStackPanResponder.forHorizontal(
        panHandlersProps
      );
    }

    const sceneKey = transitionProps.scene.route.key;
    return (
      <VisibleManagerProvider
        key={sceneKey}
        childKey={sceneKey}
        controller={this._visibleController}
      >
        <Animated.View
          {...panHandlers}
          ref={ref => {
            if (ref) {
              this._sceneRefs[sceneKey] = ref;
            } else {
              delete this._sceneRefs[sceneKey];
            }
          }}
          // onLayout={(event) => {
          //   console.log('onLayout', sceneKey, event.nativeEvent.layout);
          // }}
          // testID={"xxxx" + sceneKey}
          style={[styles.scene, animStyle, this.props.sceneStyle, sceneStyle]}
        >
          {this.props.renderScene(transitionProps)}
        </Animated.View>
      </VisibleManagerProvider>
    );
  }

  _configureTransition(transitionProps, prevTransitionProps) {
    // TODO 可配置是否需要动画 如reset 就不需要 duration = 0
    const animationConfig = {
      useNativeDriver: true,
      // duration: 10000,
    };
    if (
      Math.abs(transitionProps.scene.index - prevTransitionProps.scene.index) >
      1
    ) {
      animationConfig.duration = 0;
    }
    return animationConfig;
  }

  /**
   * @return navigation 是否处于transition 过程中
   */
  isInTransition() {
    // 由于_onTransitionStart 到 _onTransitionEnd 的事件会比动画duration大不少(动画300ms 实际700左右 可能是由于useNativeDriver 时动画结束通知有延迟)
    // 所以为了防止操作无效 设置了一个350ms的判断
    let ret;
    if (!this._transitionCount) {
      ret = false;
    }
    if (this._transitionCount > 1) {
      ret = true;
    }
    ret = Date.now() - this._lastTransitionStartTime < 350;

    // console.log('isInTransition ', this._transitionCount, ret);

    return ret;
  }

  _handleStartShouldSetResponderCapture() {
    // 在transition过程中拦截全部事件
    return this.isInTransition();
  }

  _onTransitionStart(transitionProps, prevTransitionProps) {
    // this._transitionStartTime = Date.now();
    // console.log('_onTransitionStart', transitionProps, prevTransitionProps);
    this._lastTransitionStartTime = Date.now();
    if (__DEV__ && global.__BROWSER__) {
      console.log(
        'navigation-update-time:' +
          (Date.now() - this.__debugUpdateStartTime) +
          'ms',
        this._transitionCount
      );
      this.__lastStartRoute = transitionProps.scene.route;
    }
    this._transitionCount++;
    const activeKey = transitionProps.scene.route.key;
    const prevActiveKey = prevTransitionProps.scene.route.key;
    if (activeKey !== prevActiveKey) {
      if (Platform.OS === 'android') {
        this._sceneRefs[activeKey] &&
          this._sceneRefs[activeKey].setNativeProps(ENABLED_SCENE_PROPS);
      }
      this._visibleController.emit(prevActiveKey, 'willHide');
      this._visibleController.emit(activeKey, 'willShow');
    }
  }

  _onTransitionEnd(transitionProps, prevTransitionProps) {
    // console.log('_onTransitionEnd time:', (Date.now() - this._transitionStartTime), transitionProps, prevTransitionProps);
    if (__DEV__ && global.__BROWSER__) {
      if (transitionProps.progress.__getValue() !== 1) {
        console.log(
          'navigation onTransitionEnd progress !== 1',
          transitionProps
        );
      }
      if (
        this.__lastStartRoute &&
        this.__lastStartRoute !== transitionProps.scene.route
      ) {
        console.log(
          'navigation onTransitionEnd this.__lastStartRoute !== transitionProps.scene.route',
          transitionProps
        );
      }
      this.__lastStartRoute = null;
      if (this._transitionCount !== 1) {
        console.log(
          'navigation onTransitionEnd this._transitionCount !== 1',
          transitionProps,
          this._transitionCount
        );
      }
    }
    this._transitionCount--;
    const activeKey = transitionProps.scene.route.key;
    const prevActiveKey = prevTransitionProps.scene.route.key;
    if (this._transitionCount === 0 && Platform.OS === 'android') {
      let activeIndex = this.state.navigationState.index;
      let beforeActiveIndex = activeIndex - 1;
      let beforeActiveKey = beforeActiveIndex >= 0
        ? this.state.navigationState.routes[beforeActiveIndex].key
        : null;
      for (let sceneKey in this._sceneRefs) {
        this._sceneRefs[sceneKey].setNativeProps(
          sceneKey === activeKey || sceneKey === beforeActiveKey
            ? ENABLED_SCENE_PROPS
            : DISABLED_SCENE_PROPS
        );
      }
    }
    if (activeKey !== prevActiveKey) {
      this._visibleController.emit(prevActiveKey, 'didHide');
      this._visibleController.emit(activeKey, 'didShow');
    }
  }

  _getActiveSceneKey() {
    return this.state.navigationState.routes[this.state.navigationState.index]
      .key;
  }

  _onNavigateBack() {
    this.updateNavigationState(
      NavigationStateUtils.pop(this.state.navigationState)
    );
  }

  getNavigationState() {
    return this.state.navigationState;
  }

  updateNavigationState(navigationState) {
    if (this.state.navigationState !== navigationState) {
      this.state.navigationState = navigationState;
      if (__DEV__) {
        this.__debugUpdateStartTime = Date.now();
      }
      this.forceUpdate();
    }
  }

  prepareRoute(route) {
    if (!route.key) {
      route.key = String(routeKeyNumber++);
    }
  }

  prepareRoutes(routes) {
    for (let i = 0; i < routes.length; ++i) {
      this.prepareRoute(routes[i]);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scene: {
    backgroundColor: '#FFF',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    top: 0,
    elevation: 8,
  },
});
