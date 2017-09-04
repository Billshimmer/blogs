'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const clientWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  innerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  gridBorderStyle: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderStyle: 'solid',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const flattenStyle = StyleSheet.flatten;

export default class GridView extends Component {

  static propTypes = {
    columns: PropTypes.number,
    whRatio: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderItem: PropTypes.func.isRequired,
    itemStyle: View.propTypes.style,
    gridBorderStyle: View.propTypes.style,
    showGridInnerBorder: PropTypes.bool,
    showGridOuterBorder: PropTypes.bool,
  };

  static defaultProps = {
    columns: 2,
    showGridInnerBorder: false,
    showGridOuterBorder: false,
  };

  constructor(props, context) {
    super(props, context);
    this._init();
    this._setItem = this._setItem.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  _init() {
    this._borderStyle = flattenStyle([styles.gridBorderStyle, this.props.gridBorderStyle]);
    this._itemStyle = {};
    this._columns = Math.max(Math.floor(this.props.columns), 1);
    let width = (clientWidth - (this._columns - 1) * (this.props.showGridInnerBorder?this._borderStyle.borderWidth : 0)) / this._columns;
    let state = {
      itemWidth: width,
    };
    this._itemStyle.width = width;
    if (this.props.whRatio && this.props.whRatio > 0) {
      state.itemHeight = width / this.props.whRatio;
      this._itemStyle.height = state.itemHeight;
    }

    this.state = state;
  }

  componentWillReceiveProps(props) {
    if (this._columns !== props.columns || this.props.whRatio !== props.whRatio) {
      let conWidth = this._columns * this.state.itemWidth;
      this._columns = Math.max(Math.floor(props.columns), 1);
      let width = (clientWidth - (this._columns - 1) * (this.props.showGridInnerBorder?this._borderStyle.borderWidth : 0)) / this._columns;
      let state = {
        itemWidth: width,
      };
      this._itemStyle.width = width;
      if (this.props.whRatio && this.props.whRatio > 0) {
        state.itemHeight = width / this.props.whRatio;
        this._itemStyle.height = state.itemHeight;
      }

      this.setState(state);
    }
  }

  _setItem(e) {
    let width = (e.nativeEvent.layout.width - (this._columns - 1) * (this.props.showGridInnerBorder?this._borderStyle.borderWidth : 0)) / this._columns;
    if (width === this.state.itemWidth || width === 0) {
      return;
    }

    let state = {
      itemWidth: width,
    };
    this._itemStyle.width = width;
    if (this.props.whRatio && this.props.whRatio > 0) {
      state.itemHeight = width / this.props.whRatio;
      this._itemStyle.height = state.itemHeight;
    }

    this.setState(state);
  }

  _renderItem(item, i) {
    i++; //keep index the same as position
    let itemEle = this.props.renderItem ? this.props.renderItem(item) : null;
    let isRowEnd = (i % this._columns == 0 || i === this.props.items.length) ? true : false;
    let isLastRow = (
      (
        Math.ceil(i / this._columns) == Math.ceil(this.props.items.length / this._columns)
        && i % this._columns > 0
      ) || i == this.props.items.length || this.props.items.length <= this._columns
    ) ? true : false;
    let borderStyle = {
      borderColor: this._borderStyle.borderColor,
      borderStyle: this._borderStyle.borderStyle,
    };
    let itemTemp = {
      width: this._itemStyle.width,
    };
    if (this._itemStyle.height) {
      itemTemp.height = this._itemStyle.height;
    }

    if (this.props.showGridInnerBorder) {
      if (!isRowEnd) {
        borderStyle.borderRightWidth = this._borderStyle.borderWidth;
        itemTemp.width += this._borderStyle.borderWidth;
      }

      if(!isLastRow) {
        borderStyle.borderBottomWidth = this._borderStyle.borderWidth;
        if (itemTemp.height) {
          itemTemp.height += this._borderStyle.borderWidth;
        }
      }
    }

    let itemStyle = {...this._itemStyle, ...itemTemp};
    return (
      <View
        style={[styles.item, this.props.itemStyle, itemStyle, borderStyle]}
        key={i}>
        {itemEle}
      </View>
    );
  }

  render() {
    if (!this.props.items || !this.props.items instanceof Array) {
      return null;
    }

    let items = this.props.items.map((item, i) => {
      return this._renderItem(item, i);
    });
    return (
      <View
        style={[styles.innerContainer, this.props.style]}
        onLayout={this._setItem}>
        {items}
      </View>
    );
  }
}
