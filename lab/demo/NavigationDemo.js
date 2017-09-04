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

import BaseViewPager from 'lab4/basiccomps/ViewPager/ViewPager';
const TabBar = requireComp('com.TabBar');
import SimpleTab from 'lab4/basiccomps/TabBar/SimpleTab';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

let demoNumber = 0;

import TestView from './native/views/TestView';

// import PhotoBrowserView from 'lab4/basiccomps/PhotoBrowserView';
// const PHOTOS = [
//   ['http://www.rmzt.com/uploads/allimg/150917/1-15091G10F1.jpg', 'http://img.tuku.cn/file_big/201504/772d5eb2a5ce45b59fa4998c41e51c99.jpg', 'http://img4.imgtn.bdimg.com/it/u=2327492003,3023022027&fm=11&gp=0.jpg'],
//   ['http://www.3lian.com/d/file/201701/03/0f2be5699c075392390d21f2478e8b45.jpg', 'http://pic36.nipic.com/20131218/14154807_222309556183_2.jpg', 'http://tupian.enterdesk.com/2013/mxy/12/10/15/3.jpg'],
// ];

export default class NavigationDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      number: demoNumber++,
      count: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    console.log('NavigationDemo componentWillReceiveProps', this.state.number);
  }

  componentWillFocus() {
    console.log('NavigationDemo componentWillFocus', this.state.number);
  }

  componentDidFocus() {
    console.log('NavigationDemo componentDidFocus', this.state.number);
    // 当界面可见时开始计数
    this._counterId = setInterval(() => {
      this.setState({
        count: this.state.count + 1,
      });
    }, 1000);
  }

  componentWillBlur() {
    console.log('NavigationDemo componentWillBlur', this.state.number);
    // 界面将要不可见时停止计数
    if (this._counterId) {
      clearInterval(this._counterId);
      this._counterId = null;
    }
  }

  componentDidBlur() {
    console.log('NavigationDemo componentDidBlur', this.state.number);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this._counterId) {
      clearTimeout(this._counterId);
    }
  }

  _checkSceneCount(count) {
    let curCount = this.router.getRoutes().length;
    if (curCount < count) {
      console.warn('checkSceneCount curCount:', curCount, 'count:', count);
      return false;
    }
    return true;
  }

  testPush() {
    this.router.push({
      comp: NavigationDemo,
    });
  }

  testPop() {
    this.router.pop();
  }

  testReplace() {
    this.router.replace({
      comp: NavigationDemo,
    });
  }

  testPopToTop() {
    this.router.popToTop();
  }

  testReplaceAtIndex() {
    if (this._checkSceneCount(2)) {
      this.router.replaceAtIndex({
        comp: NavigationDemo,
      }, 1);
    }
  }

  testReplacePrevious() {
    if (this._checkSceneCount(3)) {
      this.router.replacePrevious({
        comp: NavigationDemo,
      });
    }
  }

  testResetTo() {
    let home = this.router.getRoutes()[0];
    this.router.resetTo(home);
  }

  testReset() {
    let home = this.router.getRoutes()[0];
    let newRoutes = [
      home,
      {
        comp: NavigationDemo,
      },
      {
        comp: NavigationDemo,
      },
      {
        comp: NavigationDemo,
      }
    ];
    this.router.reset(newRoutes);
  }

  testPopBack() {
    // 返回两个
    this.router.popBack(2);
  }

  testPopById() {
    // root 是Home的id
    this.router.popById('root');
  }

  testReplacePreviousAndPop() {
    if (this._checkSceneCount(3)) {
      this.router.replacePreviousAndPop({
        comp: NavigationDemo,
      });
    }
  }

  testConcurrent() {
    // 警告不要连续调用router函数(连续调用不能保证堆栈正确) 上面例子应该已经能满足所有需求
    // 这里只是测试
    this.router.push({
        comp: NavigationDemo,
      });
    this.router.push({
        comp: NavigationDemo,
      });
    this.router.push({
        comp: NavigationDemo,
      });
    this.router.pop();
    this.router.pop();
  }

  testConcurrent1() {
    // let home = this.router.getRoutes()[0];
    // this.router.reset([{
    //   comp: NavigationDemo,
    // }]);

    this.router.push({
      comp: NavigationDemo,
    });

    setTimeout(() => {
      this.router.replace({
        comp: NavigationDemo,
        xxx: 1,
      });
    }, 180);
  }

  testXXX() {
    this.setState({
      translateX: this.state.translateX > 1000 ? 100 : 10000,
    });
  }

  testRouteConfig() {
    this.router.push({
      // 目标页面的平台数据
      compData: {
        ui_type: 'com.PhotoBrowserPage',
      },
      data: {
        options: {
          currentIndex: 0,
        },
      }
    });
  }

  renderTest() {
    // <View removeClippedSubviews={true} style={{width: 300, height: 300, backgroundColor: '#03a9f4',}}>
    //   {TestView && <TestView style={{width: 200, height: 200, backgroundColor: 'rgb(0, 188, 212)', margin: 20, transform: [{translateX: this.state.translateX || 0}]}}/>}
    // </View>
    return (
      <View style={{flex: 1,}}>
        <Text>Route key: {this.props.route.key}  Demo number: {this.state.number} count: {this.state.count}</Text>
        {this.renderVP()}
      </View>
    );
  }

  renderVP() {
    if (this.router.getRoutes()[1] !== this.props.route) {
      return null;
    }
    return (
      <VP number={this.state.number}/>
    );
  }

  renderXX() {
    if (this.router.getRoutes()[1] !== this.props.route) {
      return null;
    }
    return (
      <PhotoBrowserView
        options={{
          photos: PHOTOS[0],
          currentIndex: 0,
        }}
        onPhotoTap={() => {
          console.log('onPhotoTap');
        }}
        onPhotoSelected={(e) => {
          console.log('onPhotoSelected', e.nativeEvent);
        }}
        style={styles.container} />
    );
  }
}

