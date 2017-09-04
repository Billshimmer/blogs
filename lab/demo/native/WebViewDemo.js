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
  MapView,
} from 'react-native';
import LAB, {
  Page,
  Link,
  DI,
} from 'lab4';

import LABWebView from 'lab4/basiccomps/WebView/WebView'

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const TEST_HTML1 = `
<html lang="zh-CN" style="font-size: 100px;"><head>
  <title>抢先拍</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Cache-Control" content="no-transform ">
  <meta http-equiv="pragma" content="no-cache">
  <meta name="format-detection" content="telephone=no">
  <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
  <link rel="shortcut icon" href="/favicon.ico">
    <link rel="stylesheet" type="text/css" href="/LABPublic/css/lab.css?24993">
  <link rel="stylesheet" type="text/css" href="/Public/css/mobile/qxp.css?24993">
  <script src="//hm.baidu.com/hm.js?e8409913dee7003e6ceb86548c878778"></script><script type="text/javascript" src="/Public/js/lib/jquery.min.js?24993"></script>
  <script type="text/javascript" src="/LABPublic/js/fastclick.min.js?24993"></script>
  <!--<script type="text/javascript" src="/LABPublic/js/lab.12.js?24993"></script>-->
  <script type="text/javascript" src="/LABPublic/js/lab.web.12.js?24993"></script>
  <script type="text/javascript" src="/Public/js/mobile/common.js?24993"></script>
  </head>
<body>
<script>
/*(function (doc, win){
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = (100 * clientWidth / 375) + 'px';
    };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/

(function (doc, win){
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',

    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = (100 * clientWidth / 375) + 'px';
    };
    recalc();

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
</script>
<div id="lab-page">

<script type="text/javascript" src="/Public/js/mobile/jweixin-1.0.0.js"></script>
<style type="text/css">
.show-warp{
    padding: 10px 10px 20px 10px;
    background: #fff;
}
.show-warp .title{
    padding: 10px 0;
    color:#222;
    font-size: 20px;
    line-height: 28px;
}
.show-warp .date{
    color:#999;
    font-size: 14px;
}
.show-warp .hr{
    width: 100%;
    height: 1px;
    margin: 10px 0;
    background-color: #efefef;
}
.show-warp .content{
	font-size: 14px;
}
.show-warp .content img{
    max-width: 100% !important;
}
.show-warp .content p{
    font-size: 14px;
    padding-bottom: 10px;
    word-wrap:break-word;
}
.home{
    background-image: url('/Public/img/icon_share_home.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 22px;
}
.share{
    background-image: url('/Public/img/icon_share.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 18px;
}
/*视频播放*/
.video-warp{
    display: none;
    position: relative;
    width: 100%;
    height: 2.1094rem;
    background: #000;
    margin-bottom: 10px;
}
.video-warp .video-cover{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 333;
    width: 100%;
    height: 100%;
}
.video-warp .default-cover{
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 444;
    width: 100%;
    height: 100%;
}
.video-warp video{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 222;
    width: 100%;
    height: 100%;
}
.qxp-download {
  display: none;
}

.content img {
  height: 150px;
}
</style>
	<header class="dev-box dev-header">
	<a class="dev-header-l l-normal" lab-window-pop=""></a>
	<div class="dev-box-flex dev-header-c">新闻热点</div>
	<a class="dev-header-r" onclick="shareIt(&quot;涨!!!21家房企上半年销售同比增七成 下半年涨价欲望强烈&quot;,&quot;上半年在地方政府普遍推行的“因城施策”政&quot;,&quot;http://wx.qiangxianpai.com/House/News/showNews/catid/10/id/700/downloadApp/1.html&quot;,&quot;http://7xo7rx.com2.z0.glb.qiniucdn.com/2016-07-11_5783101575d27.jpg&quot;);"></a>
</header>
<div id="dev-blank-box" style="height:47px;width:100%;background:#fff;"></div>


	<div class="show-warp" id="700">
        <div class="title">涨!!!21家房企上半年销售同比增七成 下半年涨价欲望强烈</div>
        <div class="date">2016-07-11 11:18</div>
        <div class="hr"></div>
        <div class="video-warp">
            <img class="default-cover" src="/Public/img/default_cover.png?imageView2/2/w/480" onclick="autoPlayVideo();">
            <img class="video-cover" src="/Public/img/video_cover.png?imageView2/2/w/480">
            <video controls="controls" webkit-playsinline=""></video>
        </div>
        <div class="content"><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);"><img src="http://7xo7rx.com2.z0.glb.qiniucdn.com/1468200391.gif?imageView2/2/w/750/q/100" title="1468200391.gif" alt="顶部-.gif" lab-photoview="http://7xo7rx.com2.z0.glb.qiniucdn.com/1468200391.gif"></span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);">&nbsp; &nbsp; &nbsp;上半年在地方政府普遍推行的“因城施策”政策推行下，房地产市场行情向好。最新统计数据显示：已经公布6月销售简报的恒大、万科、碧桂园等21家房企，上半年业绩全面提升。</span><img src="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070108.png?imageView2/2/w/750/q/100" title="1468206923.jpg" alt="b6.jpg" lab-photoview="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070108.png"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);"> &nbsp; &nbsp; &nbsp;数据 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;显示，21家企业合计销售业绩高达9069.36亿，同比2015年同期的5197.35亿上涨幅度达到74.5%，而销售面积也达到了7837.52万平方米，同比上涨53.4%。21家企业中，同比涨幅超过一倍的企业有8家，分别是：金茂、碧桂园、融创、龙光、时代、新城、中骏、瑞安等。</span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);">　　在公布上半年业绩的同时，碧桂园等房企上调全年销售目标。其中碧桂园从原定的1680亿元提高到2200亿元，上调幅度为31%；旭辉控股上调2016年全年合同销售目标20%，由原定的365亿元，提升至438亿元。</span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);">　　专家分析认为，上半年一二线城市房地产市场火爆，令上市房企销售业绩全面提升。“因为上半年任务完成较好，很多企业下半年可能有非常强烈的涨价需求。”</span><img src="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070112.png?imageView2/2/w/750/q/100" title="1468206947.jpg" alt="b5.jpg" lab-photoview="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070112.png"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);"> &nbsp; &nbsp; &nbsp;&nbsp;</span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);">&nbsp; &nbsp; &nbsp; &nbsp;中国指数研究院近日发布的上半年统计数据显示，上半年百城住宅均价环比涨幅进一步扩大，3月环比涨幅突破1%，5月同比涨幅突破10%。根据中指数系统对100个城市的全样本调查数据显示，2016年以来，百城住宅均价环比持续上涨，上半年累计上涨7.61%。其中，一季度累计上涨2.94%，3月环比涨幅达到历史最高点，为1.90%；二季度保持较高涨幅，累计上涨4.54%。同比来看，自2015年8月百城住宅价格同比止跌转涨以来连续11个月上涨，且涨幅持续扩大，今年5月涨幅突破10%，6月涨幅继续扩大，至11.18%。</span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);">　　中指院分析认为，上半年，在房地产政策全面宽松的背景下，房地产企业紧抓去库存机遇，热点城市业绩贡献显著拉升总体业绩，同时城市价格上行也进一步提升了销售额。截至6月30日，销售额超过50亿的企业达到115家，比去年同期增加了46家。其中，受监测品牌房企的销售目标平均完成率为60%，远超往年平均完成率。<img src="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070113.png?imageView2/2/w/750/q/100" title="1468206972.jpg" alt="b7.jpg" lab-photoview="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070113.png"></span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);"> &nbsp; &nbsp; &nbsp; &nbsp;上半年，销售业绩的持续走高刺激了房企的补仓意愿，同时融资环境的宽松也使得房企资金面明显改善，今年以来房企债务融资规模较往年大幅提升，且融资成本明显降低。其中，保利5年期公司债票面利率已经低至2.95%，房企拿地动作也明显频繁。上半年，20家大型房企合计拿地4883万平方米，耗资2260亿元，分别同比增长39.3%、33.6%。拿地重心向二线城市转移，拿地金额占比超60%，而一线城市的拿地占比明显下降，占比不足20%。</span></p><p style="margin-bottom: 15px; line-height: 2em; text-indent: 0em;"><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);">　 &nbsp;“随着国内房地产市场结束快速增长期，行业竞争加剧，房地产企业并购重组案例日渐增多，大型房企‘大鱼吃小鱼’的并购现象与合纵连横的强强联合已成为新常态”。中指院分析指出，今年以来以中海、中信为代表的大型房企通过兼并重组形成行业大鳄的趋势显现，未来行业竞争格局将持续升级。</span></p><p><span style="font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px; color: rgb(63, 63, 63);"><span style="font-size: 18px; font-family: 微软雅黑, 'Microsoft YaHei'; margin: 0px; padding: 0px; text-align: right; white-space: pre-wrap; background-color: rgb(255, 255, 255);">来源：</span><span style="font-size: 18px; font-family: 微软雅黑, 'Microsoft YaHei'; margin: 0px; padding: 0px; text-align: right; white-space: pre-wrap; border: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); background-color: rgb(255, 255, 255);">经济参考报</span></span><span style="margin: 0px; padding: 0px; font-family: 宋体; font-size: 14px; text-align: right; white-space: pre-wrap; border: 0px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); color: rgb(141, 141, 141); background-color: rgb(255, 255, 255);"><img src="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070121.png?imageView2/2/w/750/q/100" title="1468200130.gif" alt="lAHOO-2cO80DQc0DHw_799_833.gif" style="line-height: 32px; text-indent: 32px; white-space: normal;" lab-photoview="http://7xo7rx.com2.z0.glb.qiniucdn.com/14682070121.png"></span></p></div>
    </div>
    <div class="qxp-download">
        <a class="qxp-down-box" href="/download.php">
            <img class="down-icon" src="/Public/img/icon_share_app.png">
            <div class="down-info">
                <h4>抢先拍 | <span>超值资产,抢先一步</span></h4>
                <p class="extra-info">全国领先的价值资产交易服务平台</p>
            </div>
            <div class="goto-down"></div>
            </a><a class="goto-down-info">立即下载</a>
            <div class="close-icon" onclick="closeDownApp(event)"></div>

    </div>
    <div id="lab_share_data" style="display:none;"></div>
<script type="text/javascript">
</script>

</body></html>
`;

