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
  ScrollView,
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

function getData() {
  let data = {};
  for (let i = 0; i < 10; ++i) {
    data[i] = _getData();
  }
  return data;
}

const store = {
  user: {
    id: 123,
    name: 'xxx',
    email: 'xxx@xxx.xxx',
    xxx: {
      a: [
        111,
        222,
      ],
      b: {
        xxx: [
          1,
          2,
          3,
        ]
      }
    }
  },
  message: {
    aaa: 111,
    bbb: 'message bbb',
  },
  aaa: {
    aaa: 'aaa',
    bbb: 'bbb',
  }
};

function _getData() {
  return {
      ui_type: "com.CommonPage",
      aaa: "{store.user.xxx['a']}",
      bbb: "{store.user.xxx['a'][0]}",
      ccc: "{store.user.xxx['b'].xxx}",
      ddd: "{store.user.xxx['b'].xxx[0]}",
      content: {
          ui_type: "com.BlockList",
          user_name: '{store.user.name}',
          children: [
            '{store.user.name}',
            {
              ui_type: "com.Swiper",
              style_class: "newsSwiper",
              loop: true,
              autoplay: true,
              autoplayTimeout: 2.5,
              autoplayDirection: true,
              showPagination: true,
              defaultIndex: 0,
              whRatio: 3.5,
              user_email: '{store.user.email}',
              children: [{
                  ui_type: "com.LinkWrapItem",
                  message_aaa: '{store.message.aaa}',
                  children: {
                      ui_type: "com.TextInPicItem",
                      message_bbb: '{store.message.bbb}',
                      image: {
                          ui_type: "com.Image",
                          uri: "http://7xlydk.com1.z0.glb.clouddn.com/1465806365239",
                          quality: 100
                      },
                      title: "测试测试"
                  },
                  link: {
                      id: "42",
                      type: "push",
                      url: "/Content/index/detail/category_id/277/id/42"
                  }
              }, {
                  ui_type: "com.LinkWrapItem",
                  children: {
                      ui_type: "com.TextInPicItem",
                      image: {
                          ui_type: "com.Image",
                          uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464691698876",
                          quality: 100
                      },
                      title: "吸烟对风湿免疫病有哪些影响？"
                  },
                  link: {
                      id: "5",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "com.LinkWrapItem",
                  children: {
                      ui_type: "com.TextInPicItem",
                      image: {
                          ui_type: "com.Image",
                          uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464691714082",
                          quality: 100
                      },
                      title: "常见关节炎的临床特点"
                  },
                  link: {
                      id: "4",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }]
          }, {
              ui_type: "com.BlankBlock",
              height: 10,
              bgColor: "#eee"
          }, {
              ui_type: "fsj.IndexScrollBlock",
              children: [{
                  ui_type: "com.IconImageButton",
                  style_class: "indexScroll",
                  iconName: "",
                  iconSize: 0,
                  iconColor: "",
                  aaa_aaa: '{store.aaa.aaa}',
                  image: {
                      ui_type: "com.Image",
                      uri: "http://7xlydk.com1.z0.glb.clouddn.com/1465805007045",
                      quality: 100,
                      aaa_bbb: '{store.aaa.bbb}',
                  },
                  text: "新闻",
                  textPosition: "bottom",
                  link: {
                      id: "29",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "com.IconImageButton",
                  style_class: "indexScroll",
                  iconName: "",
                  iconSize: 0,
                  iconColor: "",
                  image: {
                      ui_type: "com.Image",
                      uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464603184525",
                      quality: 100
                  },
                  text: "新闻",
                  textPosition: "bottom",
                  link: {
                      id: "28",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "com.IconImageButton",
                  style_class: "indexScroll",
                  iconName: "",
                  iconSize: 0,
                  iconColor: "",
                  image: {
                      ui_type: "com.Image",
                      uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464603193979",
                      quality: 100
                  },
                  text: "新闻",
                  textPosition: "bottom",
                  link: {
                      id: "27",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "com.IconImageButton",
                  style_class: "indexScroll",
                  iconName: "",
                  iconSize: 0,
                  iconColor: "",
                  image: {
                      ui_type: "com.Image",
                      uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464603201273",
                      quality: 100
                  },
                  text: "ACR专题",
                  textPosition: "bottom",
                  link: {
                      id: "7",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "com.IconImageButton",
                  style_class: "indexScroll",
                  iconName: "",
                  iconSize: 0,
                  iconColor: "",
                  image: {
                      ui_type: "com.Image",
                      uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464603207751",
                      quality: 100
                  },
                  text: "工具",
                  textPosition: "bottom",
                  link: {
                      id: "6",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }]
          }, {
              ui_type: "com.BlankBlock",
              height: 10,
              bgColor: "#eee"
          }, {
              ui_type: "fsj.BaseCon",
              title: {
                  ui_type: "com.ListTitleBar",
                  icon: "",
                  image: "",
                  textLeft: "医周头条",
                  textRight: "",
                  lineOfText: 0,
                  iconRight: ""
              },
              content: {
                  ui_type: "com.BlockList",
                  children: [{
                      ui_type: "com.ListMultiLineItem",
                      style_class: "default,indexWeekNews",
                      image: {
                          ui_type: "com.Image",
                          uri: "http://7xlydk.com1.z0.glb.clouddn.com/1465805123927",
                          quality: 100
                      },
                      title: "阿达",
                      textRight: "",
                      lineOfTitle: 2,
                      describe: "按时大大",
                      lineOfDesc: 2,
                      footnote: {
                          ui_type: "com.ListFootnoteItem",
                          date: ""
                      },
                      link: {
                          ui_type: "com.Object",
                          id: "40",
                          type: "push",
                          url: "/Content/Index/detail/category_id/275/id/2",
                          comp: "",
                          data: {
                              ui_type: "com.Object"
                          }
                      }
                  }],
                  separateTop: false,
                  separateBottom: false
              }
          }, {
              ui_type: "com.BlankBlock",
              height: 10,
              bgColor: "#eee"
          }, {
              ui_type: "fsj.BaseCon",
              title: {
                  ui_type: "com.ListTitleBar",
                  icon: "",
                  image: "",
                  textLeft: "热点",
                  textRight: "",
                  lineOfText: 0,
                  iconRight: ""
              },
              content: {
                  ui_type: "com.GridView",
                  style_class: "default,IndexHot",
                  columns: 2,
                  whRatio: 1.625,
                  showGridInnerBorder: true,
                  items: [{
                      ui_type: "com.LinkWrapItem",
                      children: {
                          ui_type: "com.TextInPicItem",
                          style_class: "indexHotList",
                          image: {
                              ui_type: "com.Image",
                              uri: "http://7xlydk.com1.z0.glb.clouddn.com/1465805187825",
                              quality: 100
                          },
                          title: "撒打算"
                      },
                      link: {
                          id: "41",
                          type: "push",
                          url: "/Content/Index/detail/category_id/275/id/2"
                      }
                  }, {
                      ui_type: "com.LinkWrapItem",
                      children: {
                          ui_type: "com.TextInPicItem",
                          style_class: "indexHotList",
                          image: {
                              ui_type: "com.Image",
                              uri: "http://7xlydk.com1.z0.glb.clouddn.com/1464663870493",
                              quality: 100
                          },
                          title: "中国慢性髓性白血病诊疗检测规范"
                      },
                      link: {
                          id: "9",
                          type: "push",
                          url: "/Content/Index/detail/category_id/275/id/2"
                      }
                  }]
              }
          }, {
              ui_type: "com.BlockList",
              children: [{
                  ui_type: "fsj.IndexBaseListItem",
                  textLeft: "强直性脊椎炎的达标治疗",
                  textRight: "1463465193",
                  link: {
                      id: "10",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "fsj.IndexBaseListItem",
                  textLeft: "痛风，如何营养治疗？",
                  textRight: "1463465218",
                  link: {
                      id: "11",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "fsj.IndexBaseListItem",
                  textLeft: "系统性红斑狼疮相关心脏损害",
                  textRight: "1463465259",
                  link: {
                      id: "12",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "fsj.IndexBaseListItem",
                  textLeft: "强直性脊椎炎的达标治疗",
                  textRight: "1463478254",
                  link: {
                      id: "13",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }, {
                  ui_type: "fsj.IndexBaseListItem",
                  textLeft: "痛风，如何营养治疗？",
                  textRight: "1463478306",
                  link: {
                      id: "15",
                      type: "push",
                      url: "/Content/Index/detail/category_id/275/id/2"
                  }
              }],
              separateTop: false,
              separateBottom: true,
              line: {
                  ui_type: "com.Line",
                  size: 1,
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  color: "#eee",
                  direction: "horizontal",
                  lineStyle: "solid"
              }
          }],
          separateTop: false,
          separateBottom: false
      },
      scrollable: true,
      refreshable: false,
      user_id: '{store.user.id}',
  };
}

// 约定subStore上的必须为Object, subStore上的成员的key需符合js变量命名，使用subStore.xxx 获取
const storeReg = /^\{store\.([A-Za-z\d_]+).*\}$/;
const codeSplitReg = /[\.\[\]'"]+/;

function evalStoreCode(store) {
  //console.log('evalStoreCode ', store, arguments[1]);
  //console.time('evalStoreCode');
  try {
    return eval(arguments[1]);
  } catch(e) {
    if (__DEV__) {
      throw e;
    }
  } finally {
    //console.timeEnd('evalStoreCode');
  }
}

function defineStoreGetter(data, key, subStoreName, code, store) {
  let subscripts;
  Object.defineProperty(data, key, {
    get() {
      if (!code) {
        return store[subStoreName];
      }
      if (!subscripts) {
        subscripts = code.split(codeSplitReg);
        if (!subscripts[subscripts.length - 1]) {
          subscripts.pop();
        }
      }
      try {
        let result = store[subStoreName];
        let subscript;
        for (subscript of subscripts) {
          result = result[subscript];
        }
        return result;
      } catch(e) {
        if (__DEV__) {
          throw new Error(`store getter error code:${code} subscripts:${subscripts} error:${e}`);
        }
        //执行出错返回undefined
        //console.warn('exec store code error code:', code, 'subscripts:', subscripts);
      }
    }
  });
}

/**
 *
 */
function r(data, needStoreSet) {
  let key;
  let value;
  let matchResult;
  let subStoreName;
  for (key in data) {
    value = data[key];
    if (!value) {
      continue;
    }
    if (typeof value === 'string') {
      matchResult = storeReg.exec(value);
      if (!matchResult) {
        continue;
      }
      subStoreName = matchResult[1];
      needStoreSet[subStoreName] = true;
      // {store.. = 8
      defineStoreGetter(data, key, subStoreName, value.slice(8 + subStoreName.length, value.length - 1), store);
      continue;
    }
    if (value.ui_type || Array.isArray(value)) {
      r(value, needStoreSet);
    }
  }
}

export default class ReduxTplDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  test1() {
    let data = getData();
    let needStoreSet = Object.create(null);
    console.time('__store');
    //for (let i = 0; i < 10; ++i) {
      r(data, needStoreSet);
    //}
    console.timeEnd('__store');

    //console.log(data);
    console.log(JSON.stringify(data));
    console.log(needStoreSet);
  }

  test2() {
    let obj = {
      aaa: {
        bbb: 'xxx'
      }
    }
    let code = 'obj.aaa.bbb';
    console.time('xxx');
    for (let i = 0; i < 50; ++i) {
      eval(code);
    }
    console.timeEnd('xxx');
  }

  test3() {
    let data = getData();
    let dataStr = JSON.stringify(data);
    console.time('xxx');
    let xxx = JSON.parse(dataStr);
    console.timeEnd('xxx');
  }

  test4() {
    let data = getData();
    let dataStr = JSON.stringify(data);
    let r = /\{store\.([A-Za-z\d_]+).*?\}/g;
    let result;
    console.time('replace store');
    for (let i = 0; i < 10; ++i) {
      result = dataStr.replace(r, function(str) {
        return evalStoreCode(store, str.slice(1, str.length - 1));
      });
    }
    console.timeEnd('replace store');
    //console.log(result);
  }

  test5() {
    var a = [];
    Object.defineProperty(a, 0, {
      get() {
        return 1;
      }
    });
    console.log(a);
    console.log(a.slice());
  }

  test6() {
    alert(performance.now());
  }

  // renderContent() {
  //   return (
  //
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
