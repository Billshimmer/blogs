微信使用了完整版,但没有将sdk(libammsdk.jar) 放在libs中,而是使用compile 'com.tencent.wxsdk:wx:+' 方式引入

新浪微博与qq使用精简版

使用微信不要忘记添加WXEntryActivity，与manifest中的WXEntryActivity
qq AuthActivity 与scheme="tencent你的appid"