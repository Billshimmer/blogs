import React, {
  PropTypes,
  Component,
} from 'react';
import ReactNative, {
  ScrollView,
  Dimensions,
} from 'react-native';
import AbsViewPager from './AbsViewPager';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ViewPager extends AbsViewPager {

  constructor(props, context) {
    super(props, context);
    this.state.containerWidth = SCREEN_WIDTH;
    this.state.contentOffset = {
      x: this.state.containerWidth * this.state.currentPage,
    };
    this.state.sceneStyle = {
      width: this.state.containerWidth,
    };

    this._setScollViewRef = (ref) => {
      this._scrollView = ref;
    };
    this._onScroll = this._onScroll.bind(this);
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
  }

  _scrollToPage(pageNumber) {
    if (this._scrollView) {
      this._scrollView.scrollTo({x: pageNumber * this.state.containerWidth, animated: !this.props.scrollWithoutAnimation, });
      if (this.props.scrollWithoutAnimation) {
        // 没有动画时不会调用 onMomentumScrollEnd
        this._updateSelectedPage(pageNumber);
      }
    }
  }

  _getSceneStyle() {
    return this.state.sceneStyle;
  }

  _handleLayout(e) {
    const width = e.nativeEvent.layout;

    if (width && Math.round(width) !== Math.round(this.state.containerWidth)) {
      this.setState({
        containerWidth: width,
        contentOffset: {
          x: width * this.state.currentPage,
        },
        sceneStyle: {
          width,
        },
      }, () => {
        this._scrollToPage(this.state.currentPage);
      });
    }
  }

  _onScroll(e) {
    const offsetX = e.nativeEvent.contentOffset.x;
    this._updateScrollValue(offsetX / this.state.containerWidth);
  }

  _onMomentumScrollEnd(e) {
    const offsetX = e.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / this.state.containerWidth);
    this._updateSelectedPage(page);
  }

  _renderScrollableContent(scenes) {
    return (
      <ScrollView
        ref={this._setScollViewRef}
        horizontal
        pagingEnabled
        automaticallyAdjustContentInsets={false}
        contentOffset={this.state.contentOffset}
        ref={this._setScollViewRef}
        onScroll={this._onScroll}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        scrollEventThrottle={16}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!this.props.locked}
        directionalLockEnabled
        alwaysBounceVertical={false}
        keyboardDismissMode="on-drag"
        {...this.props.contentProps}
        >
        {scenes}
      </ScrollView>
    );
  }
  
}

// const styles = StyleSheet.create({

// });
