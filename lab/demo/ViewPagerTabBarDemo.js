'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  ViewPagerAndroid,
} from 'react-native';

import { Page, requireComp } from 'lab4';

import BaseTabBar from 'lab4/basiccomps/TabBar/TabBar';
import BaseScrollableTabBar from 'lab4/basiccomps/TabBar/ScrollableTabBar';
import BaseViewPager from 'lab4/basiccomps/ViewPager/ViewPager';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const ViewPager = requireComp('com.ViewPager');
const TabBar = requireComp('com.TabBar');
import SimpleTab from 'lab4/basiccomps/TabBar/SimpleTab';

const List = requireComp('com.List');

export default class ViewPagerTabBarDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      curTab: 0,
      tabs: [1, 2, 3],
      scrollableTabs: [
        '111',
        '2222',
        '3333333',
        '4444444444444',
        '555',
        '66666666666666',
        '777777',
      ],
    };
  }

  test1() {
    this.refs.view_pager.goToPage((Math.random() * 4) << 0);
  }

  testChangeTabs() {
    if (Math.random() > 0.4) {
      this.state.tabs.push(
        this.state.tabs[this.state.tabs.length - 1] + 1 || 0
      );
    } else {
      this.state.tabs.pop();
    }
    this.forceUpdate();
  }

  testChangeScrollableTabBarTabCount() {
    this.state.scrollableTabs.push('xxxxxxx');
    this.forceUpdate();
  }

  testXXX() {
    this.refs._aaa.forceUpdate();
  }

  testYYY() {
    this.refs.vpa.setPage(1);
  }

  _onLayout(e) {
    console.log('ccc onLayout', e.nativeEvent);
  }

  renderTest() {
    return this.renderDemo();
    // return this.renderBaseViewPager1();
    // return this.renderBaseViewPager();
  }

  render1() {
    return (
      <TabBar
        tabs={this.state.tabs}
        renderTab={(tab, i, isActive, onPress) => {
          return (
            <Text style={{ color: isActive ? '#5C9E39' : '#333' }}>
              tab:{tab}
            </Text>
          );
        }}
        onWillChangeTab={(index, oldIndex, isPress) => {
          // 在active tab将要改变时回调， 返回false 则阻止改变
          // if (index == 1) {
          //   return false;
          // }
        }}
        onChangeTab={(index, oldIndex, tabData, isPress) => {
          console.log('onChangeTab index:', index);
          //this.setState({curTab: index});
        }}
        //activeTab={this.state.curTab}
        defaultActiveTab={2}
        linePosition="bottom"
        lineColor="#6B71BA"
        toggleMode={true}
        style={{ height: 35, marginBottom: 20 }}
      />
    );
  }

  render2() {
    return (
      <TabBar
        scrollable={true}
        // items={['111', '2222', '3333333']}
        items={this.state.scrollableTabs}
        renderTab={(tab, i, isActive, onPress) => {
          return (
            <Text style={{ color: isActive ? '#5C9E39' : '#333' }}>
              tab:{tab}
            </Text>
          );
        }}
        onChangeTab={(i, tab) => {
          console.log('onChangeTab i:', i);
          //this.forceUpdate();
        }}
        defaultActiveTab={2}
        linePosition="bottom"
        lineColor="#6B71BA"
        toggleMode={true}
        enableLineAnimation={true}
        style={{ marginBottom: 20, height: 50 }}
      />
    );
  }

  render3() {
    return (
      <ViewPager
        ref="view_pager"
        locked={false}
        scrollWithoutAnimation={false}
        renderTabBar={() => {
          return (
            <TabBar
              renderTab={(tab, i, isActive) => {
                return (
                  <SimpleTab
                    text={`tab ${i}`}
                    activeColor="#26C48B"
                    activeBackgroundColor="rgba(102, 215, 86, 0.41)"
                  />
                );
              }}
              onChangeTab={(i, tab) => {
                console.log('tabBar onChangeTab i:', i);
              }}
              defaultActiveTab={null}
              linePosition="top"
              lineColor="#6B71BA"
              style={{ height: 40 }}
            />
          );
        }}
        style={{
          height: 300,
          flex: null,
        }}
        onChangeTab={(i, tab) => {
          console.log('ViewPager onChangeTab i:', i);
        }}
      >
        <Text>111</Text>
        <Text>222</Text>
        <Text>333</Text>
        <View style={{ flex: 1 }}>
          <TouchableHighlight
            style={{ height: 50 }}
            onPress={() => {
              console.log('xxxxx');
            }}
          >
            <Text>xxxxxxxx</Text>
          </TouchableHighlight>
        </View>
      </ViewPager>
    );
  }

  renderDemo() {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={e => {
          console.log('xxx onLayout', e.nativeEvent);
        }}
      >
        {this.render1()}
        {this.render2()}
        {this.render3()}

      </View>
    );
  }

  renderBaseViewPager() {
    // return (
    //   <ScrollView
    //     horizontal
    //     style={{width: 300, height: 300,}}
    //     >
    //     <Comp1 key="1" tabLabel="AAAAAAAAAA" style={{width: 375}}/>
    //     <Comp1 key="2" tabLabel="BBBBBBBBBB"/>
    //   </ScrollView>
    // );
    return (
      // <BaseViewPager
      //   renderTabBar={() => {
      //     return (
      //       <TabBar
      //         renderTab={(tab, i, isActive) => {
      //           return <SimpleTab text={`tab ${i}`} activeColor="#26C48B" activeBackgroundColor="rgba(102, 215, 86, 0.41)"/>;
      //         }}
      //         onChangeTab={(i, tab) => {
      //           console.log('onChangeTab i:', i);
      //         }}
      //         defaultActiveTab={null}
      //         linePosition="top"
      //         lineColor="#6B71BA"
      //         style={{height: 40}}
      //        />
      //     );
      //   }}
      //   onChangeTab={() => {
      //     this.forceUpdate();
      //   }}
      //   style={{
      //     height: 400,
      //     flex: null,
      //   }} >
      (
        <BaseViewPager
          renderTabBar={() => {
            return (
              <TabBar
                renderTab={(tab, i, isActive) => {
                  return (
                    <SimpleTab
                      text={`tab ${i}`}
                      activeColor="#26C48B"
                      activeBackgroundColor="rgba(102, 215, 86, 0.41)"
                    />
                  );
                }}
                onChangeTab={(i, tab) => {
                  console.log('onChangeTab i:', i);
                }}
                defaultActiveTab={null}
                linePosition="top"
                lineColor="#6B71BA"
                style={{ height: 40 }}
              />
            );
          }}
          onChangeTab={() => {
            this.forceUpdate();
          }}
          style={{}}
        >
          <BaseViewPager
            renderTabBar={() => {
              return (
                <TabBar
                  renderTab={(tab, i, isActive) => {
                    return (
                      <SimpleTab
                        text={`tab ${i}`}
                        activeColor="#26C48B"
                        activeBackgroundColor="rgba(102, 215, 86, 0.41)"
                      />
                    );
                  }}
                  onChangeTab={(i, tab) => {
                    console.log('onChangeTab i:', i);
                  }}
                  defaultActiveTab={null}
                  linePosition="top"
                  lineColor="#6B71BA"
                  style={{ height: 40 }}
                />
              );
            }}
            onChangeTab={e => {
              console.log('viewPager 1 onChangeTab', e);
              // this.forceUpdate();
            }}
            style={{
              flex: 1,
            }}
            testID="scroll1"
          >

            <View style={{ flex: 1, backgroundColor: '#B98292' }}>
              <List
                defaultItems={[
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                  {
                    text: '111',
                  },
                ]}
                refreshable={true}
                renderRow={(rowData, sectionID, rowID, highlightRow) => {
                  return (
                    <Text style={{ padding: 20, fontSize: 18 }}>
                      rowID: {rowID} text: {rowData.text}
                    </Text>
                  );
                }}
                testID="list"
              />
            </View>
            <Text>BBBBBBB</Text>
            <Text>CCCCCCC</Text>
            <Text>DDDDDDD</Text>
          </BaseViewPager>
          <Text>BBBBBBB</Text>
          <Text>CCCCCCC</Text>
          <Text>DDDDDDD</Text>
        </BaseViewPager>
      )
      //   <Text>BBBBBBB</Text>
      //   <Text>CCCCCCC</Text>
      //   <Text>DDDDDDD</Text>
      // </BaseViewPager>
    );
  }

  renderBaseViewPager1() {
    return <AAA ref="_aaa" />;
    // return (
    //   <View
    //     removeClippedSubviews={true}
    //     testID={"aaaa"}
    //     style={{flex: 1,}}
    //     >
    //     <ViewPagerAndroid
    //       ref="vpa"
    //       onPageSelected={(e) => {
    //         console.log('ViewPagerAndroid onPageSelected', e.nativeEvent);
    //       }}
    //       testID={"bbbb"}
    //       style={{flex: 1}}>
    //       <View testID={"1111"} style={{backgroundColor: '#4caf50',}}>
    //       </View>
    //       <View style={{backgroundColor: '#2196f3',}}>
    //       </View>
    //     </ViewPagerAndroid>
    //     <View testID={"cccc"} style={{height: 100, backgroundColor: '#2196f3',}}>
    //     </View>
    //   </View>
    // );
  }
}

