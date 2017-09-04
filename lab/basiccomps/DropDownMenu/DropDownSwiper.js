'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import invisibleStyle from 'lab4/utils/invisibleStyle';

function interceptTouchEvent() {
  return true;
}

export default class DropDownSwiper extends Component {

  static propTypes = {
    page: PropTypes.number, //当前显示的page
    visible: PropTypes.bool, //是否可见
    onHide: PropTypes.func,
  };

  static defaultProps = {
  };

  // static contextTypes = {
  // };

  constructor(props, context) {
    super(props, context);
    let fadeValue = new Animated.Value(props.visible ? 1 : 0);
    this.state = {
      fadeValue,
      fadeStyle: {
        opacity: fadeValue
      },
      pageConfigs: [],
      isFadeAnimating: false,
      lastAnimationPage: -1,
    };

    this._ensurePageConfigs(props.children);

    this._onMaskPress = this._onMaskPress.bind(this);
    this._renderChild = this._renderChild.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this._ensurePageConfigs(nextProps.children);
    if(nextProps.visible != this.props.visible) {
      this._startFadeAnimation(nextProps.visible);
    }
    if(nextProps.visible && (nextProps.page != this.props.page || !this.props.visible) && nextProps.page >= 0 && nextProps.page < React.Children.count(nextProps.children)) {
      this._startTranslateAnimation(nextProps.page, nextProps);
    }
  }

  componentWillUnmount() {
  }

  _ensurePageConfigs(children) {
    let newChildCount = React.Children.count(children);
    let pageConfigs = this.state.pageConfigs;
    let animationValue;
    while(pageConfigs.length > newChildCount) {
      pageConfigs.pop();
    }
    while(pageConfigs.length < newChildCount) {
      animationValue = new Animated.Value(0);
      pageConfigs.push({
        animationValue,
        animationStyle: {
          transform: [
            {translateY: animationValue}
          ]
        },
        height: 0
      });
    }
  }

  _startFadeAnimation(newVisible) {
    if(!this.state.isFadeAnimating) {
      this.setState({
        isFadeAnimating: true,
      });
    }
    Animated.timing(this.state.fadeValue, {
      toValue: newVisible ? 1 : 0,
      duration: 300,
    }).start((e) => {
      if(e.finished) {
        this.setState({
          isFadeAnimating: false
        });
      }
    });
  }

  _startTranslateAnimation(page, props = this.props) {
    let pageConfig = this.state.pageConfigs[page];
    let lastAnimationPageConfig = this.state.pageConfigs[this.state.lastAnimationPage];
    if(lastAnimationPageConfig) {
      lastAnimationPageConfig.animationValue.stopAnimation();
      this.state.lastAnimationPage = -1;
    }
    if(!pageConfig.height) {
      pageConfig.animationValue.setValue(0);
      return;
    }
    this.state.lastAnimationPage = page;
    pageConfig.animationValue.setValue(-pageConfig.height);
    Animated.timing(pageConfig.animationValue, {
      toValue: 0,
      duration: 300,
    }).start();
  }

  _onMaskPress() {
    if(this.isFadeAnimating) {
      return;
    }
    if(!this.props.visible) {
      return;
    }
    this.props.onHide.call(null);
  }

  _renderChild(child, index) {
    let wrapperStyle;
    let childPointerEvents;
    if(index == this.props.page && this.props.visible) {
      wrapperStyle = this.state.pageConfigs[index].animationStyle;
      childPointerEvents = 'auto';
    } else {
      wrapperStyle = styles.childWrapperInvisible;
      childPointerEvents = 'none';
    }
    return (
      <Animated.View
        key={index}
        onLayout={(e) => {
          //console.log('onLayout index:', index, ' layout: ', e.nativeEvent.layout);
          this.state.pageConfigs[index].height = e.nativeEvent.layout.height;
        }}
        childPointerEvents={childPointerEvents}
        onStartShouldSetResponder={interceptTouchEvent}
        style={[styles.childWrapper, wrapperStyle]}>
        {child}
      </Animated.View>
    );
  }

  render() {
    let containerPointerEvents;
    let containerInvisibleStyle;
    if(this.props.visible || this.state.isFadeAnimating) {
      containerPointerEvents = 'auto';
    } else {
      containerPointerEvents = 'none';
      containerInvisibleStyle = invisibleStyle;
    }
    return (
      <TouchableWithoutFeedback
        onPress={this._onMaskPress}>
        <Animated.View
          style={[this.props.style, styles.mask, this.state.fadeStyle, containerInvisibleStyle]}>
          {React.Children.map(this.props.children, this._renderChild)}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mask: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  childWrapper: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    top: 0,
    right: 0,
    alignItems: 'stretch',
  },
  childWrapperInvisible: {
    top: 9999999,
  },
});
