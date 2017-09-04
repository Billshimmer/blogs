v 1.0.0
    云信 3.5.5
    环信 3.3.0 依赖引入

    uikit 只有 XX xx= NimClient.getInstance().getService(XX.class); 注释掉，其他保持不变
    环信sdk引入在com.netease.nimlib包里

    第一次修改记录:
        1、MessageFragment 里注释了 初始化action的viedeo和Location
        2、修改了viewholder的image的layout布局文件，显示图片控件改为simpleDraweeView
        3、InputPanel 回调接口修改了
        4、MessageListPanel 在接受数据和发送数据时都添加了消息状态监听
        5、MessageListPanel 注释掉长按Item时部分弹框  prepareDialogItems
        6、更改大图查看的activity，使用photoDraweeView
        7、viewholderbase和viewholderText 的背景换了
        8、viewholderbase 的头像控件引用更改了，对应布局也改掉了
        9、注意，用户信息存储在在NimUserInfoCachee里（获取头像链接用），由️DataCacheManager管理。因此先调用DataCacheManager,再创建UserInfo，云信的DataCacheManager是在登陆的时候创建的，还设置了NImUikit.setAccount
            因此在RN里的IMHelper里记得设置，这里的Demo暂且放在Aplication里
        10、DataCacheManager在调用buildCache方法时会去缓存头像文件，由于使用了SimpleDraweeView，所以缓存头像代码被注释了。
        11、InputPanel 里修改表情，并在MsgViewHlderText设置显示表情的显示。
        12、InputPanel 里的录音更改为环信的
        13、修改Action显示的高度：ActionsPagerAdapter和nim_message_activity_actions_layout 布局文件
        14、新增 TFragment和MessageFragment用来继承android.app.Fragmeng
        15、Extras添加环信的常量

    5月9日：
        1、extra里的MsgViewHolderThumbBase里注释了 进度显示文本
        2、MsgViewHolderBase里注释了显示已阅读的代码
        3、修复在第一次加载失败时，失败view一直显示的问题，BaseFechLoadAdapter加了getFetchMoreView函数，在MessageListPanelEx里的refreshMessageListEx函数里使用


    5月24日：
        1、Nuikit->extra引入easeui里的EaseUser、EaseUI
        2、Extras 里参数加入了EaseConstants里的参数
        3、NIMApplication取消了捕获异常功能
        4、labim->LABMModule里在登录成功时调用了云信的代码
        5、DataCacheManager->buildDataCache(),clearDataCache()里注释了缓存头像的代码，因为用了SimpleDraweeView,自带缓存
        6、NimUserInfoCache->addOrUpdateUsers() 方法由private 变成 public
        7、在MessageFragment->parseIntent()里添加了用户信息缓存到内存的方法
        8、NIMApplication->initUIKit()->SessionEventListener 的初始化注释掉，代码移到ChatFragment里，用于用户头像点击事件传递到RN层
        9、MessageFragment里加了reload(anchor)函数，用来在当从服务器获取数据时重新刷新页面显示新的消息
        10、MessageListPanelEx 和MessageFragment里加了getFirstVisibleItem（）函数
        11、MessageListPanelEx里的anchor()方法修改过了,//暂时未实现刷新到上次的最新item
        12、修改了NIMClient里从本地获取会话为空时，返回成功而不是失败。（返回失败会导致第一次见面聊天室因没数据导致显示信息加载失败）
        13、在extra->view里新建了一个MessageView，替代MessageFragment

    6月2日：
        1、IncommingMsgPrompt里的HeadImage采用了自定义的HeadImage（继承SimpleDraweeView）

    6月5日：
        1、MessageBuilder的createEmptyMessage删除了message.setFrom（）方法，因为在EMMessage.createTxtSendMessage("anchor de info",var0);时会本身加上已登录用户的信息
