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
  ListView,
} from 'react-native';

import LAB, {
  Page,
  Link,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import Collapsible from 'lab4/basiccomps/Collapsible/Collapsible';
import LABRichText from 'lab4/basiccomps/RichText/RichText';

const ViewPager = requireComp('com.ViewPager');

const TEST_HTML1 = `
  <div>
    <p style="margin-bottom: 10px; line-height: 2em; text-indent: 2em;"><span style="color: rgb(63, 63, 63); font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px;">而且从目前的发展形势来看，这些趋势并没有明显的放缓迹象。交通银行董事长牛锡明就认为“银行业的不良贷款并没有到底，风险并没有完全的释放”。对于中国银行业而言，当前正是风险管理的关键时期，“谁风险管理得好、质量稳定，谁就是赢家。”</span></p>
    <p style="margin-bottom: 10px; line-height: 2em; text-indent: 2em;"><span style="color: rgb(63, 63, 63); font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 18px;">其实针对中国银行业出现的问题，监管层对其疏导调整的力度一直未有减弱。人民银行副行长张涛6月份已明确表示，“要建设与整个金融体系相配套的退出机制，对于经营出现风险、经营出现失败的金融机构，要建立有序的处置和退出框架，允许金融机构有序破产。”</span></p>
  </div>
`;
const TEST_HTML2 = `
<body>
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

</body>
`;

// 超大图片
const TEST_HTML3 = `<p><img src="http://oa4rz3xdt.bkt.clouddn.com/1473150561695" _src="http://oa4rz3xdt.bkt.clouddn.com/1473150561695"/></p>`;
const TEST_HTML4 = `<p style="margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);">&nbsp; &nbsp; &nbsp;随着汽车逐渐的进入到我们的生活中，它不但可以提供愉悦的驾驶乐趣，还可以带来舒适的乘坐感受，然而我们还要看到的它的危险性，在中国每年因为车祸失去生命的人超过很多疾病，这是一个非常可怕的数字。我们在学会正确使用车辆的同时还需要了解一些最基本的安全知识，并且当遭遇车祸时了解应该如何逃生也是每一个驾驶员和乘客需要牢记的，今天我们就来简单的说说这方面的知识。</p><p style="text-align:center;margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);"><a href="http://www.autohome.com.cn/img/?img=2012/8/15/15-15-5-17-50181871.jpg" target="_blank" style="color: rgb(59, 89, 152); outline: 0px; text-decoration: none;"><img alt="" src="http://7xlydk.com1.z0.glb.clouddn.com/14725607730.png" width="500" height="550" original="http://img.autohome.com.cn/2012/8/15/15-15-5-17-799356378.jpg" style="border: 1px solid rgb(0, 0, 0); vertical-align: top; display: inline-block; background-image: url(http://x.autoimg.cn/news/show20/1210/default_bg.png); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: 50% 50%; background-repeat: no-repeat;"/></a></p><p style="margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);">　　其实，我们谁也不想发生意外，谁也不愿意主动的发生事故，但有的车祸却是从天而降，我们根本无法避免，所以当发生车祸时，掌握一些求生知识，可以帮助你在困境中逃生。在这里说谈到的车祸，基本上指的是车内的成员还有生命迹象，或者不是非常严重的车祸。当然，在原地等待救援肯定是正确的做法，但是如果车辆有爆炸或者起火的危险，那么原地等待无疑就是在送死，所以如果有能力还是要尽最大的努力先逃离被撞车辆。</p><p style="text-align:center;margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);"><a href="http://www.autohome.com.cn/img/?img=2012/8/15/15-16-1-37-614155841.jpg" target="_blank" style="color: rgb(59, 89, 152); outline: 0px; text-decoration: none;"><img alt="" width="500" height="759" original="http://img.autohome.com.cn/2012/8/15/15-16-1-38-868283307.jpg" src="http://7xlydk.com1.z0.glb.clouddn.com/14725607746.png" style="border: 1px solid rgb(0, 0, 0); vertical-align: top; display: inline-block; background-image: url(http://x.autoimg.cn/news/show20/1210/default_bg.png); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: 50% 50%; background-repeat: no-repeat;"/></a></p><p style="margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);">　　<strong>在介绍所有的求生知识前，我们还是要重点的说明一下那个老生常谈的问题，只要在车上就应当随时都系紧<a class="ShuKeyWordLink" href="http://car.autohome.com.cn/shuyu/detail_16_17_833.html" target="_blank" style="color: rgb(51, 51, 51); outline: 0px; text-decoration: none; border-bottom-width: 1px; border-bottom-style: dotted; border-bottom-color: rgb(59, 89, 152);">安全带</a>，因为无论是静止被撞还是行驶中撞击，<a class="blackclink" href="http://car.autohome.com.cn/shuyu/detail_16_17_833.html" target="_blank" style="color: rgb(51, 51, 51); outline: 0px; text-decoration: none;">安全带</a>是最有效的安全设施。除此之外，建议大家还是要遵守交通法规，不超速、不违章行驶，将发生事故的几率降到最低，求生的技巧无处施展才是最好的。</strong></p><p style="text-align:center;margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);"><a href="http://www.autohome.com.cn/img/?img=2012/8/15/15-15-46-31-7021371.jpg" target="_blank" style="color: rgb(59, 89, 152); outline: 0px; text-decoration: none;"><img alt="" width="500" height="353" original="http://img.autohome.com.cn/2012/8/15/15-15-46-32-45189770.jpg" src="http://7xlydk.com1.z0.glb.clouddn.com/14725607745.png" style="border: 1px solid rgb(0, 0, 0); vertical-align: top; display: inline-block; background-image: url(http://x.autoimg.cn/news/show20/1210/default_bg.png); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: 50% 50%; background-repeat: no-repeat;"/></a></p><p style="text-align:center;margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);"><a href="http://www.autohome.com.cn/use/201204/315658.html" target="_blank" style="color: rgb(59, 89, 152); outline: 0px; text-decoration: none;"><img title="驾校不教的知识(8)安全带正确使用方法" border="0" alt="驾校不教的知识(8)安全带正确使用方法" width="500" height="200" original="http://img.autohome.com.cn/2012/8/15/15-16-31-46-682276848.jpg" src="http://7xlydk.com1.z0.glb.clouddn.com/14725607749.png" style="border: 1px solid rgb(0, 0, 0); vertical-align: top; display: inline-block; background-image: url(http://x.autoimg.cn/news/show20/1210/default_bg.png); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: 50% 50%; background-repeat: no-repeat;"/></a></p><p style="margin-top: 15px; margin-bottom: 15px; padding: 0px; line-height: 28px; color: rgb(51, 51, 51); font-family: 宋体, arial, tahoma, sans-serif; white-space: normal; widows: 1; background-color: rgb(255, 255, 255);">　　在目前国内很少关于车祸如何自救的相关资料，可以说是非常不健全的，也没有相关部门宣传和教育大家在车祸发生时应该如何处理。所以我们今天通过国外的一些资料简单的学习一下如何在发生车祸之后自救的知识。下面看一段视频，就是我们都熟悉的贝尔《自救手册》里讲解的一些内容。</p><p><br/></p>`;

const TEST_HTMLS = [
  TEST_HTML1,
  TEST_HTML2,
  TEST_HTML3,
  TEST_HTML4,
];

export default class RichTextDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this._index = 0;
    this.state = {
      text: TEST_HTML4,
      collapsed: false,
    };

    this.configPage({
      scrollable: true,
    });
  }

  test1() {
    this._index = (++this._index) % TEST_HTMLS.length;
    this.setState({
      text: TEST_HTMLS[this._index],
    });
  }

  test2() {
    this.setState({
      text: TEST_HTML3,
    });
  }

  test3() {
    this.setState({

    });
  }

  testCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  renderContent() {
    return (
      <View style={{}}>
        {this.renderTestBtns()}
        <Collapsible
         collapsed={this.state.collapsed}
         style={{height: 400}}>
         <View style={{width: 300, height: 300, backgroundColor: '#00acc1',}}>
         <LABRichText
           text={this.state.text}
           style={{backgroundColor: '#E9E9E9'}}
         />
         </View>
        </Collapsible>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
