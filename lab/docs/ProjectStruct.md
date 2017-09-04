## lab4工程目录结构

```
./
|-comps/
|    |-com/ com组件
|    |-{proj}/ 项目内公用组件
|    |-{module1}/ 子模块1组件
|    |-{module2}/ 子模块2组件
|-style/ 样式 结构同comps
|-img/ 图片
|    |-{module1}/ 子模块1图片
|    |-{module2}/ 子模块2图片
|-demo/ 项目的组件例子和测试代码
|    |-DEMOS.js 测试例子列表
|-android/
|    |-{module1}/ android 中主module对应的module 文件夹名字可能是app
|    |-{module2}/
|-ios/
|    |-{module1}/
|    |-{module2}/
|    |-Pods/
|-web/ react native web
|    |-{module1}/
|        |-index.html 测试模式入口
|        |-index.release.html 发布模式入口
|        |-js/
|        |-css/
|        |-fonts/
|    |-{module2}/...
|-build/ 构建生成的文件目录，在版本控制系统中忽略
|    |-{module1}/
|    |    |-#buildType#/ 构建类型文件夹如 debug release
|    |         |-comps.js
|    |         |-styles.js
|    |         |-images.js
|    |         |-tpls.js 由下载的模板文件与RouteManifest文件共同决定
|    |         |-config.json 合并之后的配置 可能会有.android .ios .web 等各个不同平台的文件
|    |         |-index.js 对所有构建产生的文件的引用
|    |-{module2}/...
|    |-tpls/ 下载的模板文件
|    |-outputs/ 打包输出文件夹
|         |-android/
|         |-ios/
|         |-web/
|              |-rwpublic/ react native web build输出
|-{module1}/ module文件夹 如果某个module是主module 则其文件可直接放在根目录
|    |-main.js 入口
|    |-main.web.js web入口
|    |-App.js 顶层组件Application 也是放置全局逻辑代码的地方
|    |-App.web.js
|    |-RouteManifest.js 路由配置
|    |-Theme.js 主题
|    |-config.js 项目与构建配置
|-{module2}/...
|-utils/ 项目工具类
|-docs/ 项目文档
|-TplUrls.js 模板文件清单
|-rn-cli.config.js react-native 配置
|-lrnw-cli.config.js react-native-web 配置
|-gulpfile.js
|-.gitignore
|-.npmignore
'-package.json
```

* 说明
项目目录结构以有两个子module的项目为例
{project}: 项目名 如 huitu
{proj}: 项目名的简写 不包含大写字母 如 ht
{module1}, {module2}: 子模块名(可包括小写字母和数字以字母开头)
native 的包名一般采用 com.backustech.{proj}.{module}

## package.json lab4配置项(工程全局配置)
```json
"lab4": {
  # 配置主模块名
  "mainModule": "module1",
  # 配置项目的子module
  "modules": [
    "module1",
    "module2"
  ],
  # 模板下载地址
  "tplUrl": "http://tpl"
}
```
主module的App.js main.js config.js 等文件可直接放入工程根目录
module 名字必须小写
* 修改package.json 文件必须重启react-native 服务器(react-native start)

## config.js
buildType 名字可包括小写字母和数字 以字母开头
配置文件采用js语法，方便注释，但导出的配置对象必须可序列化
配置文件是由nodejs 解析的 所以不能依赖项目逻辑代码
```javascript
module.exports = {
  //... 上传相关配置
  // 默认配置
  default: {
    //版本号 可选 如果不配置则使用package.json中的(推荐) 范围 [0, 214] . [0, 999] . [0, 9999]
    version: "1.0.0",
    // 程序基地址
    baseUrl: "http://example.com",
    // 需要引用的组件包白名单 默认会引用com和当前项目comps目录中除了其他模块包之外的所有，对于test包在release 构建中不会引用 (目前只支持包名的第一级)
    packageWhitelist: ["com", "xxx"],
    // 组件黑名单 列出所有不需要的组件
    compBlacklist: ["com.AAA", "com.BBB"],
    // 图片黑名单，配置img文件夹中忽略的文件夹
    imageBlackList: [],
    // 额外的配置
    extra: {
      // 对七牛的配置
      qiniu: {
        tokenUrl: "http://xxx"
      }
    },
    // 对不同平台的配置
    android: {

    },
    ios: {

    },
    web: {

    }
  },
  // 各构建类型配置，会与default合并
  buildTypes: {
    // debug 构建配置 开发环境
    debug: {
      baseUrl: "http://debug"
    },
    // beta 构建配置 用于测试
    beta: {
      // 配置是否开启debug 如果配置则使用改值，否则根据buildType 为'debug' 才开启
      debug: true
    },
    // release 构建配置
    release: {
      
    }
  }
};
```

* 项目构建时配置合并策略
default中特定平台如android 与其他配置合并,当前构建版本如debug中也进项相同的合并，
最后将debug 与default合并。合并方式采用简单的Object.assign

## comps和style目录结构
```
./
|-xxx/
     |-example/
     |    |-Example1/
     |         |-Example1.js
     |-Example2/
     |    |-index.js
     |-test/
          |-Test1.js
          |-Test2.js
```

上面目录包含的组件
```
xxx.example.Example1
xxx.Example2
xxx.test.Test1
xxx.test.Test2
```
* 命名规范
组件名只能包括字母和数字且以大写字母开头 如 Example1  Test2
包名只能包括小写字母和数字且以小写字母开头 如 com com.example com.test com.page
* 查找规范
某个目录xxx/Abc符合组件的命名规范，里面有index.js或者包含与目录名相同的Abc.js 文件，则该目录为组件目录， 组件为xxx.Abc，否则忽略
某个目录xxx/abc符合包名的命名规范，则递归查找其子目录，如果目录里面有Abc.js Bcd.js则包含组件xxx.abc.Abc xxx.abc.Bcd，