class VP extends Component {
  render() {
    if (!this._comp3) {
      this._comp3 = <Comp1 key="3" tabLabel="CCCCCCCCCC"/>;
    }
    return (
      <BaseViewPager
        renderTabBar={() => {
        return (
            <TabBar
              renderTab={(tab, i, isActive) => {
                return <SimpleTab text={`tab ${i}`} activeColor="#26C48B" activeBackgroundColor="rgba(102, 215, 86, 0.41)"/>;
              }}
              onChangeTab={(i, tab) => {
                console.log('onChangeTab i:', i);
              }}
              defaultActiveTab={null}
              linePosition="top"
              lineColor="#6B71BA"
              style={{height: 40}}
            />
          );
        }}
        onChangeTab={(e) => {
          console.log('onChangeTab', e);
        }}
        style={{
          flex: 1,
        }}>

        <Comp1 number={this.props.number} key="1" tabLabel="AAAAAAAAAA"/>
        <Comp1 number={this.props.number} key="2" tabLabel="BBBBBBBBBB"/>
        {this._comp3}
      </BaseViewPager>
    );
  }
}

class Comp1 extends Component {

  static contextTypes = {
    visibleManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    context.visibleManager.on('willShow', () => {
      console.log('Comp1 willShow', this.props.tabLabel, this.props.number);
    }, this);
    context.visibleManager.on('didShow', () => {
      console.log('Comp1 didShow', this.props.tabLabel, this.props.number);
    }, this);
    context.visibleManager.on('willHide', () => {
      console.log('Comp1 willHide', this.props.tabLabel, this.props.number);
    }, this);
    context.visibleManager.on('didHide', () => {
      console.log('Comp1 didHide', this.props.tabLabel, this.props.number);
    }, this);
  }

  componentWillUnmount() {
    this.context.visibleManager.offByTag(this);
  }

  render() {
    //console.log('Comp1 render', this.props.tabLabel);
    return (
      <View {...this.props} style={[{flex: 1}, this.props.style]}>
        <Text style={{fontSize: 20}}>{this.props.tabLabel}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