class AAA extends Component {
  render() {
    if (!this._comp3) {
      this._comp3 = <Comp1 key="3" tabLabel="CCCCCCCCCC" />;
    }
    return (
      <View style={{ flex: 1 }}>
        <BaseViewPager
          onChangeTab={e => {
            console.log('onChangeTab', e);
          }}
          style={{
            flex: 1,
          }}
        >

          <Comp1 key="1" tabLabel="AAAAAAAAAA" />
          <Comp1 key="2" tabLabel="BBBBBBBBBB" />
          {this._comp3}
        </BaseViewPager>
      </View>
    );
  }
}

class Comp1 extends Component {
  static contextTypes = {
    visibleManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    context.visibleManager.on(
      'willShow',
      () => {
        console.log('Comp1 willShow', this.props.tabLabel);
      },
      this
    );
    context.visibleManager.on(
      'didShow',
      () => {
        console.log('Comp1 didShow', this.props.tabLabel);
      },
      this
    );
    context.visibleManager.on(
      'willHide',
      () => {
        console.log('Comp1 willHide', this.props.tabLabel);
      },
      this
    );
    context.visibleManager.on(
      'didHide',
      () => {
        console.log('Comp1 didHide', this.props.tabLabel);
      },
      this
    );
  }

  componentWillUnmount() {
    this.context.visibleManager.offByTag(this);
  }

  render() {
    console.log('Comp1 render', this.props.tabLabel);
    return (
      <View {...this.props} style={[{ flex: 1 }, this.props.style]}>
        <Text style={{ fontSize: 20 }}>{this.props.tabLabel}</Text>
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
