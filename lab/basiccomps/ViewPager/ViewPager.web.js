'use strict';

import React, {
  Component,
  PropTypes,
  Children,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  CSSClassNames,
  RWPerformance,
} from 'react-native';

import { VisibleController } from 'lab4/core/VisibleManager';
import SceneComponent from './SceneComponent';

export default class ViewPager extends Component {

  static propTypes = {
    tabBarPosition: PropTypes.oneOf(['top', 'bottom', 'overlayTop', 'overlayBottom', ]),
    initialPage: PropTypes.number,
    // 默认页面 后续修改会改变page
    defaultPage: PropTypes.number,
    page: PropTypes.number,
    onChangeTab: PropTypes.func,
    onScroll: PropTypes.func,
    renderTabBar: PropTypes.any,
    style: View.propTypes.style,
    contentProps: PropTypes.object,
    /**
     * 最大渲染的页面数
     * <= 0 会渲染所有打开过的
     */
    maxPageCount: PropTypes.number,
  };

  static defaultProps = {
    tabBarPosition: 'top',
    initialPage: 0,
    onChangeTab: () => {},
    maxPageCount: RWPerformance.level > RWPerformance.MEDIUM ? -1 : 3,
  };

  static contextTypes = {
    visibleManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    const currentPage = props.page || props.defaultPage || props.initialPage || 0;
    this.state = {
      currentPage,
    };

    //用于记录page是否打开过的map
    this._pageOpenMap = Object.create(null);

    this._visibleController = new VisibleController(context.visibleManager);

    this.goToPage = this.goToPage.bind(this);
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
      const prevKey = this._getChildKeyByIndex(prevState.currentPage);
      this._visibleController.emit(prevKey, 'willHide');
      this._visibleController.emit(prevKey, 'didHide');
      const currentKey = this._getChildKeyByIndex(this.state.currentPage);
      this._visibleController.emit(currentKey, 'willShow');
      this._visibleController.emit(currentKey, 'didShow');
    }
  }

  setCurrentPage(pageNumber) {
    this.props.onChangeTab && this.props.onChangeTab({ i: pageNumber});
    this.setState({currentPage: pageNumber, });
  }

  goToPage(pageNumber) {
    this.setCurrentPage(pageNumber);
  }

  _getChildKey(child, idx) {
    return child.key || 'p_' + idx;
  }

  _getChildKeyByIndex(index) {
    let childKey;
    Children.forEach(this.props.children, (child, idx) => {
      if (index === idx) {
        childKey = this._getChildKey(child, idx);
      }
    });
    return childKey;
  }

  renderTabBar(props) {
    if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(), props);
    }
    return null;
  }

  renderContent() {
    let childCount = React.Children.count(this.props.children);
    let renderStartIndex = 0;
    let renderEndIndex = childCount;
    let currentIndex = this.state.currentPage;
    let maxPageCount = this.props.maxPageCount;
    if (maxPageCount > 0) {
      renderStartIndex = Math.max(currentIndex - ((maxPageCount / 2) << 0), 0);
      renderEndIndex = renderStartIndex + maxPageCount;
    }

    let pageOpenMap = this._pageOpenMap;
    let newPageOpenMap = Object.create(null);
    this._pageOpenMap = newPageOpenMap;
    return React.Children.map(this.props.children, (child, i) => {
      let isCurrent = i === currentIndex;
      let key = this._getChildKey(child, i);
      if((i >= renderStartIndex && i <= renderEndIndex) && (isCurrent || pageOpenMap[key])) {
        newPageOpenMap[key] = true;
      } else {
        child = null;
      }
      return (
        <SceneComponent
          key={key}
          childKey={key}
          controller={this._visibleController}
          viewPager={this}
        >
          <View
            className={!isCurrent ? CSSClassNames.HIDE : null}
            style={styles.childWrapper}>
            {child}
          </View>
        </SceneComponent>
      );
    });
  }

  render() {
    let overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');
    let tabs = [];
    React.Children.forEach(this.props.children, (child) => tabs.push(child.props.tabLabel));
    let tabBarProps = {
      goToPage: this.goToPage,
      tabs,
      activeTab: this.state.currentPage,
    };
    if (overlayTabs) {
      tabBarProps.style = {
        position: 'absolute',
        left: 0,
        right: 0,
        [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0
      };
    }
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps)}
        <View
          style={styles.content}>
          {this.renderContent()}
        </View>
        {(this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
  },
  childWrapper: StyleSheet.absoluteFillObject,
});
