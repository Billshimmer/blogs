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
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Html = LAB.requireComp('com.Html');

const TEST_HTML1 = `
<p>
<img src="http://oa4rz3xdt.bkt.clouddn.com/1470721734.png" title="1470721734.png" _src="http://oa4rz3xdt.bkt.clouddn.com/1470721734.png" alt="pic_1688_actived.png">
<img src="http://oa4rz3xdt.bkt.clouddn.com/1470721742.png" title="1470721742.png" _src="http://oa4rz3xdt.bkt.clouddn.com/1470721742.png" alt="pic_1688_normal.png">
</p>
`;

const TEST_HTML2 = `
<p>
agwag分公司答复报告附件格式的房价高【啥价格法；是否；个啊；对方公司的房价高
</p>
`;

export default class HtmlDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      //src: "/demo/web/test.html",
      src: '/Content/Edit/Index/category_id/275/id/1',
      styleSheetName: 'sheet1',
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });

    Html.registerStyleSheet({
      sheet1: `p {color: red;}`,
      sheet2: "p {color: green;}",
    });
  }

  test1() {
    this.setState({
      src: '/demo/web/test1.html',
    });
  }

  testChangeStyleSheetName() {
    this.setState({
      styleSheetName: 'sheet2',
    });
  }

  test3() {
  }

  renderTest() {
    return (
      <View style={{flex: 1,}}>
        {this.renderTest5()}
      </View>
    );
  }

  renderTest1() {
    return (
      <Html
        src="http://zgcx.nhfpc.gov.cn/doctorsearch.aspx"
        scrollable={true}
        style={{flex: 1}} />
    );
  }

  renderTest2() {
    return (
      <Html
        src={this.state.src}
        fitContentHeight={true}/>
    );
  }

  renderTest3() {
    return (
      <Html
        src={null}
        html={TEST_HTML1}
        useWebView={false}
        useIframe={true}
        fitContentHeight={true}/>
    );
  }

  renderTest4() {
    return (
      <Html
        html={TEST_HTML2}
        useWebView={true}
        useIframe={false}
        fitContentHeight={true}
        styleSheetName={this.state.styleSheetName}/>
    );
  }

  renderTest5() {
    return (
      <Html
        html={'<p><span style="font-family:宋体, SimSun;font-size:16px;color:#000000">利用<span>VECMDCC GARCHt</span>模型对<span>2013</span>—<span>2015</span>年我国铜期货市场和现货市场的价格动态联动性进行研究：采用<span>Johansen </span>协整检验，对两市场价格序列构建<span>VECM</span>模型，并基于<span>DCC GARCHt</span>模型估算出动态相关系数图。实证分析结果显示：我国铜期货市场与现货市场之间存在着长期均衡关系；期、现货价格之间存在着双向影响关系，且铜期货具有更加显著的价格发现功能；两市场之间呈现出显著和长效的动态联动关系。</span></p><p><br/></p>'}
        useWebView={true}
        useIframe={false}
        fitContentHeight={true}
        styleSheetName="sheetRichText"
        startInLoadingState={true}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
