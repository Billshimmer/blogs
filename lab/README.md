# LAB4

## Getting Started

- 在开始之前请确定已经具备React Native 开发的相关知识[React Native website](https://facebook.github.io/react-native/)并已搭建好相关环境
- npm加速 [淘宝npm镜像](http://npm.taobao.org/)

配置cnpm别名(mac)
```
echo 'alias cnpm="npm --registry=https://registry.npm.taobao.org"' >> ~/.bash_profile && source ~/.bash_profile
```

### 运行lab4 demo
- 下载项目(放入适当位置，以后需要更新,下面命令clone了dev分支)
```
git clone -b dev git@git.dev.backustech.com:lab4/lab4.git
```
- 安装依赖
```
cnpm i --verbose
```
- 运行demo
```
react-native run-android
或
react-native run-ios
```

### 创建lab4工程
- 安装lab-cli
进入clone 下来的lab4工程(运行pwd 确保在工程根目录)
```
cnpm i lab-cli -g --verbose
```
安装结束之后运行 `lab-cli --version` 确认是否已成功安装
- 安装gulp
```
cnpm i gulp -g
```
- 创建工程
进入放置工程的目录
```
lab-cli init AwesomeLAB4 --verbose
```
之后会用vim 打开工程的配置文件，如果不需要修改则直接退出就好 `:q`
- 安装依赖
```
cd AwesomeLAB4 && cnpm i --verbose
```
- 安装ios 依赖
进入ios 目录 运行`pod install` (需要安装cocoapods)
- 运行demo(默认初始后的工程会启动demo列表,如果无法运行则使用手动运行)
```
react-native run-android
或
react-native run-ios
```
- 手动运行
在工程根目录运行 `react-native start` 开启服务器
进入ios 目录，打开*.xcworkspace 文件，在xcode 中手动运行
或者打开Android Studio 选择右侧的'Open an existing Android Studio project' 找到项目的android目录双击，然后运行
- 创建一个demo [Demo 说明](http://git.dev.backustech.com/lab4/lab4/blob/master/docs/Demo.md)
- 工程目录结构说明 [工程目录结构](http://git.dev.backustech.com/lab4/lab4/blob/master/docs/ProjectStruct.md)
