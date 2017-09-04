## Native IM 模块API文档

### 初始化
```
LABIMModule.init(options)
options: {
  chatRecordUrl,
}
```

###  1、登录

#### 函数名：login

#### 参数： options

```javascript
options:
{
  imId: string,
  password: string,
}
```

#### 回调：callback

```javascript
callback([error，message]);
登录成功的情况下： 只传error，且error对象为null
登录失败的情况下： 传入环信返回的error对象，再加上对应的解释信息，message
```

###  2、退出登录(主动)

#### 函数名：logout
#### 参数：无
#### 回调：callback

```javascript
callback([error，message]);
退出登录成功的情况下： 只传error，且error对象为null
退出登录失败的情况下： 传入环信返回的error对象，再加上对应的解释信息，message
```

附带数据：

```
{
  code: 'USER_REMOVED' 或者 'USER_LOGIN_ANOTHER_DEVICE'
}		
```


### 3、获得最新联系人列表

#### 函数名 getConversationList
#### 思路：
从本地数据库获取最近联系人信息，将最近联系人信息整理成一个数组，按照时间戳来排序，并返回这个数据给前端

#### 参数： 无

#### callback：
```javascrip
// 按照时间戳升序排序，所有字段均为string
[
  {
  imId,
  unreadMsgCount,
  timestamp,
  lastMsgContent,
  }，
]
```

### 4、初始化聊天时前端传入数据规定

```
{
  toImId,
  toAvatar,
  toNickname,
  myAvatar,
  myNickname,
}
```

### 5、 获取未读消息数

```
LABIMModule.getUnreadMessagesCount((error, count) => {

})
```

### 6、 事件

#### 退出登录
```
LAB_IM_DISCONNECTED   		
```

附带数据：

```
{
  code: 'USER_LOGIN_ANOTHER_DEVICE'
}		
```

#### 登录
```
LAB_IM_CONNECTED
```
附带数据：无

#### 收到新消息

```
LAB_IM_MESSAGE_RECEIVED   		
```

附带数据：无
