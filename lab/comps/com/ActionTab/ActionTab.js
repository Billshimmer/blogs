'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Text,
  Image,
  Platform,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const ViewPager = requireComp('com.ViewPager');
const IconImageButton = requireComp('com.IconImageButton');

const flattenStyle = StyleSheet.flatten;
const { width, height } = Dimensions.get('window');

/**
 * 一个带有动画的 TabBar，选中 tab 会放大。用在 E途
 * 
 * @export
 * @class ActionTab
 * @extends {LAB.Component}
 */
export default class ActionTab extends LAB.Component {
  static propTypes = {
    tabData: PropTypes.array,
    initialPage: PropTypes.number,
    activeOpacity: PropTypes.number,
    multiple: PropTypes.number, //选中状态下内容放大倍数
    showText: PropTypes.bool,
  };
  static defaultProps = {
    showText: false,
    multiple: 1.3,
    activeOpacity: 0.8,
    tabData: [],
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      widthWindow: null,
      widthItem: null,
      blockWidth: 0,
      curTab: this.props.initialPage || 0,
      animated: [],
    };
    this.defaultStyles = styles;
    this.getWidthWindow = this.getWidthWindow.bind(this);
    this.getWidthItem = this.getWidthItem.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);

    this.state.widthItem = flattenStyle(this.getStyle('itemContainer')).width;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tabData.length != this.props.tabData.length) {
      let nextCurTab = nextProps.initialPage || 0;
      let newAnimated = nextProps.tabData.map((item, i) => {
        return i === nextCurTab
          ? new Animated.Value(nextProps.multiple)
          : new Animated.Value(1);
      });
      this.setState({
        curTab: nextCurTab,
        animated: newAnimated,
      });
      // this.goToPage(nextCurTab);
      this.refs.scroll.scrollTo({
        x: this.state.widthItem * nextCurTab,
        y: 0,
        animated: false,
      });
      this.props.onChange && this.props.onChange(nextCurTab);
    }
  }

  componentWillMount() {
    this.props.tabData.map((item, i) => {
      i === this.state.curTab
        ? this.state.animated.push(new Animated.Value(this.props.multiple))
        : this.state.animated.push(new Animated.Value(1));
    });
  }

  componentDidMount() {
    this.goToPage(this.state.curTab);
  }

  render() {
    return (
      <View onLayout={this.getWidthWindow} style={this.getStyle('container')}>
        <ScrollView
          ref="scroll"
          horizontal={true}
          onScrollEndDrag={this.onScrollEndDrag}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          style={this.getStyle('scrollView')}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: this.state.blockWidth == 0
                ? (width - this.state.widthItem) / 2
                : this.state.blockWidth,
            }}
          />
          {this.props.tabData.map((item, i) => {
            return (
              <Touchable
                key={i}
                activeOpacity={this.props.activeOpacity}
                onPress={() => {
                  this.goToPage(i);
                }}
                onLayout={this.getWidthItem}
                style={this.getStyle('itemContainer')}
              >
                <Animated.View
                  style={[
                    this.getStyle('image'),
                    {
                      transform: [
                        {
                          scaleX: this.state.animated[i],
                        },
                        {
                          scaleY: this.state.animated[i],
                        },
                      ],
                    },
                  ]}
                >
                  <Image
                    style={{ flex: 1 }}
                    source={{
                      uri: i === this.state.curTab
                        ? item.activeImage
                        : item.image,
                    }}
                  />
                </Animated.View>
              </Touchable>
            );
          })}
          <View
            style={{
              width: this.state.blockWidth == 0
                ? (width - this.state.widthItem) / 2
                : this.state.blockWidth,
            }}
          />
        </ScrollView>
        {this.props.showText
          ? <Text style={this.getStyle('actionText')}>
              {this.props.tabData[this.state.curTab] &&
                this.props.tabData[this.state.curTab].text}
            </Text>
          : null}
      </View>
    );
  }

  onScroll(e) {
    let temp = e.nativeEvent.contentOffset.x >= 0
      ? e.nativeEvent.contentOffset.x / this.state.widthItem + 0.5
      : e.nativeEvent.contentOffset.x / this.state.widthItem - 0.5;

    let curTab = temp >> 0;
    if (curTab > this.props.tabData.length - 1) {
      curTab = this.props.tabData.length - 1;
    } else if (curTab < 0) {
      curTab = 0;
    }

    let newTab = e.nativeEvent.contentOffset.x >= 0
      ? ((e.nativeEvent.contentOffset.x / this.state.widthItem) >> 0) + 1
      : 0;

    this.setState({ curTab: curTab });
    if (newTab < this.props.tabData.length && newTab > 0) {
      this.state.animated[newTab].setValue(
        (0.5 + temp - newTab) * (this.props.multiple - 1) + 1
      );
      this.state.animated[newTab - 1].setValue(
        (0.5 - temp + newTab) * (this.props.multiple - 1) + 1
      );
    } else if (newTab == this.props.tabData.length) {
      this.state.animated[newTab - 1].setValue(
        (0.5 - temp + newTab) * (this.props.multiple - 1) + 1
      );
    }
    this.props.tabData.map((item, i) => {
      i != newTab && i != newTab - 1 && this.state.animated[i].setValue(1);
    });
  }

  onScrollEndDrag() {
    this.goToPage(this.state.curTab);
  }

  setValue(i) {
    if (i >= 0 && i <= this.props.tabData.length) {
      // this.setState({curTab:i});
      this.refs.scroll.scrollTo({
        x: this.state.widthItem * i,
        y: 0,
        animated: true,
      });
    }
  }

  goToPage(n) {
    n > this.props.tabData.length && (n = this.props.tabData.length);
    n < 0 && (n = 0);
    this.refs.scroll.scrollTo({
      x: this.state.widthItem * n,
      y: 0,
      animated: true,
    });
    this.props.onChange && this.props.onChange(n);
    // this.state.animated[n].setValue(this.props.multiple);
  }

  getWidthWindow(e) {
    let temp = e.nativeEvent.layout.width;
    if (!this.state.widthWindow) {
      this.setState({
        widthWindow: temp,
        blockWidth: this.state.widthItem && this.state.blockWidth == 0
          ? (temp - this.state.widthItem) / 2
          : 0,
      });
    }
  }
  getWidthItem(e) {
    // let temp = e.nativeEvent.layout.width;
    // if(!this.state.widthItem){
    //   this.setState({
    //     widthItem:temp,
    //     blockWidth:this.state.widthWindow && (this.state.blockWidth == 0)?(this.state.widthWindow - temp)/2:0,
    //   });
    //
    // }
  }
}

const styles = StyleSheet.create({
  // container: {},
  scrollView: {
    flex: 0,
  },
  image: {},
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  actionText: {
    textAlign: 'center',
  },
});
