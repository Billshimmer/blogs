import React, {
  PropTypes,
  Component,
} from 'react';
import ReactNative, {
  ViewPagerAndroid,
  StyleSheet,
} from 'react-native';
import AbsViewPager from './AbsViewPager';

export default class ViewPager extends AbsViewPager {

  constructor(props, context) {
    super(props, context);

    this._onPageScroll = this._onPageScroll.bind(this);
    this._onPageSelected = this._onPageSelected.bind(this);
    this._setPagerRef = (ref) => {
      this._viewPager = ref;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.state.currentPage != 0) {
      this._viewPager.setPageWithoutAnimation(this.state.currentPage);
    }
  }

  _scrollToPage(pageNumber) {
    if (this._viewPager) {
      // setPage不会调用onPageSelected
      this._updateSelectedPage(pageNumber);
      if (this.props.scrollWithoutAnimation) {
        this._viewPager.setPageWithoutAnimation(pageNumber);
      } else {
        this._viewPager.setPage(pageNumber);
      }
    }
  }

  _onPageScroll(event) {
    this._updateScrollValue(event.nativeEvent.position + event.nativeEvent.offset);
  }

  _onPageSelected(event) {
    this._updateSelectedPage(event.nativeEvent.position);
  }

  _renderScrollableContent(scenes) {
    return (
      <ViewPagerAndroid
        {...this.props.contentProps}
        ref={this._setPagerRef}
        onPageScroll={this._onPageScroll}
        onPageSelected={this._onPageSelected}
        scrollEnabled={!this.props.locked}
        style={styles.viewPager}
        children={scenes}
      >
      </ViewPagerAndroid>
    );
  }
  
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});
