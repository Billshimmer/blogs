//定义所有lab内部事件总线的事件
//事件等级
// globalEmitter 全局
// pageEmitter 页面内
// emitter  emitter controller中 默认就是pageEmitter

export default {
  ///User
  LOGGED_IN: 'lab_logged_in', //用户登录事件
  LOGGED_OUT: 'lab_logged_out', //用户退出登录事件

  ///Page pageEmitter
  //请求触发页面刷新
  PAGE_REFRESH_PAGE: 'lab_page_refresh',
  //页面刷新开始
  PAGE_REFRESH_START: 'lab_page_refreshStart',
  //页面刷新结束 (e, data, isSuccess) e: 事件对象 data: 刷新得到的数据或异常 isSuccess: 刷新是否成功
  PAGE_REFRESH_COMPLETE: 'lab_page_refreshComplete',
  //Page.showError时重新加载按钮事件 (type) type: 最后一次引起页面error的类型 页面首次加载或者刷新失败时的按钮不会发出该事件，因为此时点击按钮页面本身会刷新
  PAGE_ERROR_RELOAD_PRESS: 'lab_page_error_reload_press',
  //TODO componentWillFocus 相关
  //TODO 双击头部滚动相关

  ///TabBar emitter
  //tab切换事件 (e, index)
  TAB_BAR_TAB_CHANGE: 'lab_tabBar_tabChange',

  ///ViewPager emitter
  //viewPager页面切换 (e, index)
  VIEW_PAGER_PAGE_CHANGE: 'lab_viewPager_pageChange',
  //viewPager页面滚动 (e, scrollOffset) scrollOffset: [0, pageCount - 1]
  VIEW_PAGER_PAGE_SCROLL: 'lab_viewPager_pageScroll',

  DRAWER_LAYOUT_OPEN_DRAWER: 'lab_drawer_layout_open_drawer',
  DRAWER_LAYOUT_CLOSE_DRAWER: 'lab_drawer_layout_close_drawer',

  ///Search emitter
  //搜索文本改变 (e, text)
  SEARCH_TEXT_CHANGE: 'lab_search_textChange',
  //提交搜索 (e, text)
  SEARCH_SUBMIT: 'lab_search_submit',
  //设置新的搜索关键字 (e, text)
  SEARCH_SET_TEXT: 'lab_search_set_text',
  //搜索请求开始 不包括搜索的下拉刷新与加载更多
  SEARCH_REQUEST_START: 'lab_search_request_start',
  //搜索请求结束 不包括搜索的下拉刷新与加载更多
  SEARCH_REQUEST_COMPLETE: 'lab_search_request_complete',

  ///Filter emitter 条件筛选组件发出的事件
  //筛选条件改变 (e, condition)
  FILTER_CONDITION_CHANGE: 'lab_filter_condition_change',

  //登录存储
  DROP_SET_KEY: 'lab_drop_set_key',
};
