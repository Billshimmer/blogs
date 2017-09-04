'use strict';

/**
 * demo配置数据类型
 * 1.
 * DemoPage Class //测试页面的class
 * 默认使用class 的名字作为列表的显示名字,也可单独设置DemoPage.title 静态属性覆盖显示名字
 *
 * 2.
 * {
 *   title, //在列表中的名字
 *   url, //平台数据地址
 *   comp, //测试页面class 推荐定义成get 延迟加载
 *   platform, //demo的使用平台 ios android web native
 *   isNew, //是否为新的demo 在列表中会高亮显示
 * }
 */
module.exports = {
  DEMO: [
    // {
    //   title: 'LABScrollView',
    //   get comp() { return require('./native/views/LABScrollViewDemo'); },
    // },
    {
      title: 'com.List',
      get comp() { return require('./List/ListDemo'); },
    },
    {
      title: 'PageDemo',
      get comp() { return require('./PageDemo'); },
    },
    {
      title: 'com.Scroll',
      get comp() { return require('./ScrollDemo'); },
    },
    {
      title: 'Components',
      get comp() { return require('./ComponentsDemo'); },
    },
    {
      title: 'LoginDemo',
      get comp() { return require('./LoginDemo'); },
    },
    {
      title: 'SideIndexView',
      get comp() { return require('./native/LABSideIndexViewDemo'); },
      platform: 'native',
      isNew: true,
    },
    {
      title: 'PhotoBrowser',
      get comp() { return require('./PhotoBrowserDemo'); },
      platform: 'native',
      isNew: true,
    },
    {
      title: 'Router Navigation',
      get comp() { return require('./NavigationDemo'); },
      isNew: true,
    },
    {
      title: 'com.ImagePick',
      get comp() { return require('./ImagePickDemo'); },
      isNew: true,
    },
    require('./HeaderBarDemo'),
    require('./ViewPagerTabBarDemo'),
    require('./GridViewDemo'),
    require('./DropDownMenuDemo'),
    require('./EventEmitterDemo'),
    require('./SearchDemo'),
    require('./DropDownSwiperDemo'),
    require('./CardItemDemo'),
    {
      title: 'ButtonTouchableDemo',
      get comp() { return require('./ButtonTouchableDemo'); },
    },
    require('./FormDemo'),
    require('./ListItemDemo'),
    require('./TabBarItemDemo'),
    require('./BlockListDemo'),
    {
      title: 'com.Image',
      get comp() { return require('./ImageDemo'); },
    },
    {
      title: 'com.Icon',
      get comp() { return require('./IconDemo'); },
      isNew: true,
    },
    {
      title: 'Popup',
      get comp() { return require('./PopupDemo'); },
    },
    require('./RouterManagerDemo'),
    require('./HtmlDemo'),
    require('./ToastDemo'),
    require('./redux/ReduxUserDemo'),
    require('./MultiSelectListDemo'),
    {
      title: 'Hello World',
      get comp() { return require('./HelloWorldDemo'); },
    },
    {
      title: 'RatioView',
      get comp() { return require('./RatioViewDemo'); },
    },
    require('./ExpandableDemo'),
    {
      title: 'LoggerDemo',
      get comp() { return require('./LoggerDemo'); },
    },
    {
      title: 'SwiperDemo',
      get comp() { return require('./SwiperDemo'); },
    },
    {
      title: 'HTTPDemo',
      get comp() { return require('./HTTPDemo'); },
    },
  ],
  TEST: [
    {
      title: 'Layout Props TEST',
      get comp() { return require('./test/LayoutPropsTest'); },
    },
    {
      title: 'ReactTest',
      get comp() { return require('./test/ReactTest'); },
    },
    {
      title: 'TestPage',
      get comp() { return require('./TestPage'); },
    },
    {
      title: 'PromiseTest',
      get comp() { return require('./test/PromiseTest'); },
    },
    {
      title: 'ImageTest',
      get comp() { return require('./test/ImageTest'); },
    },
    {
      title: 'ARTTest',
      get comp() { return require('./test/ARTTest'); },
    },
    {
      title: 'MiscTest',
      get comp() { return require('./test/MiscTest'); },
    },
    {
      title: 'MiscViewTest',
      get comp() { return require('./test/MiscViewTest'); },
    },
    {
      title: 'IconTest',
      get comp() { return require('./test/IconTest'); },
    },
    {
      title: 'TestCompPage',
      get comp() { return require('./testcomp/TestCompPage'); },
    },
    {
      title: 'ListViewTest',
      get comp() { return require('./test/ListViewTest'); },
    },
    {
      title: 'ScrollViewTest',
      get comp() { return require('./test/ScrollViewTest'); },
    },
    require('./test/AnimationTest'),
    require('./test/TextTest'),
    //require('./test/StatusBarTest'),
    //require('./test/ModalTest'),
    //require('./test/KeyTest'),
    //require('./test/ControlledTest'),
    {
      title: 'ToolBarTest',
      get comp() { return require('./test/ToolBarTest'); },
      platform: 'android',
    },
    {
      title: 'WebViewTest',
      get comp() { return require('./test/WebViewTest'); },
      platform: 'native',
    },
    {
      title: 'MapView',
      get comp() { return require('./test/MapTest'); },
      platform: 'ios',
    },
    require('./test/LinkingTest'),
    require('./test/ResponderEventTest'),
    {
      title: 'TextInputTest',
      get comp() { return require('./test/TextInputTest'); },
    },
    {
      title: 'NestedScrollTest',
      get comp() { return require('./test/NestedScroll'); },
    },
    //require('./test/RefreshControlTest')
  ],
  APIS: [
    {
      title: 'CrashReportDemo',
      get comp() { return require('./apis/CrashReportDemo'); },
    },
    {
      title: 'CookieManagerDemo',
      get comp() { return require('./apis/CookieManagerDemo'); },
    },
    {
      title: 'QiniuDemo',
      get comp() { return require('./apis/QiniuDemo'); },
    },
    {
      title: 'PushManagerDemo',
      get comp() { return require('./apis/PushManagerDemo'); },
      platform: 'native',
    },
    {
      title: 'PayDemo',
      get comp() { return require('./apis/PayDemo'); },
      platform: 'native',
    },
    {
      title: 'AudioKitDemo',
      get comp() { return require('./apis/AudioKitDemo'); },
      platform: 'native',
    },
    {
      title: 'VideoDemo',
      get comp() { return require('./apis/VideoDemo'); },
      platform: 'native',
    },
    {
      title:'ImagePicker2',
      get comp(){return require('./apis/ImagePickerDemo2')},
      platform: 'native',
    },
    {
      title:'ImagePicker',
      get comp(){return require('./apis/ImagePickerDemo')},
      platform: 'native',
    },
  ],
  NATIVE: [
    {
      title: 'ViewManagerTest',
      get comp() { return require('./native/ViewManagerTest'); },
      platform: 'native',
    },
    {
      title: 'WebViewDemo',
      get comp() { return require('./native/WebViewDemo'); },
      platform: 'native',
    },
    {
      title: 'RichTextDemo',
      get comp() { return require('./native/RichTextDemo'); },
      platform: 'native',
    },
    {
      title: 'LABMapDemo',
      get comp() { return require('./native/LABMapDemo'); },
      platform: 'native',
    },
    {
      title: 'LABDynamicMapDemo',
      get comp() { return require('./native/LABDynamicMapDemo'); },
      platform: 'native',
    },
    {
      title: 'LABIMDemo',
      get comp() { return require('./native/LABIMDemo'); },
      platform: 'native',
    },
    {
      title: 'com.Map',
      get comp() { return require('./native/MapTest'); },
      platform: 'native',
    },
    {
      title: 'LABSocialDemo',
      get comp() { return require('./native/LABSocialDemo'); },
      platform: 'native',
    },
    {
      title: 'LABScanDemo',
      get comp() { return require('./native/ScanViewDemo'); },
      platform: 'native',
    },
    {
      title: 'LABPhotoBrowser',
      get comp() { return require('./native/LABPhotoBrowserDemo') },
      platform: 'native',
    },
    {
      title: 'LABIMChat',
      get comp() { return require('./native/LABIMDemo') },
      platform: 'native',
    },
  ],
};
