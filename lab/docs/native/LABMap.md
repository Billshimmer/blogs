# 地图模块
## 安装配置
### android
* android使用百度地图 http://lbsyun.baidu.com/index.php?title=androidsdk
* 在AndroidManifest.xml 添加
```
<meta-data
    android:name="com.baidu.lbsapi.API_KEY"
    android:value="${BAIDU_LBS_API_KEY}" />
```
* build.gradle
```
...
manifestPlaceholders = [
        BAIDU_LBS_API_KEY: "xxx",
]
...
compile 'com.lightappbuilder.lab4:labmap:+'
```
* LABMapPackage
* 混淆 http://lbsyun.baidu.com/index.php?title=androidsdk/guide/buildproject
