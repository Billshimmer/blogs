
# Roadmap
* pageMainScroll PageScrollExt 不依赖EventEmitter
* popup toast 允许在componentWillMount时调用
* react-navigation 升级
* http cache https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
* rollup 打包前置条件 将requireComp 使用__d require的方式实现
* rollup 打包前置条件 参考rollup插件为rn node-haste实现简单的插件,替换现在的serverBuildBundleInterceptor。要注意Server层缓存问题
* lrnw rollup 打包
* react-native-drawer-layout-polyfill
* 对同时支持设置 image icon 的组件 抽象drawable属性 参考Android?  去除Icon 的Image支持?
* [√] RouterManifest 使用path-to-regexp实现
* http 请求body 使用 application/json 代替application/x-www-form-urlencoded 需要后端支持
* [√] web css 压缩合并
* 程序退出之后在进入 js环境是重用的 所以很容易发生内存泄漏，一些全局的事件总线可以再Application willUnmount中取消订阅 考虑由其引起的其它问题
* [√] android 使用moveStackBack 代替finish Activity 在收到app将要被杀死时 可以finish Activity?
* 更好的内存泄漏检测 参考java leakcanery方式
* react-swipeable-views
* [√] http 取消
* [√] 使用Bluebird作为默认Promise实现，利用其cancel功能与http模块整合
* native module 参数验证在js端完成 prop-types
* es7 Decorator 实现Mixin
* navigation 可配置临时阻止手势返回
* native 实现Navigation
* [√] Android gradle 混淆
* Android 6.0 权限
* native 用户数据与js共享
* icon 自定义 https://icomoon.io/app/#/select
* 推送 别名绑定重试 防止卸载后打开应用收到推送
* [x] android richtext 图片加载改为fresco 可限定图片的最大宽高
* TabBar 重构 整合scroll 与普通 分割线支持 Animated.event
* PageStatusView 在Page配置pageStatusViewFillPage时支持设置顶部HeaderBar的空白 渲染一种状态时 支持返回是否需要顶部空白
* [√] PageStatusView 页面状态增加 比如未登录状态等 数据为空
* [x] com.List 默认的二维适配器
* [√] 异常上报模块，发布模式让js异常不崩溃，通过异常上报模块上报
* [√] 修复Android TouchableNativeFeedback ripple位置错误
* [√] 使用ex-axios
* [√] Parse RESTController 使用ex-axios
* [√] Parse ParsePromise 改为bluebird
* Toast 在键盘弹出时自动上移防止被挡住
* [√] Android RNUtils 不用反射
* Android release abifilters armeabi-v7a, arm64-v8a
* [√] 切换到 https://github.com/react-community/react-navigation
* [x] Android native权限申请基于rn权限申请代码扩展
* [x] Android touchablenativefeedback加强 参考原生button效果 高度动画  考虑专门做一个view
* Android native 实现优化的ScrollView 支持横竖 边缘弹动 自定义pulltorefresh header等,可与优化的ListView配合
* ListView优化，回收重用
* [x] Scrollable 上下文接口，Page对外可当作Scroll
* facebook prepack js 优化
* 服务器测试环境 web native 开发阶段的测试服务器，自动部署
* 加载失败网络恢复时的自动重试
* [x] 友盟推送
* 路由配置功能增强 页面是否需要登录等
* 组件数据props合法性验证,在页面显示错误
* web HistoryNavigator 简化转场动画实现方式
* web 图片懒加载
* 如何防止按钮快速按多下 导致动作重复执行的问题，如重复打开新页面
* 代码注释生成文档
* [x] android build.gradle 中placeholder 配置全部放到config.js中
* config.js native与js共享 再热更新之后能够同步 研究code-push加载原理
* 扩展rn asset 自定义assets 资源 可以添加除了图片之外的其它文件并实现读取(react-native-fs...)
* config.js 加密
* android 提取lab-core库
* android onSaveInstanceState 状态保存， 通过修改react native 源码 在Activity销毁时不销毁react native 环境，并Attach到新的Activity上,应该只需要改ReactContext的base context引用. 还需要react 环境被销毁时回调各模块,需要参考Fragment生命周期api 通知各module  viewManager
* android 研究LazyReactPackage 各模块初始化尽量不要放在Application onCreate (可以同时支持模块内初始化和单独调用提前初始化)
* android keystore 管理, keystore生成时小写的md5 用于微信
* Form 组件使用context 与子field通信
* react web Animated 支持native动画
* native 基础组件View Text Image回收重用的可能性？
* rn 0.43支持fresco http header 修改android lab-im
* CoordinatorLayout
* Animated.event 探索与CoordinatorLayout 结合
* web 图片等资源自动上传七牛 hash缓存
* LABError 用于api的error返回
* android 透明导航栏 fitSystemWindow组件支持 Page

# 各种组件优化
* 拍照组件自带取景框?
* 表单组件需要包含以下参数：url（提交地址）、method（GET、POST）、encode（form-data、x-www-form-urlencoded、json）、success（成功回调）、fail（失败回调）

# BUG 研究
* android zIndex的问题

# 新工程模板
* 使用create-react-app https://github.com/facebookincubator/create-react-app