const TEST_HTML2 = `
<p> adifjadjf;adjgkaga asdfa dgdg sdfg d gjds;fdg jdsfd jsd;fgj f;g jfg; sjf;g j;fsgjgja;g af;g j;dfjg ;sdfgja gag ;ja</p>
`;

const TEST_HTML3 = `
<p><img src="http://oa4rz3xdt.bkt.clouddn.com/1474163772935?imageView2/0/w/2048/h/2048" _src="http://oa4rz3xdt.bkt.clouddn.com/1474163772935?imageView2/0/w/2048/h/2048"/></p>
`;

const TEST_HTML4 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>hello</title>
  <style>
    body, html {
      background-color: rgba(0, 0, 0, 0);
    }
  </style>
</head>
<body>
  <p style="height: 300px;">hello</p>
</body>
</html>
`;

const HTMLS = [TEST_HTML2, TEST_HTML3, TEST_HTML4];

const URLS = ['http://example.com', 'https://www.baidu.com'];

export default class WebViewDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this.state = {
      source: {
        uri: URLS[0],
      },
      fitContentHeight: false,
      externalOpenUrl: false,
    };

    this.configPage({
      scrollable: true,
    });
    
    this._onLoadRequest = this._onLoadRequest.bind(this);
  }

  testChangeUri() {
    this.setState({
      source: {
        uri: URLS[(Math.random() * URLS.length) << 0],
      }
    });
  }

  testChangeHtml() {
    this.setState({
      source: {
        html: HTMLS[(Math.random() * HTMLS.length) << 0],
        baseUrl: 'http://example.com'
      },
    });
  }

  testToggleExternalOpenUrl() {
    this.setState({
      externalOpenUrl: !this.state.externalOpenUrl,
    });
  }

  testToggleFitContentHeight() {
    this.setState({
      fitContentHeight: !this.state.fitContentHeight,
    });
  }

  testToggleOnloadRequest() {
    this.setState({
      onLoadRequest: this.state.onLoadRequest ? null : this._onLoadRequest,
    });
  }

  _onLoadRequest(event) {
    console.log('onLoadRequest', event.nativeEvent);
    DI.getExternalLinkManager().handleExternalLink({
      url: event.nativeEvent.url,
    });
  }

  renderTest() {
    return (
      <View
        style={{
          height: this.state.fitContentHeight ? null : 600,
          backgroundColor: '#5E80CD',
        }}>
        <LABWebView
          source={this.state.source}
          fitContentHeight={this.state.fitContentHeight}
          externalOpenUrl={this.state.externalOpenUrl}
          bounces={false}
          onLoadRequest={this.state.onLoadRequest}
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
