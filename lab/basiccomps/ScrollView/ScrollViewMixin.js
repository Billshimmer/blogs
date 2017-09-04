'use strict';

//让自定义组件对外暴露内部 ScrollView 方法
export default {

  getScrollResponder: function() {
    return this._scrollView && this._scrollView.getScrollResponder();
  },

  scrollTo: function(...args) {
    return this._scrollView && this._scrollView.scrollTo(...args);
  },

};
