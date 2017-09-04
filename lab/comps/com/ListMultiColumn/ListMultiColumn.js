'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  View,
  Text,
  ListView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const List = LAB.requireComp('com.List');

const flattenStyle = StyleSheet.flatten;
const clientWidth = Dimensions.get('window').width;

/**
 * 自定义Adapter 实现每COLUMN_COUNT个数据合并为一行
 */
class MyAdapter extends List.BaseAdapter {
  constructor(options) {
    super(options);
    this._data = [];
    this._column = options.column;
  }

  createDataSource() {
    //自定义dataSource的创建  支持二维数组
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        if (r1 === r2) {
          return false;
        }
        if (r1.length !== r2.length) {
          return true;
        }
        for (let i = 0; i < r1.length; ++i) {
          if (r1[i] !== r2[i]) {
            return true;
          }
        }
        return false;
      },
    });
  }

  updateData(newData) {
    this._data = newData || [];
    this.dataSource = this.dataSource.cloneWithRows(
      this._combineArray(this._data)
    );
  }

  _combineArray(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i += this._column) {
      let item = [];
      let j = 0;
      for (; j < this._column && i + j < arr.length; ++j) {
        item.push(arr[i + j]);
      }
      result.push(item);
    }
    return result;
  }

  get data() {
    return this._data;
  }
}

/**
 * 一个多列的List
 * 
 * @export
 * @class ListMultiColumn
 * @extends {LAB.Component}
 */
export default class ListMultiColumn extends LAB.Component {
  static propTypes = {
    url: PropTypes.string, //第一页数据的请求 url，用于在不给出 defaultItems 或下拉刷新时请求使用
    defaultItems: PropTypes.array, //默认的第一页数据，改变时会用新数据刷新列表
    defaultNextUrl: PropTypes.string, //defaultItems 的下一页数据的 url，改变该值但不改变 defaultItems 是没有意义的
    colume: PropTypes.number, //每一行分几列
    divider: PropTypes.object,
  };

  static defaultProps = {
    column: 2,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;

    let separatorWidth = this.props.divider.width
      ? this.props.divider.width
      : 0;
    this.itemsWidth = this.props.divider
      ? (clientWidth + (this.props.column - 1) * separatorWidth) /
          this.props.column
      : clientWidth / this.props.colunm;
    this.itemNotBorderWidth = this.itemsWidth - separatorWidth; //最右侧无边框组件的宽度宽度

    this.state = {
      data: this.props.defaultItems,
      adapter: new MyAdapter(this.props),
    };

    this._renderRow = this._renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    //adapter
    // if (this.props.adapter != nextProps.adapter) {
    //   this._adapter.destroy();
    //   this._adapter = nextProps.adapter || new BaseAdapter();
    //   this._adapter.list = this;
    //   this._adapter.onRefreshComplete = this._onRefreshComplete;
    //   this._adapter.onLoadMoreComplete = this._onLoadMoreComplete;
    //
    //   // TODO adapter 具体职责 adapter 改变
    // }

    // if (this.props.dataSource != nextProps.dataSource) {
    //   this._adapter.prepareDataSource(nextProps.dataSource);
    // }
    //
    // let isControlled = !!(nextProps.dataSource || nextProps.items);
    // this._adapter.isControlled = isControlled;

    //fetchData
    // if (!nextProps.adapter && (this.props.fetchData !== nextProps.fetchData)) {
    //   this._adapter.fetchData = nextProps.fetchData;
    // }

    let isDefaultItemsChange;
    //items
    if (!nextProps.dataSource) {
      let newItems;
      if (nextProps.items) {
        if (this.props.items != nextProps.items) {
          newItems = nextProps.items;
        }
      } else if (this.props.defaultItems != nextProps.defaultItems) {
        newItems = nextProps.defaultItems || null;
        isDefaultItemsChange = true;
      }

      if (newItems !== undefined) {
        // this.state.isRefreshing = false;
        // this.state.isLoadingMore = false;
        // this.state.adapter.abortAll();
        this.state.adapter.updateData(newItems);
      }
    }

    //nextUrl
    if (nextProps.nextUrl) {
      if (this.props.nextUrl !== nextProps.nextUrl) {
        this.state.adapter.nextUrl = nextProps.nextUrl;
      }
    } else if (
      this.props.defaultNextUrl !== nextProps.defaultNextUrl ||
      isDefaultItemsChange
    ) {
      // items与nextUrl 需要同时改变，对于defaultNextUrl 在defaultItems改变时也更新 XXX
      this.state.adapter.nextUrl = nextProps.defaultNextUrl;
    }

    //url
    // if (nextProps.url && nextProps.url !== this.props.url && nextProps.autoLoad && !nextProps.bindPageRefresh) {
    //   this.forceUpdate(() => {
    //     this._onRefresh(true, REFRESH_TYPE_URL_CHANGE);
    //   });
    // }

    // this.pageScrollWillReceiveProps(nextProps);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={{ flexDirection: 'row' }}>
        {rowData.map((item, index) => {
          return (
            <View
              key={index}
              style={
                index === this.props.column - 1
                  ? { width: this.itemNotBorderWidth }
                  : {
                      width: this.itemsWidth,
                      borderColor: this.props.divider.color,
                      borderRightWidth: this.props.divider.width,
                    }
              }
            >
              {LAB.render(item)}
            </View>
          );
        })}
      </View>
    );
  }

  render() {
    let {
      url,
      defaultItems,
      defaultNextUrl,
      column,
      divider,
      ui_type,
      ...props
    } = this.props;
    return (
      <List
        ref="ListMultiColumn"
        {...props}
        url={this.props.url}
        renderRow={this._renderRow}
        adapter={this.state.adapter}
        defaultItems={this.state.data}
        //separator={this.props.separator}
        //renderHeader={this._renderHeader}
        //renderFooter={this._renderFooter}
        //renderEmpty={this._renderEmptyView}
        defaultNextUrl={this.props.defaultNextUrl}
        //renderSeparator={this._renderSeparator}
        //renderLoadMoreFooter={this._renderLoadMoreFooter}
      />
    );
  }

  scrollTo(e) {
    this.refs.ListMultiColumn.scrollTo(e);
  }
}

const styles = StyleSheet.create({});
