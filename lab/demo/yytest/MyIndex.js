import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  LayoutAnimation,
} from 'react-native';

import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-menu';

import {
  Page,
  Link,
  requireComp,
} from 'lab4';

import DrawerLayout from 'react-native-drawer-layout';
var {height, width} = Dimensions.get('window');
const Icon = requireComp('com.Icon');

var icons=['commenting-o','user','asterisk','qq','glass','qq','glass','qq'];
var headText=['消息','联系人','动态'];

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'lab4/basiccomps/TabBar/TabBar';
import SimpleTab from 'lab4/basiccomps/TabBar/SimpleTab';
import SimplePage from 'lab4/demo/SimplePage';
import Test from './Test';
import Select from './Select';
import SelectItem from './SelectItem';

export default class MyIndex extends Page{

  constructor(props, context) {
    super(props, context);
    this.state={
      drawerSlideOutput:null,
      drawerStateChangedOutput:null,
      headText:'消息',
      phone:styles.phone0,
      t1:0,
      t2:2000,
      P1:'black',
      P2:'white',
      select:0,
    }
    this.onPress1=this.onPress1.bind(this);
    this.onPress2=this.onPress2.bind(this);
    this.setSelect=this.setSelect.bind(this);
    this.setMessage=this.setMessage.bind(this);
  }

  setMessage(value){

  }

  setSelect(value){
    this.setState({select:value});
  }

  onPress1(){
    LayoutAnimation.configureNext({duration:700,update:{type:'spring',springDamping:0.6} });
    //LayoutAnimation.spring();
    if(this.state.t1===2000){
      this.setState({t1: this.state.t1-2000,t2: this.state.t2+2000,
                      P1:'black',P2:'white'});
    }

  }
  onPress2(){
    LayoutAnimation.configureNext({duration:700,update:{type:'spring',springDamping:0.6} });
    //LayoutAnimation.spring();
    if(this.state.t1===0){
      this.setState({t1: this.state.t1+2000,t2: this.state.t2-2000,
                      P1:'white',P2:'black'});
    }
  }

