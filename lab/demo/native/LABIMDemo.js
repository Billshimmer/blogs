'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  Picker,
  ScrollView,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import IMManager from 'lab4/apis/IM/IMManager';
import ChatView from 'lab4/basiccomps/ChatView/ChatView';

const LABIMModule = NativeModules.LABIMModule;

export default class LABIMDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      chatViewOptions: null,
      firstConverstationText: null,
    };

    this.testInit();
  }

  componentDidMount() {
    super.componentDidMount();
    //订阅事件
    //收到新消息
    IMManager.on(IMManager.MESSAGE_RECEIVED, (data) => {
      console.log('MESSAGE_RECEIVED ', data);
    }, this);
    //最近联系人列表改变
    IMManager.on(IMManager.CONVERSION_LIST_CHANGE, (data) => {
      console.log('CONVERSION_LIST_CHANGE ', data);
    }, this);
    //断开链接(被踢下线)
    IMManager.on(IMManager.DISCONNECTED, (data) => {
      console.log('DISCONNECTED ', data);
    }, this);
    //链接成功
    IMManager.on(IMManager.CONNECTED, (data) => {
      console.log('CONNECTED ', data);
    }, this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    IMManager.offByTag(this);
  }

  testInit() {
    //初始化IMManager
    IMManager.init({
      loginUrl: '/IM/Index/getPassword?LAB_JSON=1', //获取环信账号和密码的接口
      contactInfoUrl: '/IM/Index/contactInfo?LAB_JSON=1&chat_uids=', //获取联系人信息的接口
      chatRecordUrl: '/IM/Index/getChatRecord?LAB_JSON=1', //获取聊天记录的接口
    });
  }

  testLogin() {
    IMManager.login({
      //目前不需要其他参数
    }).then((result) => {
      console.log('login success ', result);
    }).catch((error) => {
      console.log('login error:', error);
    });
    //IMManager.login({userName:'180',password:'ujSIbJUZZDVzJyjjVHYs'},this.callback);
  }

  testLogout() {
    IMManager.logout();
  }

  // 直接登录环信demo
  testLoginXXX() {
    LABIMModule.login({
        imId: 'dansejijie',
        password: 'xhzxzq15',
      }, (error) => {
        console.log('login callback error:', error);
      }
    );
  }

  testGetUnreadMessagesCount() {
    IMManager.getUnreadMessagesCount()
      .then((count) => {
        console.log('getUnreadMessagesCount count:', count);
      })
      .catch((error) => {
        console.log('getUnreadMessagesCount error:', error);
      });
  }

  testGetConversationList() {
    IMManager.getConversationList()
      .then((list) => {
        console.log('getConversationList success:', list);
        if (list.length) {
          this.setState({
            firstConverstationText: list[0].lastMsgContent,
          });
        }
      })
      .catch((error) => {
        console.log('getConversationList error:', error);
      });
  }
//http://img5.imgtn.bdimg.com/it/u=548095586,967520433&fm=21&gp=0.jpg
//http://picm.photophoto.cn/005/008/007/0080071507.jpg
  testShowChatView() {
    this.setState({
      chatViewOptions: {
        //toImId: '10000085', //聊天对象的环信id
        //toAvatar: 'http://img1.imgtn.bdimg.com/it/u=529413645,2972000554&fm=21&gp=0.jpg', //聊天对象的头像url
        //toNickname: 'you', //聊天对象的昵称
        //myAvatar: 'http://picm.photophoto.cn/005/008/007/0080071507.jpg',
        //myNickname: 'me',

        // 环信demo
        toImId:'dansejijie2',
        toAvatar:'http://img1.imgtn.bdimg.com/it/u=529413645,2972000554&fm=21&gp=0.jpg',
        myAvatar:'http://picm.photophoto.cn/005/008/007/0080071507.jpg',
        myNickname:'dansejijie2',
        toNickname:'dansejijie',
      }
    });
  }

  renderContent() {
    let chatView;
    if (this.state.chatViewOptions) {
      chatView = (
        <ChatView
          onAvatarClick={(data) => {
            console.log('onAvatarClick ', data);
          }}
          style={{flex:1}}
          options={this.state.chatViewOptions} />
      );
    }
    return (
      <View style={{flex:1}}>
        {this.renderTestBtns()}
        <Text>{this.state.firstConverstationText}</Text>
        {chatView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  text:{
    fontSize: 40,
    textAlign: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
      marginTop:100,
      height: 40,
      width:200,
      backgroundColor: '#00ffff',
      alignSelf: 'center',
      justifyContent: 'center'
  },
  buttonList:{
    flexDirection:'row',
  }
});
