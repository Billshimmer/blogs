'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { requireComp, utils } from 'lab4';

const HeaderBarItem = requireComp('com.HeaderBarItem');

const ITEM_TYPE = PropTypes.oneOfType([PropTypes.object, PropTypes.array]);

export default class HeaderBar extends LAB.PureComponent {
  static propTypes = {
    tintColor: PropTypes.string, //背景颜色
    title: PropTypes.string,
    titleTextStyle: Text.propTypes.style,
    left: ITEM_TYPE,
    right: ITEM_TYPE,
    content: PropTypes.object,
    mainContent: PropTypes.object,
    onLeftPress: PropTypes.func,
    onRightPress: PropTypes.func,
    renderContent: PropTypes.func,
    renderLeft: PropTypes.func,
    renderCenter: PropTypes.func,
    renderRight: PropTypes.func,
    renderItem: PropTypes.func,
    renderMainContent: PropTypes.func,
    statusbarPadding: PropTypes.bool,
    itemProps: PropTypes.object, //传递给HeaderBarItem的额外属性
    style: View.propTypes.style, //可配置颜色与底线，最好不要定义高度，因为包括statusbar
    contentStyle: View.propTypes.style, //可配置content的高度
  };

  static defaultProps = {
    statusbarPadding: true,
  };

  static contextTypes = {
    page: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
  }

  render() {
    this._itemContainerStyle = this.getStyle('itemContainer');
    this._itemTextStyle = this.getStyle('itemText');
    this._itemImageStyle = this.getStyle('itemImage');
    this._itemIconStyle = this.getStyle('itemIcon');

    const barStyle = {};
    if (this.props.tintColor) {
      barStyle.backgroundColor = this.props.tintColor;
    }
    if (this.props.statusbarPadding) {
      barStyle.paddingTop = Theme.statusBarHeight; //TODO
    }
    return (
      <View style={[this.getStyle('container'), this.props.style, barStyle]}>
        {this.renderContent()}
      </View>
    );
  }

  renderContent() {
    if (this.props.renderContent) {
      return (
        <View
          style={[this.getStyle('contentContainer'), this.props.contentStyle]}
        >
          {this.props.renderContent(this)}
        </View>
      );
    }
    if (this.props.mainContent || this.props.renderMainContent) {
      return (
        <View
          style={[this.getStyle('contentContainer'), this.props.contentStyle]}
        >
          {this.renderSide(
            this.props.renderLeft,
            this.props.left,
            this.onLeftPress,
            this.getStyle('leftContainer1'),
            'l',
            'left'
          )}
          <View style={this.getStyle('mainContentContainer')}>
            {this.renderMainContent()}
          </View>
          {this.renderSide(
            this.props.renderRight,
            this.props.right,
            this.onRightPress,
            this.getStyle('rightContainer1'),
            'r',
            'right'
          )}
        </View>
      );
    }
    return (
      <View
        style={[this.getStyle('contentContainer'), this.props.contentStyle]}
      >
        {this.renderSide(
          this.props.renderLeft,
          this.props.left,
          this.onLeftPress,
          this.getStyle('leftContainer'),
          'l',
          'left'
        )}
        {this.renderCenter()}
        {this.renderSide(
          this.props.renderRight,
          this.props.right,
          this.onRightPress,
          this.getStyle('rightContainer'),
          'r',
          'right'
        )}
      </View>
    );
  }

  renderSide(renderSide, data, onPress, containerStyle, key, type) {
    if (renderSide) {
      return (
        <View key={key} style={containerStyle}>
          {renderSide(this)}
        </View>
      );
    }
    if (!data) {
      return null;
    }
    if (Array.isArray(data)) {
      if (data.length) {
        return this.renderItems(data, onPress, containerStyle, key, type);
      }
    } else {
      return this.renderItem(data, onPress, containerStyle, key, type);
    }
  }

  renderItems(items, onPress, containerStyle, key, type) {
    var itemEles = items.map((item, i) => {
      return this.renderItem(
        item,
        onPress.bind(null, i, item),
        null,
        key + i,
        type,
        i
      );
    });
    return (
      <View key={key} style={[styles.itemsContainer, containerStyle]}>
        {itemEles}
      </View>
    );
  }

  renderItem(item, onPress, containerStyle, key, type, index) {
    if (this.props.renderItem) {
      return this.props.renderItem.call(
        null,
        item,
        type,
        index,
        this.props.itemProps,
        key,
        onPress,
        containerStyle
      );
    }
    if (React.isValidElement(item) || LAB.isCompData(item)) {
      return LAB.render(item, {
        key,
        onPress,
        textStyle: this._itemTextStyle,
        imageStyle: this._itemImageStyle,
        iconStyle: this._itemIconStyle,
        style: [this._itemContainerStyle, containerStyle],
      });
    }
    return (
      <HeaderBarItem
        {...item}
        key={key}
        onPress={onPress}
        textStyle={this._itemTextStyle}
        imageStyle={this._itemImageStyle}
        iconStyle={this._itemIconStyle}
        {...this.props.itemProps}
        style={[this._itemContainerStyle, containerStyle]}
      />
    );
  }

  renderCenter() {
    if (this.props.renderCenter) {
      return this.props.renderCenter.call(null, this);
    }
    if (this.props.title) {
      return (
        <Text
          style={[this.getStyle('title'), this.props.titleTextStyle]}
          numberOfLines={1}
        >
          {this.props.title}
        </Text>
      );
    }
    return null;
  }

  renderMainContent() {
    if (this.props.renderMainContent) {
      return this.props.renderMainContent.call(null, this);
    }
    if (React.isValidElement(this.props.mainContent)) {
      return this.props.mainContent;
    }
    return LAB.render(this.props.mainContent);
  }

  onLeftPress() {
    if (this.props.onLeftPress) {
      return this.props.onLeftPress.apply(null, arguments);
    }
  }

  onRightPress() {
    if (this.props.onRightPress) {
      return this.props.onRightPress.apply(null, arguments);
    }
  }
}

const styles = StyleSheet.create({
  // container: {

  // },
  contentContainer: {
    height: Theme.headerBarHeight,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    marginLeft: 90,
    marginRight: 90,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    flex: 1,
    color: '#fff',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  leftContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  itemContainer: {
    alignSelf: 'stretch',
  },
  // 包含mainContent时的leftContainer
  leftContainer1: {
    alignSelf: 'stretch',
  },
  rightContainer1: {
    alignSelf: 'stretch',
  },
  mainContentContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
});
