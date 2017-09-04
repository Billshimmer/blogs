## 现有组件代码存在的问题


## PageStateView

状态:
loading
empty
error
未登录
... 自定义扩展

状态切换动画
状态叠加?

error:
错误状态可配置为支持显示loading，刷新按钮自带loading效果,在下一次调用showContent之前 loading效果都由错误页面代替显示
可以将error 与loading 用一个组件实现 在由error 转换到loading时特殊处理

未登录:
配置登录跳转url
监听登录状态 一旦登录就刷新页面(加一个延迟?)

配置只覆盖内容区域 或者全屏(包括HeaderBar区域)

## Drawable
* 本地图片 (img 文件夹下)
* 在线图片
* 本地icon (LABIcons)

### uri 表示
* 在线图片
http[s]://
/xxx (相对于当前app baseUrl)
* 本地图片 xxx 不包括扩展名
@image/xxx
xxx
* 本地icon
@icon/xxx

### icon name
xxx
@icon/xxx
@image/xxx


drawable
无@xxx 默认为image
@image/xxx
@icon/xxx

res:/@image/xxx
res:/@icon/xxx


## xxx
"react-native": "file:../react-native",
"lab-react-native-web": "file:../lab-react-native-web",

"react-native": "git+ssh://git@git.dev.backustech.com:lab4/react-native.git#lab-0.42-stable",
"lab-react-native-web": "git+ssh://git@git.dev.backustech.com:lab4/react-native.git#lrnw-0.42-stable",
