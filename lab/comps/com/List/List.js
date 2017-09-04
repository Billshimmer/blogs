'use strict';

import React, { PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ListView,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';

import LAB, { requireComp, utils } from 'lab4';

import BaseAdapter from './BaseAdapter';
import httpFetch from './httpFetch';
import ListViewMixin from 'lab4/basiccomps/ListView/ListViewMixin';
import RefreshControlConfig from 'lab4/basiccomps/RefreshControlConfig';
import PageScrollExt from 'lab4/basiccomps/PageScrollExt';

const LoadMoreListFooter = requireComp('com.LoadMoreListFooter');

//刷新类型
//手动触发 下拉刷新
const REFRESH_TYPE_MANUAL = 1;
//页面触发
const REFRESH_TYPE_PAGE = 2;
//首次加载
const REFRESH_TYPE_FIRST_LOAD = 3;
//url 改变
const REFRESH_TYPE_URL_CHANGE = 4;
//调用refresh函数
const REFRESH_TYPE_CALL = 5;

/**
 * ListView
 * 
 * TODO
 * unmount 之后取消请求 不依赖于isMounted()
 * 单选多选支持
 * 加载失败处理 StatusView LoadMoreListFooter
 * isRefreshing isLoadingMore 是否需要controlled
 * 订阅adapter事件? notifyDatasetChanged
 * adapter 支持标记为需要更新 List shouldComponentUpdate 时会考虑该值
 */
export default class List extends LAB.PureComponent {
  static BaseAdapter = BaseAdapter;
  static httpFetch = httpFetch;

  static propTypes = {
    /**
     * 设置dataSource之后 会忽略items与defaultItems
     */
    dataSource: PropTypes.object,
    items: PropTypes.any,
    /**
     * 第一页数据的请求url，用于首次加载与下拉刷新
     * url不一定代表一个网址 也可以是页码等 这取决于fetchData的实现
     */
    url: PropTypes.string,
    /**
     * items的下一页数据的url, 为空表示没有下一页
     */
    nextUrl: PropTypes.string,

    defaultItems: PropTypes.any,
    defaultNextUrl: PropTypes.string,

    // isRefreshing: PropTypes.bool, //是否处于下拉刷新 XXX
    // isLoadingMore: PropTypes.bool, //是否处于加载更多 XXX

    /**
     * 数据适配器
     */
    adapter: PropTypes.object,

    /**
     * 加载数据
     * (options) => Promise: data
     * options: {
     *   url,
     *   type, //'load': 首次加载 'loadMore': 加载更多 'refresh': 下拉刷新
     * }
     * Promise
     * resolve
     * 默认需要的数据格式
     * {
     *   items, //
     *   nextUrl,
     * }
     * reject
     * Error
     */
    fetchData: PropTypes.func,

    /**
     * 开始刷新
     * () => bool
     * return: false 不阻止默认行为 其他 阻止默认行为 TODO
     */
    onRefresh: PropTypes.func,
    onEndReached: PropTypes.func,
    /**
     * 开始加载更多
     * () => bool
     * return: false 不阻止默认行为 其他 阻止默认行为
     */
    onLoadMore: PropTypes.func, //开始加载更多

    /**
     * 刷新 首次加载 下拉刷新
     * (res) => void
     * res: {
     *   type, //'load' 'refresh'
     *   data, //数据
     *   error,
     * }
     */
    onRefreshComplete: PropTypes.func,

    /**
     * 加载更多结束
     * (res) => void
     * res: {
     *   data, //数据
     *   error,
     * }
     */
    onLoadMoreComplete: PropTypes.func,

    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    /**
     * 渲染loadMoreFooter的函数或者false 不渲染loadMoreFooter
     * Function(loadingType) loadingType: normal, loading, noMore
     * TODO 加载更多失败状态
     */
    renderLoadMoreFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    renderSeparator: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    renderRow: PropTypes.func,
    //renderRefreshControl: PropTypes.func,

    header: PropTypes.object,
    footer: PropTypes.object,
    loadMoreFooter: PropTypes.object,
    separator: PropTypes.object,
    emptyView: PropTypes.object,

    /**
     * 在初始提供 url 或 url 属性改变时是否重新加载列表 首次加载只有在数据为空时才会执行
     */
    autoLoad: PropTypes.bool,
    /**
     * 'first' 'all' TODO
     */
    autoLoadType: PropTypes.string,
    /**
     * 是否允许下拉刷新
     */
    refreshable: PropTypes.bool,
    /**
     * 是否允许加载更多
     */
    enableLoadMore: PropTypes.bool,
    //数据为空时 是否显示EmptyView
    showEmptyView: PropTypes.bool,
    emptyText: PropTypes.string,
    //允许加载更多且没有更多时显示的文字
    noMoreText: PropTypes.string,
    //RefreshControl的配置参数，只能控制样式相关
    refreshControlProps: PropTypes.object,
    //是否绑定页面刷新
    bindPageRefresh: PropTypes.bool,
    enableRenderSection: PropTypes.bool,

    //顶部弹动时露出的背景的style
    topBounceBgStyle: PropTypes.object,
    //数据为空时是否让emptyView 填充content
    emptyFillContent: PropTypes.bool,

    //在url 改变引起的刷新时是否显示刷新指示器 XXX 是否有必要?
    showRefreshIndicatorOnUrlChange: PropTypes.bool,
  };

  static defaultProps = {
    autoLoad: true,
    refreshable: true,
    enableLoadMore: true,
    showEmptyView: true,
    refreshControlProps: RefreshControlConfig.refreshControlProps,

    onEndReachedThreshold: 20,
    pageSize: 2,
    enableEmptySections: true,
  };

  static contextTypes = {
    //PageScrollExt需要
    page: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this._onRefresh = this._onRefresh.bind(this);
    this._onEndReached = this._onEndReached.bind(this);

    this._renderHeader = this._renderHeader.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._renderSectionHeader = this._renderSectionHeader.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);

    this._setListViewRef = this._setListViewRef.bind(this);

    let adapter;
    if (props.adapter) {
      adapter = props.adapter;
    } else {
      adapter = new BaseAdapter();
    }
    this._adapter = adapter;
    adapter.setList(this);

    adapter.prepareDataSource(props.dataSource);
    if (!props.dataSource) {
      const items = props.items || props.defaultItems;
      if (items) {
        adapter.updateData(items);
      }
    }
    adapter.setNextUrl(props.nextUrl || props.defaultNextUrl);

    this.state = {
      isRefreshing: false,
      isLoadingMore: false,
    };

    this.defaultStyles = styles;
  }

  //
  // 对外接口
  //

  get adapter() {
    return this._adapter;
  }

  getAdapter() {
    return this._adapter;
  }

  /**
   * 手动触发一次刷新
   * @return 是否触发了刷新，如果已经处于刷新状态则不会再触发
   */
  refresh() {
    if (this.state.isRefreshing) {
      return false;
    }
    this._onRefresh(false, REFRESH_TYPE_CALL);
    return true;
  }

  /**
   * 更新数据
   * 会停止目前正在进行刷新与加载更多
   * @param newData 新数据
   * @param nextUrl 下一页url
   */
  updateData(newData, nextUrl) {
    if (this.props.dataSource || this.props.items) {
      if (__DEV__) {
        console.warn('List 处于Controlled 模式,不能手动更新数据');
      }
      return;
    }
    if (arguments.length > 1 && this.props.nextUrl) {
      if (__DEV__) {
        console.warn('List nextUrl 处于Controlled 模式,不能手动更新数据');
      }
      return;
    }
    this._adapter.abortAll();
    this._adapter.updateData(newData);
    if (arguments.length > 1) {
      this._adapter.setNextUrl(nextUrl);
    }
    this.state.isRefreshing = false;
    this.state.isLoadingMore = false;
    this.forceUpdate();
  }

  isRefreshing() {
    return this.state.isRefreshing;
  }

  isLoadingMore() {
    return this.state.isLoadingMore;
  }

  //
  // 生命周期回调
  //

  componentDidMount() {
    this.pageScrollInit();
    if (
      this.props.url &&
      this.props.autoLoad &&
      this._adapter.isEmpty() &&
      !this.props.bindPageRefresh
    ) {
      this._onRefresh(true, REFRESH_TYPE_FIRST_LOAD);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (super.shouldComponentUpdate(nextProps, nextState)) {
  //     return true;
  //   }
  //   if (nextProps.adapter) {
  //     return nextProps.adapter
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    const props = this.props;

    //adapter
    let adapter = this._adapter;
    if (props.adapter != nextProps.adapter) {
      adapter.destroy();
      adapter = this._adapter = nextProps.adapter || new BaseAdapter();
      adapter.setList(this);
    }

    if (props.dataSource != nextProps.dataSource) {
      // TODO abortAll 必然需要设置isRefreshing isLoadingMore
      this.state.isRefreshing = false;
      this.state.isLoadingMore = false;
      adapter.abortAll();
      adapter.prepareDataSource(nextProps.dataSource);
    }

    let isDefaultItemsChange;
    //items
    if (!nextProps.dataSource) {
      let newItems;
      if (nextProps.items) {
        if (props.items != nextProps.items) {
          newItems = nextProps.items;
        }
      } else if (props.defaultItems != nextProps.defaultItems) {
        newItems = nextProps.defaultItems || null;
        isDefaultItemsChange = true;
      }

      if (newItems !== undefined) {
        // TODO abortAll 必然需要设置isRefreshing isLoadingMore
        this.state.isRefreshing = false;
        this.state.isLoadingMore = false;
        this._adapter.abortAll();
        this._adapter.updateData(newItems);
      }
    }

    //nextUrl
    if (nextProps.nextUrl) {
      if (props.nextUrl !== nextProps.nextUrl) {
        adapter.setNextUrl(nextProps.nextUrl);
      }
    } else if (
      props.defaultNextUrl !== nextProps.defaultNextUrl ||
      isDefaultItemsChange
    ) {
      // items与nextUrl 需要同时改变，对于defaultNextUrl 在defaultItems改变时也更新 XXX
      adapter.setNextUrl(nextProps.defaultNextUrl);
    }

    //url
    if (
      nextProps.url &&
      nextProps.url !== props.url &&
      nextProps.autoLoad &&
      !nextProps.bindPageRefresh
    ) {
      this.forceUpdate(() => {
        this._onRefresh(true, REFRESH_TYPE_URL_CHANGE);
      });
    }

    this.pageScrollWillReceiveProps(nextProps);
  }

  componentWillUnmount() {
    this.pageScrollDeInit();
    this._adapter.destroy();
  }

  setNativeProps(nativeProps) {
    this._listView && this._listView.setNativeProps(nativeProps);
  }

  _setListViewRef(ref) {
    this._listView = ref;
  }

  _onRefresh(isLoad, refreshType = REFRESH_TYPE_MANUAL) {
    this.props.onRefresh && this.props.onRefresh();
    if (this.pageScrollOnRefresh({ refreshType })) {
      return;
    }
    if (this._adapter.refresh(isLoad ? 'load' : 'refresh')) {
      this.setState({
        isRefreshing: true,
        isLoadingMore: false,
        refreshType,
      });
    }
  }

  _onRefreshComplete(res) {
    if (!this.isMounted()) {
      return;
    }
    this.setState({
      isRefreshing: false,
    });
    this.props.onRefreshComplete && this.props.onRefreshComplete(res);
  }

  _onEndReached() {
    this.props.onEndReached && this.props.onEndReached();
    if (!this.props.enableLoadMore) {
      return;
    }
    if (this.state.isRefreshing || this.state.isLoadingMore) {
      return;
    }

    if (this._lastLoadMoreTime && Date.now() - this._lastLoadMoreTime < 300) {
      return;
    }
    this._lastLoadMoreTime = Date.now();

    if (this._adapter.loadMore()) {
      this.props.onLoadMore && this.props.onLoadMore();
      this.setState({
        isLoadingMore: true,
      });
    }
  }

  _onLoadMoreComplete(res) {
    if (!this.isMounted()) {
      return;
    }
    this.setState({
      isLoadingMore: false,
    });
    this.props.onLoadMoreComplete && this.props.onLoadMoreComplete(res);
  }

  _getTopBounceBgStyle() {
    const topBounceBg = this.getStyle('topBounceBg');
    if (topBounceBg || this.props.topBounceBgStyle) {
      return [topBounceBg, this.props.topBounceBgStyle];
    }
    return null;
  }

  _renderHeader() {
    let header;
    if (this.props.renderHeader) {
      header = this.props.renderHeader();
    } else if (this.props.header) {
      header = LAB.render(this.props.header);
    }
    if (Platform.OS === 'ios' && !this.props.refreshable) {
      let topBounceBgStyle = this._getTopBounceBgStyle();
      if (topBounceBgStyle) {
        header = (
          <View>
            <View style={[topBounceBgStyle, styles.headerTopBounce]} />
            {header}
          </View>
        );
      }
    }
    return header;
  }

  _renderFooter() {
    //emptyView放在footer中
    let empty = this._renderEmpty();

    let loadingType;
    if (this.props.enableLoadMore) {
      loadingType = 'normal';
      if (this.state.isLoadingMore) {
        loadingType = 'loading';
      } else if (!this._adapter.isEmpty() && !this._adapter.hasMore()) {
        loadingType = 'noMore';
      }
    }

    let footer;
    if (this.props.renderFooter) {
      footer = this.props.renderFooter();
    } else if (this.props.footer) {
      footer = LAB.render(this.props.footer);
    }

    let loadMoreFooter;
    if (this.props.enableLoadMore) {
      if (this.props.renderLoadMoreFooter) {
        loadMoreFooter = this.props.renderLoadMoreFooter(loadingType);
      } else if (this.props.loadMoreFooter) {
        loadMoreFooter = LAB.render(this.props.loadMoreFooter, {
          loadingType,
          textStyle: this.getStyle('loadMoreFooterText'),
          style: this.getStyle('loadMoreFooter'),
        });
      } else if (this.props.renderLoadMoreFooter !== false) {
        loadMoreFooter = (
          <LoadMoreListFooter
            noMoreText={this.props.noMoreText}
            loadingType={loadingType}
          />
        );
      }
    }
    if (empty || footer || loadMoreFooter) {
      return (
        <View style={this.getStyle('footerContainer')}>
          {empty}
          {footer}
          {loadMoreFooter}
        </View>
      );
    }
    return null;
  }

  _renderEmpty() {
    if (!this.props.showEmptyView) {
      return null;
    }
    if (!this._adapter.isEmpty()) {
      return null;
    }
    if (this.state.isRefreshing) {
      //加载过程中不显示
      return null;
    }
    if (this.props.renderEmpty) {
      return this.props.renderEmpty();
    }
    let emptyView;
    if ((emptyView = this.props.emptyView)) {
      return LAB.render(emptyView, {
        style: [
          this.getStyle('emptyView'),
          emptyView.props ? emptyView.props.style : emptyView.style,
        ],
      });
    }
    if (this.props.emptyText) {
      return (
        <View style={this.getStyle('emptyView')}>
          <Text style={this.getStyle('emptyText')}>{this.props.emptyText}</Text>
        </View>
      );
    }
  }

  _renderSectionHeader(sectionData, sectionID) {
    if (this.props.renderSectionHeader) {
      return this.props.renderSectionHeader(sectionData, sectionID);
    }
    if (sectionData.ui_type) {
      //需要自定义dataSource 的 getSectionHeaderData
      return LAB.render(sectionData, {
        _sectionID: sectionID,
      });
    }
  }

  _renderRow(rowData, sectionID, rowID, onRowHighlighted) {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData, sectionID, rowID, onRowHighlighted);
    }
    return LAB.render(rowData, {
      _sectionID: sectionID,
      _rowID: rowID,
      _onRowHighlighted: onRowHighlighted,
    });
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (this.props.renderSeparator) {
      return this.props.renderSeparator(
        sectionID,
        rowID,
        adjacentRowHighlighted
      );
    }
    if (this.props.separator) {
      return LAB.render(this.props.separator, {
        key: sectionID + '-s' + rowID,
      });
    }
    //TODO 简单separator渲染的支持
  }

  render() {
    const props = this.props;
    let refreshControl;
    if (props.refreshable) {
      let refreshing = this.state.isRefreshing;
      if (
        this.state.refreshType === REFRESH_TYPE_URL_CHANGE &&
        props.showRefreshIndicatorOnUrlChange === false
      ) {
        // TODO
        refreshing = false;
      }
      let refreshControlStyle = props.refreshControlProps.style;
      if (Platform.OS === 'ios') {
        let topBounceBgStyle = this._getTopBounceBgStyle();
        if (topBounceBgStyle) {
          if (refreshControlStyle) {
            topBounceBgStyle.unshift(refreshControlStyle);
          }
          refreshControlStyle = topBounceBgStyle;
        }
      }
      refreshControl = (
        <RefreshControl
          {...props.refreshControlProps}
          style={refreshControlStyle}
          refreshing={refreshing}
          onRefresh={this._onRefresh}
        />
      );
    }
    const contentContainerStyle = [
      this.getStyle('contentContainer'),
      props.contentContainerStyle,
    ];
    if (
      props.emptyFillContent &&
      props.showEmptyView &&
      this._adapter.isEmpty()
    ) {
      contentContainerStyle.push(styles.emptyFillContent);
    }
    return (
      <ListView
        {...props}
        ref={this._setListViewRef}
        dataSource={this._adapter.dataSource}
        renderHeader={this._renderHeader}
        renderFooter={this._renderFooter}
        renderRow={this._renderRow}
        renderSectionHeader={
          (props.renderSectionHeader || props.enableRenderSection) &&
          this._renderSectionHeader
        }
        renderSeparator={this._renderSeparator}
        refreshControl={refreshControl}
        onEndReached={props.enableLoadMore || props.onEndReached ? this._onEndReached : null}
        contentContainerStyle={contentContainerStyle}
      />
    );
  }

  ///与Page绑定相关

  onPageRefreshStart(options) {
    if (!this.isMounted()) {
      return;
    }
    if (this.state.isRefreshing) {
      return;
    }
    this._adapter.abortAll();
    this.setState({
      isRefreshing: true,
      isLoadingMore: false,
      refreshType: (options && options.refreshType) || REFRESH_TYPE_PAGE,
    });
  }

  onPageRefreshComplete() {
    if (!this.isMounted()) {
      return;
    }
    if (!this.state.isRefreshing) {
      return;
    }
    this.setState({
      isRefreshing: false,
    });
  }
}

Object.assign(List.prototype, ListViewMixin, PageScrollExt);

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
  },
  emptyFillContent: {
    flex: 1,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  // emptyText: {
  //   fontSize: 12,
  //   color: '#999999',
  // },
  headerTopBounce: {
    position: 'absolute',
    left: 0,
    top: -screenHeight,
    right: 0,
    height: screenHeight,
  },
  // loadMoreFooterText: {
  //
  // },
  // loadMoreFooter: {
  //
  // },
});
