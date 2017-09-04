'use strict';

//让自定义组件对外暴露内部 ListView 方法
export default {

  getListView() {
    return this._listView;
  },

  getMetrics: function() {
    return this._listView && this._listView.getMetrics();
  },

  getScrollResponder: function() {
    return this._listView && this._listView.getScrollResponder();
  },

  scrollTo: function(...args) {
    return this._listView && this._listView.scrollTo(...args);
  },
};
