/**
 * 路由配置
 * 由于打包脚本会读取本文件获取配置的路由信息
 * 所以
 * 1. 所有配置都必须放在一个文件，不能require其他文件
 * 2. tpl 必须是字面常量
 */
module.exports = [
  {
    path: '/xxx/xxx',
    //tpl: 'lab.DefaultPage-default',
    // comp: 'com.xxx',
    // isStaticTpl: true,
    // ignoreLoadError: false,
  }
];
