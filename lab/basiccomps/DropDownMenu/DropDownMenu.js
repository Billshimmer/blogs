'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

export default class DropDownMenu extends Component {

  static propTypes = {
    levelData: PropTypes.array.isRequired,
    levels: PropTypes.number,
    renderItem: PropTypes.func,
    onSelect: PropTypes.func,
    menuHeight: PropTypes.number,
    menuStyle: PropTypes.shape({
      normalBackground: PropTypes.arrayOf(View.propTypes.style),
      selectedBackground: PropTypes.arrayOf(View.propTypes.style),
      normalFont: PropTypes.arrayOf(Text.propTypes.style),
      selectedFont: PropTypes.arrayOf(Text.propTypes.style),
      normalArrow: PropTypes.arrayOf(View.propTypes.style),
      selectedArrow: PropTypes.arrayOf(View.propTypes.style),
    }),
    levelWeights: PropTypes.arrayOf(PropTypes.number),
    intialIndex: PropTypes.array,
  };

  static defaultProps = {
    levels: 1,
    levelWeights: [],
    menuStyle: {
      normalBackground: [],
      selectedBackground: [],
      normalFont: [],
      selectedFont: [],
      normalArrow: [],
      selectedArrow: [],
    }
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      levelIndexs: [],
      selectedIndexs: [],
    };
    this._scrollHeight = [];
    this._innerContainerHeight = [];
    this._scrollPosition = [];
    this._pressItem = this._pressItem.bind(this);
    this._scroll = this._scroll.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderLevel = this._renderLevel.bind(this);
    this._renderSelectedMenu = this._renderSelectedMenu.bind(this);
    this._getIntialSelectedIndex = this._getIntialSelectedIndex.bind(this);
    this._menuStyle = {
      normalBackground: (props.menuStyle && props.menuStyle.normalBackground) || [],
      selectedBackground: (props.menuStyle && props.menuStyle.selectedBackground) || [],
      normalFont: (props.menuStyle && props.menuStyle.normalFont) || [],
      selectedFont: (props.menuStyle && props.menuStyle.selectedFont) || [],
      normalArrow: (props.menuStyle && props.menuStyle.normalArrow) || [],
      selectedArrow: (props.menuStyle && props.menuStyle.selectedArrow) || [],
    };
  }

  componentWillMount() {
    let levelIndexs = [];
    let selectedIndexs = this._getIntialSelectedIndex();
    for (let index = 0; index < this.props.levels; index++) {
      levelIndexs[index] = selectedIndexs[index] || 0;
      selectedIndexs[index] = selectedIndexs[index] || 0;
      this._scrollPosition[index] = 0;
      this.props.levelWeights[index] = this.props.levelWeights[index] || 1;
    }
    this.setState({
      levelIndexs: levelIndexs,
      selectedIndexs: selectedIndexs,
    });
  }

  _getIntialSelectedIndex() {
    let selectedIndexs = [];
    if (this.props.intialIndex) {
      let levelData = this.props.levelData;
      for (let i = 0; i < this.props.intialIndex.length; i++) {
        if (typeof this.props.intialIndex[i] === 'string') {
          for (let j = 0; j < levelData.length; j++) {
            if (levelData[j] && levelData[j].content && levelData[j].content
              === this.props.intialIndex[i]) {
                selectedIndexs[i] = j;
                break;
            } else if (j == levelData.length - 1) {
              selectedIndexs[i] = 0;
            }
          }
        } else if (typeof this.props.intialIndex[i] === 'number') {
          selectedIndexs[i] = Math.max(this.props.intialIndex[i], 0);
        } else {
          selectedIndexs[i] = 0;
        }
        levelData = levelData[selectedIndexs[i]] && levelData[selectedIndexs[i]].children;
      }
    }
    return selectedIndexs;
  }

  _pressItem(data, level, index) {
    let levelIndexs = this.state.levelIndexs;
    let selectedIndexs = this.state.selectedIndexs;
    levelIndexs[level] = index;
    for (let len = level + 1; len < levelIndexs.length; len++) {
      levelIndexs[len] = -1;
    }
    if (!data.children.length) {
      for (let i = level + 1; i < selectedIndexs.length; i++) {
        selectedIndexs[i] = -1;
        this._scrollPosition[i] = 0;
      }
      selectedIndexs[level] = index;
      let levelData = this.props.levelData;
      for(let j = 0; j <= level; j++) {
        if (j != level) {
          selectedIndexs[j] = levelIndexs[j];
        }
        let scrollPositionMax = Math.max(this._innerContainerHeight[j] - this._scrollHeight[j], 0);
        //scroll item to center
        this._scrollPosition[j] = Math.min(Math.max((selectedIndexs[j] / levelData.length)
          * this._innerContainerHeight[j] - (this._scrollHeight[j] / 2) +
          (this._innerContainerHeight[j] / levelData.length / 2), 0), scrollPositionMax);
        levelData = levelData[selectedIndexs[j]].children || [];
      }
      this.props.onSelect && this.props.onSelect(data, this.state.levelIndexs, this.state.selectedIndexs);
    }

    this.setState({
      levelIndexs: levelIndexs,
      selectedIndexs: selectedIndexs,
    });
  }

  _scroll() {
    this._renderSelectedMenu();
    for (let i = 0; i < this.state.selectedIndexs.length; i++) {
      this.refs["sv_" + i].scrollTo({y: this._scrollPosition[i], animated: false});
    }
  }

  _setScrollHeight(e, level) {
    this._scrollHeight[level] = e.nativeEvent.layout.height;
  }

  _setInnerContainerHeight(e, level) {
    this._innerContainerHeight[level] = e.nativeEvent.layout.height;
  }

  _renderSelectedMenu() {
    let levelIndexs = this.state.levelIndexs;
    for (let i = 0; i < this.state.selectedIndexs.length; i++) {
      levelIndexs[i] = this.state.selectedIndexs[i];
    }
    this.forceUpdate();
  }

  _renderItem(data, level, isSelect, hasChildren) {
    if (this.props.renderItem) return this.props.renderItem(data, level, isSelect, hasChildren);
    if (!data.content) {
      if (__DEV__) console.log('content is undefined');
      return;
    }
    let menuStyle = this._menuStyle;
    let arrow = hasChildren ? isSelect ? <View style={[styles.arrow, menuStyle.selectedArrow[level]]}></View>
    : <View style={[styles.arrow, menuStyle.normalArrow[level]]}></View> : null;
    if (isSelect) {
      return (
        <View style={[styles.itemContainer, styles.selectedBackground, menuStyle.selectedBackground[level]]}>
          <Text style={[styles.selectedFont, menuStyle.selectedFont[level]]}>{data.content}</Text>
          {arrow}
        </View>
      );
    }
    return (
      <View style={[styles.itemContainer]}>
        <Text style={[styles.normalFont, menuStyle.normalFont[level]]}>{data.content}</Text>
        {arrow}
      </View>
    );
  }

  _renderLevel(data, level) {
    let items = data.map((value, i) => {
      let isSelect = this.state.levelIndexs[level] == i ? true : false;
      let hasChildren = value.children instanceof Array && value.children.length ? true : false;
      let item = this._renderItem(value, level, isSelect, hasChildren);
      return (
        <Touchable
          onPress={() => {this._pressItem(value, level, i);}}
          key={i}>
          {item}
        </Touchable>
      );
    });
    let menuStyle = this._menuStyle;
    return (
      <View style={[styles.normalBackground, {flex: this.props.levelWeights[level]}, menuStyle.normalBackground[level]]}
        key={level}>
        <ScrollView
          ref={"sv_" + level}
          onLayout={(e) => {this._setScrollHeight(e, level);}}
          >
          <View ref={"v_" + level}
            onLayout={(e) => {this._setInnerContainerHeight(e, level);}}
            style={{flexDirection: 'column', alignItems: 'stretch'}}>
            {items}
          </View>
        </ScrollView>
      </View>
    );
  }

  render() {
    let levels = [];
    let levelData = this.props.levelData;
    for (let i = 0; i < this.props.levels; i++) {
      if (i > 0 ) {
        levelData = levelData[this.state.levelIndexs[i - 1]] &&
                    levelData[this.state.levelIndexs[i - 1]].children ?
                    levelData[this.state.levelIndexs[i - 1]].children : [];
      }
      let level = this._renderLevel(levelData, i);
      levels.push(level);
    }
    let containerStyle;
    if (this.props.menuHeight) {
      containerStyle = {height: this.props.menuHeight};
    }
    return (
      <View style={[styles.container, containerStyle]}>
        {levels}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5fa'
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#E4E5E6',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  normalBackground: {
    backgroundColor: '#F9F9F9',
  },
  selectedBackground: {
    backgroundColor: '#FFFFFF',
  },
  normalFont: {
    color: '#4D4D4D',
  },
  selectedFont: {
    color: '#0080FF',
  },
  arrow: {
    width: 8,
    height: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    transform: [{rotateZ: '-45deg'}]
  }
});
