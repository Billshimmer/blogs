# CHANGELOG

## 2.3
  * TODO http cache
  * TODO config.js native与js共享 在热更新之后能够同步 研究react-native-code-push加载原理
  * TODO Image 优化 1. 强制开启七牛裁剪 不管是否为七牛 2. 七牛裁剪的可配置性 3. 裁剪大小分档位 4. 大小变化变大2倍以上时重新计算裁剪参数
  * TODO StatusView 支持动画 1
  * TODO Toast 在键盘弹出时自动上移防止被挡住 1
  * TODO native module 参数验证在js端完成 prop-types
  * TODO 路由配置项整理 重构
  * TODO es7 Decorator 实现Mixin  LinkEmitAble BaseComponentMixin... 1
  * TODO drawable 属性 com.Drawable 整合Image Icon; active selected等参考Android的state; res/drawable.js 用于配置各种drawable; 取消com.Icon的Image功能
  * TODO Button 支持ImageButton 中间显示Image 使用Drawable 按下时触发Drawable的active?
  * TODO icon glyphMap 从icomoon style.css自动生成 参考react-native-vector-icons
  * TODO android im; 1. 去除glide 2. 表情 其他切换闪烁 3. 表情或其他打开时 按返回键
  * TODO android 6.0 权限 并将targetVersion 提到25 2
  * TODO 修复User 模块由于cookie 与内存中的状态不同步导致的问题
  * TODO LABNavigation 每个scene可单独配置是否支持手势返回 可临时开关

## 2.2
  * LABIcons
  * EventEmitter 升级
  * release 模式捕获所以异常 不让程序崩溃 异常上报模块
  * LinkEmitAble 增加对外链的处理
  * 在js端设置http请求的 useragent 包括js version  native version platform等
  * Html 支持链接点击回调配置 原来的通过外部浏览器打开也通过这种方式实现 web未实现
  * web css 压缩合并
  * VisibleManager User.emitter 内存泄漏检测
  * web 资源可配置baseUrl global.LAB_RESOURCE_BASE_URL
  * android splash 改为dialog实现 https://github.com/crazycodeboy/react-native-splash-screen
  * Button disabled 状态不再使用View 代替
  * Image 优化 如果不是七牛图片则不需要onLayout 在需要的时候UIManager.measure
  * com.List Adapter 改造
  * pageMainScroll
  * 支持npm5
  * android im
  * 组件可设置黑名单 排除不需要的组件
  * Demo输入url 增加测试页面入口
#### breaking
  * 删除scripts文件夹
  * com.Touchable com.Button onPress 返回false 可阻止LinkEmit的触发

## 2.1.1x
  * Popup 重构
#### breaking
  * PageStateView -> PageStatusView 重构
  * 重构Page.loadPageData
  * PageContainer shouldComponentUpdate 使用shallowEqualEx优化
  * Image.setExtraQiniuImageChecker
  * com.Dialog button onPress 不在默认调用hide

## 2.1
  * 代码重构，全面使用ex6 import export
  * 增加BasePureComponent
  * config 增加buildType字段 DI.getConfig().buildType ('debug' 'beta' 'release' ...)
  * LABNavigation _handleStartShouldSetResponderCapture处理逻辑优化 防止点击无效事件过长
  * HeaderBar icon 大小默认改为24

#### breaking
  * react-native 0.40 => 0.42
  * LAB.isLABCompData => LAB.isCompData
  * LAB.setDefaultTpl LAB.setDefaultTplName => LAB.TemplateManager.xxx
  * style请使用export default导出
  * initialize 不用配置 comps, styles, images, tpls
  * Button 去除innerStyle属性
  * HeaderBarItem 去除 mainContainer样式层级
  * 统一改为使用com.Touchable
  * 删除com.PageWrapper
  * RouterManager 使用path-to-regexp实现 *后面不能接名字
  * com.List 使用BasePureComponent
  * com.HeaderBarItem 去除subUrl flagEmit 等
  * LinkEmitAble link属性支持字符串提供 pop popToTop等
  * 废弃平台数据引用本地数据的功能 _has_localdata
  * HeaderBar 去除itemContainer样式的width HeaderBarItem width由自己定义
  * android lablibrary中去除Bugly与umeng统计
  * TabBarItem 去除subUrl flagEmit 等

## 2.0
  * 升级react-native lab-0.40-ex-stable
  * 升级lab-react-native-web lrnw-0.40-ex-stable

#### breaking
  * lab4/utils 改为default 导出
