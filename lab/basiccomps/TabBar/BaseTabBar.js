'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  RWPerformance,
} from 'react-native';

import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

export default class BaseTabBar extends Component {

  constructor(props, context) {
    super(props, context);
    let activeTab = 0;
    if (props.activeTab != null) {
      activeTab = props.activeTab;
    } else if (props.defaultActiveTab != null) {
      activeTab = props.defaultActiveTab;
    }
    let scrollValue = props.scrollValue;
    if (!scrollValue) {
      scrollValue = new Animated.Value(activeTab);
    }
    if (this.onScrollValueChange) {
      this.onScrollValueChange = this.onScrollValueChange.bind(this);
      this._scrollValueListenerId = scrollValue.addListener(this.onScrollValueChange);
    }
    this.state = {
      activeTab,
      scrollValue,
      containerWidth: 0,
    };
    this.onTabPress = this.onTabPress.bind(this);
    this._onContainerLayout = this._onContainerLayout.bind(this);
  }

  static propTypes = {
    onChangeTab: PropTypes.func, //Function(index, oldIndex, tab, isPress) 当tab被选中时调用，参数当前tab index [0, count - 1]，对于props.activeTab属性改变引起的tab切换不会回调
    goToPage: PropTypes.func, //同onChangeTab 为了兼容ScrollableTabBar
    activeTab: PropTypes.number, //当前激活的tab，当给出该值时tabbar的选中状态不受自己控制
    defaultActiveTab: PropTypes.number, //默认的选中tab，默认0，当给出activeTab时该值无效
    tabs: PropTypes.array, //tab配置数组
    renderTab: PropTypes.func, //Function(tab, index, isActive, onPress) tab渲染函数
    scrollValue: PropTypes.any, //Animated.Value类型 浮点型 [0, count - 1]，正常应该为 activeTab <= value < activeTab + 1
    linePosition: PropTypes.oneOf(['top', 'bottom', 'none']),
    lineSize: PropTypes.number,
    lineColor: PropTypes.string,
    lineStyle: PropTypes.any, //控制line的样式，只能设置height backgroundColor
    toggleMode: PropTypes.bool, //允许未选中状态 index为-1 点击已选中的tab会切换到不选中
    onWillChangeTab: PropTypes.func, // Function(index, oldIndex, isPress) => boolean 在tab改变之前回调 如果返回false 则会阻止tab改变
    onTabPress: PropTypes.func,

    wrapperTouchable: PropTypes.bool, //是否给tab 包裹一个touchable 设为false 可有tab 自己渲染touchable
    autoBindTabProps: PropTypes.bool, //是否自动将tab 的props(isActive, onPress 等)给tab element
    enableLineAnimation: PropTypes.bool, //是否开启line的动画
  };

  static defaultProps = {
    linePosition: 'bottom',
    defaultActiveTab: 0,
    lineSize: 3,
    lineColor: '#2CE8F2',
    toggleMode: false,

    wrapperTouchable: true,
    autoBindTabProps: true,
    enableLineAnimation: Platform.OS === 'web' ? RWPerformance.level > RWPerformance.MEDIUM : true,
  };

  get activeTab() {
    return this.state.activeTab;
  }

  set activeTab(value) {
    this.setCurrentTab(value);
  }

  /**
   * 获取当前选中的tab index
   * 如果是toggleMode 且不存在选中项则返回-1
   */
  getCurrentTab() {
    return this.state.activeTab;
  }

  /**
   * 设置当前选中的tab
   * @param index tab index
   * @param animated 是否动画
   */
  setCurrentTab(value, animated) {
    // 在controlled情况下 也允许设置 需要外部确保下次渲染状态正确
    // if(this.props.activeTab != null) {
    //   console.warn('属性中已经设置activeTab!');
    //   return;
    // }
    let tabCount = this.props.tabs && this.props.tabs.length;
    if (!tabCount) {
      return;
    }
    if (value == this.state.activeTab) {
      return;
    }
    if (value < 0 || value >= tabCount) {
      if (this.props.toggleMode) {
        value = -1;
      } else {
        if (__DEV__) console.warn('设置activeTab超出范围 tabCount:', tabCount);
        return;
      }
    }
    let oldIndex = this.state.activeTab;
    if (this.props.onWillChangeTab) {
      if (this.props.onWillChangeTab(i, oldIndex, false) === false) {
        //阻止改变
        return;
      }
    }
    this._setActiveTab(value);
    this._callOnTabChange(value, oldIndex, false);
  }

  getScrollValue() {
    return this.state.scrollValue.__getValue();
  }

  _onContainerLayout(e) {
    let width = e.nativeEvent.layout.width;
    if (width != this.state.containerWidth) {
      this.state.containerWidth = width;
      this.forceUpdate();
      this.onContainerWidthChange && this.onContainerWidthChange(width);
    }
  }

  _setActiveTab(newActiveTab) {
    this.state.activeTab = newActiveTab;
    this.forceUpdate();
    if (this.state.scrollValue !== this.props.scrollValue) {
      this._animateScrollValue(newActiveTab);
    }
  }

