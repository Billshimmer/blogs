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
  Image as RNImage,
} from 'react-native';

import LAB, {
  Page,
  requireComp,
} from 'lab4';

import img_icon1 from 'lab4/demo/img/icon1.png';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Image = LAB.requireComp('com.Image');

const IMAGE1 = 'http://img2.3lian.com/2014/f6/192/d/110.jpg';
const IMAGE2 = 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg';
const IMAGE3 = 'http://fe.topitme.com/e/41/a5/11263545716bca541eo.jpg';
const QINIU_IMAGE1 = 'http://7xlydk.com1.z0.glb.clouddn.com/1494384997379';
const QINIU_IMAGE2 = 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2016-04-20_57174b8ce0183.jpg';

export default class ImageDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      image: IMAGE1,
      qnUri: QINIU_IMAGE1,
      enableQiniuCompress: true,
      imageStyle: {
        width: 200,
        height: 200,
      },
      onLayout: true,

      xxxUri1: IMAGE1,
      xxxUri2: QINIU_IMAGE1,
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  testPropsChange1() {
    this.setState({
      image: IMAGE2,
      qnUri: QINIU_IMAGE2,
      imageStyle: {
        width: 200,
        height: 150,
      }
    });
  }

  testPropsChange2() {
    this.setState({
      image: IMAGE3,
      qnUri: QINIU_IMAGE1,
      imageStyle: {
        width: 150,
        height: 120,
      }
    });
  }

  testPropsRandomChange() {
    if (Math.random() > 0.5) {
      this.state.qnUri = QINIU_IMAGE1;
    } else {
      this.state.qnUri = QINIU_IMAGE2;
    }
    if (Math.random() > 0.8) {
      this.state.qnSource = {
        uri: this.state.qnUri,
      };
    } else {
      this.state.qnSource = null;
    }
    this.state.enableQiniuCompress = Math.random() > 0.2;
    if (Math.random() > 0.4) {
      let width = this.state.imageStyle.width + 1;
      let height = this.state.imageStyle.height + 1;
      if (width > 300) {
        width = 200;
      }
      if (height > 300) {
        height = 150;
      }
      this.state.imageStyle = {
        width,
        height,
      }
    }
    this.forceUpdate();
  }

  testToggleOnLayout() {
    this.setState({
      onLayout: !this.state.onLayout,
    });
  }

  testToggleEnableQiniuCompress() {
    this.setState({
      enableQiniuCompress: !this.state.enableQiniuCompress,
    });
  }

  testXXX1() {
    // 非七牛图片 <=> 七牛图片
    this.setState({
      xxxUri1: this.state.xxxUri1 === QINIU_IMAGE1 ? IMAGE1 : QINIU_IMAGE1,
    });
  }

  testXXX2() {
    // fixed size
    this.setState({
      xxxStyle: this.state.xxxStyle ? null : {width: 50, height: 50}
    });
  }

  renderXXX() {
    return (
      <View style={{ height: 200, }}>
        <Image
          uri={this.state.xxxUri1}
          enableQiniuCompress={this.state.enableQiniuCompress}
          style={this.state.xxxStyle || {flex: 1}}
        />
      </View>
    );
  }

  renderTest() {
    return (
      <View>
        <Text style={{alignSelf: 'stretch',}}>qnUri: {this.state.qnUri} qnSource: {this.state.qnSource && this.state.qnSource.uri} enableQiniuCompress: {String(this.state.enableQiniuCompress)} imageStyle: {this.state.imageStyle.width} {this.state.imageStyle.height}</Text>
        <Text>com.Image:</Text>
        <Text>七牛:</Text>
        <Image
          uri={this.state.qnUri}
          source={this.state.qnSource}
          style={this.state.imageStyle}
          enableQiniuCompress={this.state.enableQiniuCompress}
          placeholderUri="icon1"
          placeholderSource={img_icon1}
        />
        <View style={[this.state.imageStyle, {padding: 5}]}>
          <Image
            uri={this.state.qnUri}
            source={this.state.qnSource}
            style={this.state.imageStyle}
            enableQiniuCompress={this.state.enableQiniuCompress}
            placeholderUri="icon1"
            placeholderSource={img_icon1}
          />
        </View>
        <Image
          uri={this.state.image}
          placeholderUri="icon1"
          placeholderSource={img_icon1}
          style={this.state.imageStyle}
        />
        <Image
          uri="demo/ic_alarm"
          style={this.state.imageStyle}
        />
        <View style={this.state.imageStyle}>
          <Image
            uri={this.state.image}
            style={{flex: 1, alignSelf: 'stretch'}}
          />
        </View>
        <Image
          style={this.state.imageStyle}
        />
        <Text>RNImage</Text>
        <RNImage
          source={{uri: this.state.image}}
          loadingIndicatorSource={img_icon1}
          defaultSource={img_icon1}
          onLayout={this.state.onLayout ? ((e) => {
            console.log('RNImage onLayout', e.nativeEvent);
          }) : null}
          style={this.state.imageStyle}/>
        {this.renderXXX()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
