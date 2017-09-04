'use strict';

import { ListView } from 'react-native';
import httpFetch from './httpFetch';

const DataSource = ListView.DataSource;

const EMPTY_ARRAY = [];
if (__DEV__) {
  Object.freeze(EMPTY_ARRAY);
}

/**
 * 对List数据源的适配管理
 * dataSource
 * url
 * nextUrl
 * fetchData
 *
 * onRefreshComplete
 * onLoadMoreComplete
 *
 * TODO 取消请求
 */
class BaseAdapter {

  constructor() {
    this._requestId = 0;
  }

  /**
   * 创建DataSource
   */
  createDataSource() {
    return new DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  /**
   * 切换新的dataSource
   * @param dataSource 如果提供则用新的替换，否则内部会调用createDataSource创建一个新的
   */
  prepareDataSource(dataSource) {
    if (dataSource) {
      if (dataSource !== this.dataSource) {
        this.dataSource = dataSource;
      }
    } else {
      this.dataSource = this.createDataSource();
    }
  }

  /**
   * 更新数据
   */
  updateData(newData = []) {
    this.dataSource = this.dataSource.cloneWithRows(newData);
  }

  /**
   * refresh 成功获取到数据时调用
   * data: {
   *   items,
   * }
   */
  updateRefreshData(data) {
    this.updateData(data.items || []);
  }

  /**
   * loadMore成功获取到数据时调用
   * data: {
   *   items,
   * }
   */
  updateLoadMoreData(data) {
    if (data.items && data.items.length) {
      this.updateData(this.getData().concat(data.items));
    }
  }

  /**
   * 刷新结束调用
   * res: {
   *   type, // load refresh
   *   data, // fetchData 得到的数据
   *   error, // 如果fetchData失败则不为空
   * }
   */
  refreshComplete(res) {
    if (!this._isControlled) {
      if (!res.error) {
        this._nextUrl = res.data.nextUrl;
        this.updateRefreshData(res.data);
      }
    }
    this.callListRefreshComplete(res);
  }

  loadMoreComplete(res) {
    if (!this._isControlled) {
      if (!res.error) {
        this._nextUrl = res.data.nextUrl;
        this.updateLoadMoreData(res.data);
      }
    }
    this.callListLoadMoreComplete(res);
  }

  /**
   * 刷新数据
   * @param  type 'load' 'refresh'
   * @return true 处理了刷新 false 未处理(url为空)
   */
  refresh(type) {
    const url = this.getUrl();
    if (!url) {
      return false;
    }
    const requestId = ++this._requestId;
    this.fetchData({
      url,
      type,
    })
      .then(
        data => {
          if (requestId !== this._requestId) {
            return;
          }
          this.refreshComplete({
            type,
            data,
          });
        },
        error => {
          if (requestId !== this._requestId) {
            return;
          }
          this.refreshComplete({
            type,
            error,
          });
        }
      )
      .done();
    return true;
  }

  /**
   * 加载更多
   * @returns true 处理了加载更多 false 没有更多了
   */
  loadMore() {
    if (!this._nextUrl) {
      return false;
    }
    const requestId = ++this._requestId;
    const type = 'loadMore';
    this.fetchData({
      url: this._nextUrl,
      type,
    })
      .then(
        data => {
          if (requestId !== this._requestId) {
            return;
          }
          this.loadMoreComplete({
            type,
            data,
          });
        },
        error => {
          if (requestId !== this._requestId) {
            return;
          }
          this.loadMoreComplete({
            type,
            error,
          });
        }
      )
      .done();
    return true;
  }

  fetchData(options) {
    const fetchFunc = this._fetchData || (this._list && this._list.props.fetchData) || httpFetch;
    return fetchFunc(options);
  }

  callListRefreshComplete(res) {
    this._list && this._list._onRefreshComplete(res);
  }

  callListLoadMoreComplete(res) {
    this._list && this._list._onLoadMoreComplete(res);
  }

  isEmpty() {
    return !this.getData().length;
  }

  hasMore() {
    return !!this._nextUrl;
  }

  abortAll() {
    // TODO 通知list?
    ++this._requestId;
  }

  destroy() {
    ++this._requestId;
  }

  getUrl() {
    return this._list && this._list.props.url;
  }

  getData() {
    return (
      (this.dataSource._dataBlob && this.dataSource._dataBlob.s1) || EMPTY_ARRAY
    );
  }

  get data() {
    return this.getData();
  }

  setList(list) {
    if (this._list && this._list !== list) {
      throw new Error('Adapter 不能与多个List绑定');
    }
    this._list = list;
  }

  getList() {
    return this._list;
  }

  setNextUrl(nextUrl) {
    this._nextUrl = nextUrl;
  }

  set nextUrl(nextUrl) {
    this._nextUrl = nextUrl;
  }

  getNextUrl() {
    return this._nextUrl;
  }

  setFetchData(fetchData) {
    this._fetchData = fetchData;
  }

  isControlled() {
    return !!(this._list && (this._list.props.dataSource || this._list.props.items));
  }
}

export default BaseAdapter;