  _animateScrollValue(toValue) {
    if (toValue >= 0) {
      if (this.props.linePosition !== 'none' && this.props.enableLineAnimation) {
        Animated.timing(
          this.state.scrollValue, {
            toValue: toValue,
            duration: 300
          }
        ).start();
      } else {
        this.state.scrollValue.setValue(toValue);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let isActiveTabChange = false;
    if (nextProps.activeTab != null) {
      if (this.state.activeTab != nextProps.activeTab) {
        this.state.activeTab = nextProps.activeTab;
        isActiveTabChange = true;
      }
    } else if (nextProps.defaultActiveTab != null && nextProps.defaultActiveTab != this.props.defaultActiveTab) {
      if (this.state.activeTab != nextProps.defaultActiveTab) {
        this.state.activeTab = nextProps.defaultActiveTab;
        isActiveTabChange = true;
      }
    }

    if (this.state.scrollValue !== nextProps.scrollValue) {
      let newScrollValue;
      if (nextProps.scrollValue) {
        newScrollValue = nextProps.scrollValue;
      } else if (this.state.scrollValue === this.props.scrollValue) {
        newScrollValue = new Animated.Value(this.state.activeTab);
      } else if (isActiveTabChange) {
        this._animateScrollValue(this.state.activeTab);
      }
      if (newScrollValue) {
        if (this._scrollValueListenerId) {
          this.state.scrollValue.removeListener(this._scrollValueListenerId);
          this._scrollValueListenerId = null;
        }
        if (this.onScrollValueChange) {
          this._scrollValueListenerId = newScrollValue.addListener(this.onScrollValueChange);
        }
        this.state.scrollValue = newScrollValue;
        if (this.onSetNewScrollValue) {
          this.onSetNewScrollValue(newScrollValue);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this._scrollValueListenerId) {
      this.state.scrollValue.removeListener(this._scrollValueListenerId);
    }
  }

  _callOnTabChange(i, oldIndex, isPress) {
    if (this.props.onChangeTab) {
      this.props.onChangeTab(i, oldIndex, this.props.tabs[i], isPress);
    }
    if (this.props.goToPage && i >= 0) {
      this.props.goToPage(i);
    }
  }

  onTabPress(i) {
    if (this.props.onTabPress && (this.props.onTabPress(i, this.props.tabs[i]) === false)) {
      return;
    }
    if (i === this.state.activeTab) {
      if (!this.props.toggleMode) {
        return;
      } else {
        i = -1;
      }
    }
    let oldIndex = this.state.activeTab;
    if (this.props.onWillChangeTab) {
      if (this.props.onWillChangeTab(i, oldIndex, true) === false) {
        //阻止改变
        return;
      }
    }
    if (this.props.activeTab == null) {
      this._setActiveTab(i);
    }
    this._callOnTabChange(i, oldIndex, true);
  }

  renderTabWrapper(i, tabEle, onPress) {
    return (
      <Touchable
        key={'t' + i}
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.tabContainer}
        {...this.getTabContainerProps(i)}>
        {tabEle}
      </Touchable>
    );
  }

  getTabContainerProps(i) {

  }

  renderTabs() {
    if (!this.props.tabs) {
      return null;
    }
    return this.props.tabs.map((tab, i) => {
      let isActive = i == this.state.activeTab;
      let onPress = () => {
        this.onTabPress(i);
      };
      let tabEle = this.props.renderTab && this.props.renderTab.call(null, tab, i, isActive, onPress);
      if (this.props.autoBindTabProps) {
        let extTabProps = {
          isActive,
        };
        if (!this.props.wrapperTouchable) {
          extTabProps.onPress = onPress;
          onPress = null;
        }
        tabEle = React.cloneElement(tabEle, extTabProps);
      }
      return this.renderTabWrapper(i, tabEle, onPress);
    });
  }

  renderLine(linePosition) {
    let lineStyle,
      lineOffset,
      tabCount = this.props.tabs && this.props.tabs.length,
      lineTransform;
    if(linePosition != 'none' && this.state.activeTab >= 0 && this.state.activeTab < tabCount) {
      lineOffset = this.getLineOffset();
      if(lineOffset) {
        lineTransform = [
          {translateX: lineOffset.left}
        ];
        if(lineOffset.scaleX) {
          lineTransform.push({
            scaleX: lineOffset.scaleX
          });
        }
        lineStyle = {
          position: 'absolute',
          left: 0,
          width: lineOffset.width,
          height: this.props.lineSize,
          backgroundColor: this.props.lineColor,
          transform: lineTransform,
        };
        if(linePosition == 'top') {
          lineStyle.top = 0;
        } else {
          lineStyle.bottom = 0;
        }
        return <Animated.View style={[lineStyle, this.props.lineStyle]} />;
      }
    }
    return null;
  }

  render() {
    let linePosition = this.props.linePosition,
      wrapperStyle;
    if(linePosition == 'top') {
      wrapperStyle = {
        paddingTop: this.props.lineSize
      };
    } else if(linePosition == 'bottom') {
      wrapperStyle = {
        paddingBottom: this.props.lineSize
      };
    }
    return this.renderContainer(this.props.style, wrapperStyle, styles.tabsContainer, this.renderLine(linePosition));
  }
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
