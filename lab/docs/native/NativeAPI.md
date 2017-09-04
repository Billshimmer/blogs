# Native Module 与js之间的API定义规范
## 参数
参数使用单个json,命名为options
参数的合法性完整性检查由js端完成,native不需要做

## 返回
一般使用nodejs 风格的error first callback
Function(error, data)
特殊情况可使用Promise
## 回调数据格式
```
{
  code: String, //错误码 成功统一使用 'success'，取消统一使用 'cancel'
  message: String,
  data: any,
}
```
一般成功时直接返回data对象,除非成功状态也需要通过code区分不同类型

## native Module Callback
callback: Function(error, data)
error: 成功时为null, 失败时参考回调数据格式
data: 成功时返回的数据(一般不需要code message data)

## native Module Promise
resolve 直接返回数据(一般不需要code message data)
reject 返回参考回调数据格式,一般取消也属于reject

## 例子
参考CookieManager
