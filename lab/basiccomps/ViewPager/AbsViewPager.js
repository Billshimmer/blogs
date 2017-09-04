'use strict';

import React, {
  PropTypes,
  Component,
  Children,
} from 'react';
import ReactNative, {
  Dimensions,
  View,
  Animated,
  ScrollView,
  StyleSheet,
  Platform,
  ViewPagerAndroid,
} from 'react-native';

import {
  VisibleController,
} from 'lab4/core/VisibleManager';
import SceneComponent from './SceneComponent';

export default class AbsViewPager extends Component {

  static propTypes = {
    tabBarPosition: PropTypes.oneOf(['top', 'bottom', 'overlayTop', 'overlayBottom', ]),
    // 初始页面 后续修改无效 TODO 废弃
    initialPage: PropTypes.number,
    // 默认页面 后续修改会改变page
    defaultPage: PropTypes.number,
    // controlled page TODO 是否有必要?
    page: PropTypes.number,
    /**
     * {
     *   position,
     *   from,
     * }
     * TODO 调用时是否有必要区分 是props改变引起还是内部状态改变引起的?
     */
    onChangeTab: PropTypes.func,
    onScroll: PropTypes.func,
    renderTabBar: PropTypes.any,
    /**
     * 传给content的属性 在Android上是ViewPagerAndroid
     * 在ios上是ScrollView
     */
    contentProps: PropTypes.object,
    scrollWithoutAnimation: PropTypes.bool,
    locked: PropTypes.bool,
    // 预加载的页面数
    prerenderingSiblingsNumber: PropTypes.number,
    style: View.propTypes.style,
  };

  static defaultProps = {
    tabBarPosition: 'top',
    defaultPage: 0,
    scrollWithoutAnimation: false,
    locked: false,
    prerenderingSiblingsNumber: 0,
  };

  static contextTypes = {
    visibleManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    const currentPage = props.page || props.defaultPage || props.initialPage || 0;
    this.state = {
      currentPage,
      scrollValue: new Animated.Value(currentPage),
    };

    this._renderedSceneMap = Object.create(null);
    this._visibleController = new VisibleController(context.visibleManager);

    this.setCurrentPage = this.setCurrentPage.bind(this);
  }

  componentDidMount() {
    const currentKey = this._getChildKeyByIndex(this.state.currentPage);
    this._visibleController.emit(currentKey, 'willShow');
    this._visibleController.emit(currentKey, 'didShow');
  }
  
  componentWillReceiveProps(props) {
    if (props.page != null) {
      if (props.page != this.props.page) {
        this.setCurrentPage(props.page);
      }
    } else if (props.defaultPage != this.props.defaultPage) {
      this.setCurrentPage(props.defaultPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage != this.state.currentPage) {
      this._onChangeTab(prevState.currentPage, this.state.currentPage);
    }
  }

  /**
   * 设置当前的页面
   */
  setCurrentPage(pageNumber) {
    this._scrollToPage(pageNumber);
  }

  /**
   * setCurrentPage的别名
   */
  goToPage(pageNumber) {
    return this.setCurrentPage(pageNumber);
  }

  // 检查page 附近prerenderingSiblingsNumber是否已经渲染
  _isPrerendered(page) {
    const prerenderStartIndex = page - this.props.prerenderingSiblingsNumber;
    const prerenderEndIndex = page + this.props.prerenderingSiblingsNumber;
    let isPrerendered = true;
    Children.forEach(this.props.children, (child, idx) => {
      if (idx >= prerenderStartIndex && idx <= prerenderEndIndex) {
        const key = this._getChildKey(child, idx);
        if (!this._renderedSceneMap[key] || !this._renderedSceneMap[key].props.__child_cache) {
          isPrerendered = false;
        }
      }
    });
    return isPrerendered;
  }

  _updateSelectedPage(nextPage) {
    if (nextPage != this.state.currentPage) {
      if (this.props.renderTabBar || !this._isPrerendered(nextPage)) {
        this.setState({
          currentPage: nextPage,
        });
      } else {
        const prevPage = this.state.currentPage;
        this.state.currentPage = nextPage;
        this._onChangeTab(prevPage, nextPage);
      }
    }
  }

  _updateScrollValue(value) {
    this.state.scrollValue.setValue(value);
    this.props.onScroll && this.props.onScroll(value);
  }

  _onChangeTab(prevPage, currentPage) {
    const prevKey = this._getChildKeyByIndex(prevPage);
    this._visibleController.emit(prevKey, 'willHide');
    this._visibleController.emit(prevKey, 'didHide');
    this.props.onChangeTab && this.props.onChangeTab({
      i: currentPage,
      position: currentPage,
      from: prevPage,
    });
    const currentKey = this._getChildKeyByIndex(currentPage);
    this._visibleController.emit(currentKey, 'willShow');
    this._visibleController.emit(currentKey, 'didShow');
  }

  _getContainerStyle() {
    return [styles.container, this.props.style, ];
  }

  _getChildKey(child, idx) {
    return child.key || 'p_' + idx;
  }

  _getChildKeyByIndex(index) {
    let childKey;
    Children.forEach(this.props.children, (child, idx) => {
      if (index === idx) {
        childKey = child.key;
      }
    });
    return childKey;
  }

  _getSceneStyle() {
    return null;
  }

  renderTabBar(tabBarProps) {
    if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(tabBarProps), tabBarProps);
    }
  }

  render() {
    const tabs = [];
    const newRenderedSceneMap = Object.create(null);
    const prerenderStartIndex = this.state.currentPage - this.props.prerenderingSiblingsNumber;
    const prerenderEndIndex = this.state.currentPage + this.props.prerenderingSiblingsNumber;
    const sceneStyle = this._getSceneStyle();
    const scenes = Children.map(this.props.children, (child, idx) => {
      tabs.push(child.props.tabLabel);
      const key = this._getChildKey(child, idx);

      let sceneElement = this._renderedSceneMap[key];
      let oldChild = sceneElement && sceneElement.props.__child_cache;
      let isInRenderRange = idx >= prerenderStartIndex && idx <= prerenderEndIndex;
      // console.log('render child', key, isInRenderRange, (oldChild === child));
      if (!sceneElement
        || (isInRenderRange && !oldChild)
        || oldChild !== child
        || sceneElement.props.style !== sceneStyle) {
        // console.log('render child needRefresh', key, sceneStyle);
        let needRender = oldChild || isInRenderRange;
        sceneElement = (
          <View
            key={key}
            style={sceneStyle}
            __child_cache={needRender && child}>
            {
              needRender &&
              <SceneComponent
                childKey={key}
                controller={this._visibleController}
                viewPager={this}
              >
                {child}
              </SceneComponent>
            }
            
          </View>
        );
      }
      
      newRenderedSceneMap[key] = sceneElement;
      return sceneElement;
    });
    this._renderedSceneMap = newRenderedSceneMap;

    const overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');
    const tabBarProps = {
      viewPager: this,
      goToPage: this.setCurrentPage,
      tabs,
      activeTab: this.state.currentPage,
      scrollValue: this.state.scrollValue,
    };

    if (overlayTabs) {
      tabBarProps.style = {
        position: 'absolute',
        left: 0,
        right: 0,
        [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0,
      };
    }

    return (
      <View style={this._getContainerStyle()}>
        {this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps)}
        {this._renderScrollableContent(scenes)}
        {(this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
