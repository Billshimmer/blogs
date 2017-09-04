import ReactNative, {
  Platform,
} from 'react-native';

export default {
  primaryColor: '#3F51B5', //主色调
  darkPrimaryColor: '#303F9F', //主色调加深
  lightPrimaryColor: '#C5CAE9', //主色调减淡
  accentColor: '#FF4081',
  primaryTextColor: '#212121', //主要文本颜色
  secondaryTextColor: '#727272', //次要文本颜色
  dividerColor: '#B6B6B6', //分隔线颜色
  successColor: '#5CB85C', //success颜色
  infoColor: '#31B0D5', //info颜色
  warningColor: '#F0AD4E', //warning颜色
  dangerColor: '#C9302C', //danger颜色

  //HeaderBar 高度 TODO material design 中toolbar高度 https://stackoverflow.com/questions/30570904/whats-the-height-of-the-android-toolbar
  headerBarHeight: Platform.OS === 'android' ? 48 : 44,

  //pageBackgroundColor: '#F5F5F5', //page 背景颜色 如果透明则定义为null
  blankBlockColor: '#F5F5F5', //空白块颜色

  //statusBarHeight 状态栏高度，由系统配置决定，自动添加不需要在主题中配置。如果不允许在状态栏下绘制界面则该值为0
  //navigationBarHeight android底部导航栏高度
};
