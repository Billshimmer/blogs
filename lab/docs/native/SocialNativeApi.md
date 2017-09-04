# Social模块文档 #

## LabSocialModule ##
### login ###

#### 请求参数

| 字段名      | 类型     | 是否必须 | 默认值  | 描述        |
| -------- | ------ | ---- | ---- | --------- |
| platform | string | y    | null | 要登录的第三方平台 |

#### 返回信息

- success

callback(null,successMap)

```
{
  result:data
}
```

- error

callback(errorMap)

```
{ // code is error for login failed
result:{"code":"code",
		"message":"message",
		};
}
```

- cancel

callback(cancelMap)

```
{// code is cancel for login cancel
result:{"code":"code",
		"message":"message",
		};
}
```


## shareDisplayList（弹出分享菜单） ##

#### 请求参数

|   字段名   |  类型  |     描述     |
| :-----: | :--: | :--------: |
| options | json | 分享的平台和分享信息 |

#### 示例

```
{
  //"wx", "qq", "wb", "qzone", "wx_fav", "wx_circle", "sms"
  "platforms": [ // 平台信息
    "qq",
    "sina",
    "qzone"
  ],
  "informations": { // 分享内容
  	"type": "image"/"text"/"web"/"music"/"video"/ ，
  	"url":"url",//通用的Url链接
  	"content":"content"//通用，内容
    "title": "title", //通用,标题
    "imageUrl": "url",// 缩略图
    "targeturl":"targeturl", //网址链接
  }
  /*
  说明：
  1、title为标题，content为内容，targetUrl为我们的应用的网址url，这是通用的
  2、type为image的时候：url为image的url
  3、type为web的时候：url为该网址的url
  4、type为music的时候，url为该音乐链接的url，thumb为该音乐的缩略图
  5、type为video的时候，url为该视频链接的url，thumb为该视频的缩略图
  */
}
```

#### 返回信息

- 分享成功

`callback(null,successMap)`

```
{ // code is success for share success
result:{"code":"code",
		"message":"message",
		};
}
```

- 分享失败

`callback(errorMap)`

```
{ code is error for share failed
result:{"code":"code",
		"message":"message",
		};
}
```

- 分享取消

`callback(cancelMap)`

```
{ code is cancel for share cancel
result:{"code":"code",
		"message":"message",
		};
}
```

## share(单个平台直接分享)

#### 请求参数

|   字段名   |  类型  |     描述     |
| :-----: | :--: | :--------: |
| options | json | 分享的平台和分享信息 |

#### 示例

```
{
  //"wx", "qq", "wb", "qzone", "wx_fav", "wx_circle","sms"
  "platform": "qq",
  "informations": {
  	"type": "image"/"music"，"video"/"text"，
  	"url":"url",//通用的Url链接
  	"content":"content"//通用，内容
    "title": "title", //通用,标题
    "thumb": "url",// 音乐专辑缩略图
    "targeturl":"targeturl", //网址链接
  }
}
```

#### 友盟回调

- 分享成功

`callback(null,successMap)`

```
{ // code is success for share success
result:{"code":"code",
		"message":"message",
		};
}
```

- 分享失败

`callback(errorMap)`

```
{ code is error for share failed
result:{"code":"code",
		"message":"message",
		};
}
```

- 分享取消

`callback(cancelMap)`

```
{ code is cancel for share cancel
result:{"code":"code",
		"message":"message",
		};
}
```