  renderContent() {
    var navigationView = (
      <View style={styles.drawer}>
        <Text>Hello there!</Text>
        <TouchableOpacity onPress={() => this.drawer.closeDrawer()}>
          <Text>Close drawer</Text>
        </TouchableOpacity>
      </View>
    )

    return (
      <View style={styles.container}>
        <DrawerLayout
          onDrawerSlide={(e) => this.setState({drawerSlideOutput: JSON.stringify(e.nativeEvent)})}
          onDrawerStateChanged={(e) => this.setState({drawerStateChangedOutput: JSON.stringify(e)})}
          drawerWidth={200}
          ref={(drawer) => { return this.drawer = drawer  }}
          keyboardDismissMode="on-drag"
          renderNavigationView={() => navigationView}>
          <MenuContext style={{ flex:1 }} ref="MenuContext">
            <View style={styles.mainView}>
              <View style={styles.headView}>
                <TouchableOpacity style={{marginLeft:10}} onPress={() => this.drawer.openDrawer()}>
                  <Icon name='qq' size={20}/>
                </TouchableOpacity>
                {
                  this.state.headText==='消息'?(
                    <View style={styles.headTab}>
                      <TouchableOpacity onPress={this.onPress1}>
                        <Text style={[styles.headLeftText,{backgroundColor:this.state.P1,color:this.state.P2}]}>消息</Text>
                      </TouchableOpacity>
                      <View style={{height:30,borderWidth:1,borderColor:'black'}}/>
                      <TouchableOpacity onPress={this.onPress2}>
                        <Text style={[styles.headRightText,{backgroundColor:this.state.P2,color:this.state.P1}]}>电话</Text>
                      </TouchableOpacity>
                    </View>
                  ):
                  (<Text style={styles.headText}>{this.state.headText}</Text>)
                }

                <Menu onSelect={this.setMessage}>
                  <MenuTrigger>
                    <Icon name='plus-square' size={20} style={{marginRight:10}}/>
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={styles.menu}>
                    <MenuOption value="1" style={styles.menuList}>
                      <Text style={styles.menuText}>1</Text>
                    </MenuOption>
                    <MenuOption value="2" style={styles.menuList}>
                      <Text style={styles.menuText}>2</Text>
                    </MenuOption>
                    <MenuOption value="3" style={styles.menuList}>
                      <Text style={styles.menuText}>3</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>

              </View>
              <View>
                <ScrollableTabView
                  renderTabBar={() => {
                    return (
                      <TabBar
                        renderTab={(tab, i, isActive) => {
                          return(
                            <SimpleTab text={tab}
                               activeColor="#26C48B"
                               activeBackgroundColor="rgba(102, 215, 86, 0.41)"
                               icon={icons[i]}/>
                          );
                        }}
                        linePosition="bottom"
                        lineColor="#6B71BA"
                        toggleMode={false}
                        style={{height: 45}}/>
                    );
                  }}
                  onChangeTab={(i) => {
                    this.setState({headText: headText[i.i]});
                  }}
                  tabBarPosition="bottom"
                  style={{
                    height: height-60,
                    backgroundColor:'#f5f5f5',
                  }}
                >
                  <View tabLabel='消息' style={styles.view1}>
                    <View style={[styles.message,{position:'absolute',top:this.state.t1,width:width,bottom:0}]}>
                      <Select style={{backgroundColor:'yellow'}}
                              onSelect={this.setSelect}>
                        <SelectItem value={1}><Text style={{backgroundColor:'green'}}>111</Text></SelectItem>
                        <SelectItem value={2}><Text>222</Text></SelectItem>
                        <SelectItem value={3}><Text>333</Text></SelectItem>
                      </Select>
                      <Text style={{color:'white',fontSize:20}}>{'你按了:'+this.state.select+'(大环境)'}</Text>
                    </View>
                    <View style={[styles.phone,{position:'absolute',top:this.state.t2,width:width,bottom:0}]}>
                      <Text style={{fontSize:30,color:'white'}}>PHONE</Text>
                    </View>
                  </View>
                  <View tabLabel='联系人' style={styles.view2}>

                  </View>

                  <View tabLabel='动态' style={styles.view3}>
                    <Test
                      source={{ uri: 'http://static.open-open.com/lib/uploadImg/20160117/20160117152222_31.png' }}
                    />
                  </View>
                </ScrollableTabView>
              </View>
            </View>
          </MenuContext>
        </DrawerLayout>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    height:height-20,
  },
  drawer:{
    backgroundColor: '#fff',
    height:height-20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu:{
    backgroundColor:'white',
    marginTop:20,
  },
  menuList:{
    borderWidth:3,
    borderColor:'black',
  },
  menuText:{
    fontSize:20,
    fontWeight:'500',
    alignItems: 'center',
  },
  headView:{
    height:40,
    flexDirection:'row',
    backgroundColor:'#00ffff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headTab:{
    flexDirection:'row',
    height:30,
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius:7,
    borderWidth:2,
  },
  headLeftText:{
    fontSize:20,
    height:26,
    padding:2,
  },
  headRightText:{
    fontSize:20,
    height:26,
    padding:2,
  },
  headText:{
    fontSize:20,
    height:26,
    padding:2,
  },
  mainView:{
    flex:1,
    backgroundColor:'white',
  },
  mainText:{
    fontSize:20,
    backgroundColor:'white',
  },
  view1: {
    flex:1,
    backgroundColor:'#e6e6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message:{
    flexDirection:'row',
    backgroundColor:'blue',
  },
  phone:{
    backgroundColor:'black',
  },
  view2: {
    flex:1,
    backgroundColor:'pink',
  },
  view3: {
    flex:1,
    //alignItems:'center',
    //justifyContent:'center',
    backgroundColor:'red',
  },
});
