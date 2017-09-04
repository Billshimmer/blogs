'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, ListView } from 'react-native';
import LAB, { EventConstants, requireComp, axios } from 'lab4';
import invisibleStyle from 'lab4/utils/invisibleStyle';
import SimpleLRUStore from 'lab4/utils/SimpleLRUStore';
import URI from 'urijs';

const Touchable = requireComp('com.Touchable');

export default class SearchContentController extends LAB.Component {
  static propTypes = {
    showHistory: PropTypes.bool, //是否显示搜索历史
    list: PropTypes.object, //搜索结果列表
    baseUrl: PropTypes.string.isRequired, //搜索接口地址
    queryTextKey: PropTypes.string, //搜搜文本的key
    allowNullKey: PropTypes.bool, //是否允许空关键字
    defaultSearchText: PropTypes.string,
    defaultCondition: PropTypes.object,
    historyKey: PropTypes.string.isRequired,
    maxHistorySize: PropTypes.number,
  };

  static defaultProps = {
    showHistory: true,
    maxHistorySize: 10,
  };

  static contextTypes = {
    emitter: PropTypes.object,
    page: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    let condition = { ...props.defaultCondition };
    let searchText = props.defaultSearchText || '';
    let searchUrl = this._buildSearchUrl(searchText, condition);

    this._emptyHistoryDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      showType: 'list', // history list
      historyList: null,
      historyDataSource: this._emptyHistoryDataSource,
      searchText,
      condition,
      searchUrl,
      searchResult: null,
    };

    this._renderHistoryRow = this._renderHistoryRow.bind(this);
    this._renderHistoryFooter = this._renderHistoryFooter.bind(this);
    this._refreshHistory = this._refreshHistory.bind(this);
  }

  componentWillMount() {
    this.state.searchUrl = this._buildSearchUrl(
      this.state.searchText,
      this.state.condidion
    );
  }

  componentDidMount() {
    if (this.props.showHistory) {
      SimpleLRUStore.getAll(this.props.historyKey).then(historyList => {
        if (historyList.length && !this.state.searchText) {
          this.setState({
            showType: 'history',
          });
        }
        this._refreshHistory(historyList);
      });
    }
    this.emitter.on(
      EventConstants.SEARCH_TEXT_CHANGE,
      this._searchTextChange,
      this
    );
    this.emitter.on(EventConstants.SEARCH_SUBMIT, this._searchSubmit, this);
    this.emitter.on(
      EventConstants.FILTER_CONDITION_CHANGE,
      this._filterConditionChange,
      this
    );
  }

  componentWillUnmount() {
    this.emitter.offByTag(this);
  }

  _refreshHistory(historyList) {
    if (this.state.showType == 'history') {
      this.setState({
        historyList,
        historyDataSource: this.state.historyDataSource.cloneWithRows(
          historyList
        ),
      });
    } else {
      this.state.historyList = historyList;
      this.state.historyDataSource = this.state.historyDataSource.cloneWithRows(
        historyList
      );
    }
  }

  //根据搜索关键字与过滤条件生成url
  _buildSearchUrl(text, condition) {
    return URI(this.props.baseUrl)
      .setQuery({
        [this.props.queryTextKey]: text,
        ...condition,
      })
      .toString();
  }

  _searchTextChange(e, text) {
    if (
      !text &&
      this.state.showType != 'history' &&
      !this.props.allowNullKey &&
      this.state.historyList
    ) {
      //搜索内容为空时显示搜索历史
      this.setState({
        showType: 'history',
      });
    }
  }

  _searchSubmit(e, text) {
    if (!text && !this.props.allowNullKey) {
      return;
    }
    this._doSearch(text, this.state.condidion);
  }

  _filterConditionChange(e, condition) {
    condition = Object.assign(this.state.condidion, condidion);
    this._doSearch(text, condition);
  }

  _doSearch(searchText, condition) {
    let searchUrl = this._buildSearchUrl(searchText, condition);
    this.setState({
      searchText,
      condition,
      searchUrl,
      showType: 'list',
    });
    //保存搜索历史
    if (searchText) {
      SimpleLRUStore.save(
        this.props.historyKey,
        searchText,
        this.props.maxHistorySize
      ).then(newHisList => {
        this._refreshHistory(newHisList);
      });
    }
    //TODO 取消上一次请求
    axios(searchUrl).then(
      data => {
        if (searchUrl != this.state.searchUrl) {
          return;
        }
        this.setState({
          showType: 'list',
          searchResult: data,
        });
      },
      error => {
        if (__DEV__) console.log('_doSearch error:', error);
        // if(searchUrl != this.state.searchUrl) {
        //   return;
        // }
      }
    );
  }

  _onHistoryPress(text) {
    this.setState({
      showType: 'list',
    });
    this.emitter.emit(EventConstants.SEARCH_SET_TEXT, this, text);
    this.emitter.emit(EventConstants.SEARCH_SUBMIT, this, text);
  }

  _onClearHistoryPress() {
    this.setState({
      historyList: null,
      historyDataSource: this._emptyHistoryDataSource,
    });
    SimpleLRUStore.clear(this.props.historyKey);
  }

  _renderHistoryRow(rowData, sectionID, rowID) {
    return (
      <Touchable
        style={styles.historyRow}
        onPress={() => {
          this._onHistoryPress(rowData);
        }}
      >
        <Text>{rowData}</Text>
      </Touchable>
    );
  }

  _renderHistoryFooter() {
    if (!this.state.historyList || !this.state.historyList.length) {
      return;
    }
    return (
      <Touchable
        style={styles.clearHistoryBtn}
        onPress={() => {
          this._onClearHistoryPress();
        }}
      >
        <Text>清除搜索历史</Text>
      </Touchable>
    );
  }

  _renderHistory() {
    if (!this.props.showHistory) {
      return null;
    }
    let pointerEvents, ivStyle;
    if (this.state.showType != 'history') {
      pointerEvents = 'none';
      ivStyle = invisibleStyle;
    }
    return (
      <ListView
        pointerEvents={pointerEvents}
        style={[styles.historyContainer, ivStyle]}
        dataSource={this.state.historyDataSource}
        renderRow={this._renderHistoryRow}
        renderFooter={this._renderHistoryFooter}
      />
    );
  }

  _renderList() {
    const props = {
      url: this.state.searchUrl,
      autoLoad: false,
      bindPageRefresh: false,
      style: { flex: 1 },
    };
    if (this.state.searchResult) {
      props.defaultItems = this.state.searchResult.items;
      props.defaultNextUrl = this.state.searchResult.nextUrl;
      props.url = this.state.searchResult.url;
    }
    return (
      <View style={styles.listContainerStyle}>
        {LAB.render(this.props.list, props)}
      </View>
    );
  }

  render() {
    return (
      <View style={[this.getStyle('container')]}>
        {this._renderList()}
        {this._renderHistory()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainerStyle: {
    flex: 1,
  },
  historyContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  historyRow: {
    padding: 5,
  },
  clearHistoryBtn: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
