import { PropTypes } from 'react';

/**
 * lab组件在大多数情况下使用的上下文对象
 */
export default {
  //继承LABContext的实例，可能是Application或者page
  labContext: PropTypes.object,
  //Application
  application: PropTypes.object,
  //路由对象
  router: PropTypes.object,
  //当前页面
  page: PropTypes.object,
  //当前作用域事件总线
  emitter: PropTypes.object,
  //当前页面事件总线
  pageEmitter: PropTypes.object,
  // 当前所属window的pupup
  popup: PropTypes.object,
  // 全局的popup
  appPopup: PropTypes.object,
  visibleManager: PropTypes.object,
};
