'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TextInput,
  TouchableWithoutFeedback,
  Picker,
  Image,
  ActivityIndicator,
  Switch,
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from '../SimplePage';
import TestHelper from '../TestHelper';

import Nmmixin from '../nmmixin/Nmmixin';

//给一个View 设置 onStartShouldSetResponder={() => true} 属性阻止View内部事件往外冒泡
export default class MiscViewTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      text:'xxx',
      defaultText: 'aaaa',
    };
  }

  test1() {
    this.refs.textInput.clear();
  }

  test2() {
    this.setState({
      defaultText: this.state.defaultText + 'x'
    });
  }

  test3() {
    this.refs.textInput.refs.input.setNativeProps({
      text: 'aaaa'
    });

  }

  test4() {
  }

  aaa() {
    return [1, 2, 3].map(() => {
      return <Text>xxx</Text>;
    });
  }

  render1() {
    //竖直方向flex width优先级高于alignItems alignSelf 'stretch'; flex 高于height
    return (
      <View style={{width: 250, height: 300, alignItems: 'stretch'}}>
        <Image source={{}} style={{flex: 1, backgroundColor: '#A89298', width: 100, height: 100}}></Image>
      </View>
    );
  }

  render2() {
    //  LINE:      <View testID="xxxxx" style={{marginLeft: 100,width: 0, height: 200, marginTop: 100, borderStyle: 'solid', borderWidth: 1}}></View>

    // absolute 是相对于直接父元素的
    // <View style={{height: 300, backgroundColor: '#BBA968', position: 'relative', padding: 10}}>
    //   <View style={{flex: 1, backgroundColor: '#92BB68', padding: 10, margin: 10}}>
    //     <View style={{height: 100, width: 100, backgroundColor: '#96EDF2', position: 'absolute', top: 0, left: 0}}>
    //     </View>
    //   </View>
    // </View>

    // ScrollView的样式问题 指定其交叉方向的大小最好还是设在外面包裹的View 上，也可以设在contentContainerStyle
    // ScrollView 可以包含多个child
    // <View style={{backgroundColor: '#62F673', padding: 10, width: 200, height: 250}}>
    //   <ScrollView
    //     style={{backgroundColor: '#0BC6E4', padding: 20, height: 200}}
    //     contentContainerStyle={{padding: 30, backgroundColor: '#A1CD0D'}}
    //     scrollEventThrottle={16}
    //   >
    //     <View style={{backgroundColor: '#591BC6', height: 50}}>
    //       <Text>xxxx</Text>
    //     </View>
    //     <View style={{margin: 2, width: 100, height: 30, backgroundColor: '#85DA00'}}></View>
    //   </ScrollView>
    // </View>


    // React.createElement 可以有任意多个child参数 每一个都可以是数组，但为数组时会检查key
    // var uuuuu = [1,2,3].map(() => {
    //   return <View style={{margin: 2, width: 100, height: 30, backgroundColor: '#85DA00'}}></View>;
    // });
    //
  }

  render3() {
    return (
      <View>
        <ActivityIndicator />
        <View style={{width: 250, height: 250, backgroundColor: '#C387C6', alignItems: 'stretch',}}>
          <View style={{flex: 1, backgroundColor: '#126D99'}}></View>
        </View>
        <View style={{width: 250, height: 250, backgroundColor: '#85C191', alignItems: 'stretch', flexDirection: 'row'}}>
          <View style={{position: 'absolute', left: 10, top: 0, right: 0, bottom: 0, backgroundColor: '#CA7EF0'}}>
            <View style={{backgroundColor: '#126D99'}}></View>

          </View>


        </View>
      </View>

    );
  }

  render5() {
    return (
      <ScrollView style={{backgroundColor: '#A1B9AB'}}>
        <Text style={{backgroundColor: '#F5A3EE', fontSize: 20}}>xxx的说法地</Text>

        <TextInput
          ref="textInput"
          placeholder="123"
          onChange={function() {console.log('onChange ', arguments);}}
          onChangeText={function() {console.log('onChangeText ', arguments);}}
          onSubmitEditing={function() {console.log('onSubmitEditing ', arguments);}}
          keyboardType="twitter"
          returnKeyType="search"
          clearButtonMode={'always'}
          defaultValue={this.state.defaultText}
          style={{height: 50, paddingLeft: 50}}
        />

        <View>
          {this.renderTestBtns()}
        </View>
        {/*<TouchableWithoutFeedback
        onPress={() => {alert('TouchableWithoutFeedback onPress');}}>
        <View
          style={{height: 800, backgroundColor: '#A13A85', opacity: 0.1,}}>
          <TouchableWithoutFeedback
            onPress={() => {alert('inner TouchableWithoutFeedback onPress');}}>
            <View
            style={{width: 300, height: 200, backgroundColor: '#632F33'}}>
            </View>
          </TouchableWithoutFeedback>
          <View pointerEvents="box-none" style={{height: 100, backgroundColor: '#D23AF9'}}></View>
          <View onStartShouldSetResponder={() => {return true;}} style={{height: 100, backgroundColor: '#85648E'}}>
            <TouchableHighlight onPress={() => {}}><Text>xxxxx</Text></TouchableHighlight>
          </View>
          </View>
          </TouchableWithoutFeedback>*/}

          <View>
          <View
          style={{
            width: 60,
            height: 30,
            color: 'red',
            opacity: 0,
          }}>
          <Picker
            style={{
              width: 60,
              height: 30,
              color: 'red',
            }}
            selectedValue={this.state.pickerSelected}
            onValueChange={(value) => {
              console.log('onValueChange ', value);
            }}
            mode="dialog">
            <Picker.Item label="hello" value="key0" />
            <Picker.Item label="world" value="key1" />
          </Picker>
          </View>
            <Text style={{position: 'absolute', left: 0, top: 0}}>xxxx</Text>
          </View>


          <Link url="https://github.com/trending" ><Text>xxxx</Text></Link>

          <View>
            <Text>              123456789adfadfadfadfadfaasdfasdfadfadfadfadfadfasdfadfadfsdfasdfadfdsfasdfesf</Text>
            <Text style={{position: 'absolute', left: 0, top: 0, backgroundColor: '#930BE3', width: 50, height: 30}}>xxxx</Text>
          </View>

      </ScrollView>
    );
  }

  render4() {
    return (
      <View style={{flex: 1,}}>
        <Switch
          disabled={false}
          value={this.state.switchValue}
          onValueChange={(value) => {
            this.setState({
              switchValue: value,
            })
          }}
          style={{
            width:51,
            height:31,
          }}/>
      </View>
    )
  }

  render6() {
    // rn0.36开始 父容器没有设置宽高，子容器设置flex 会出不来，如果需要可设置flexGrow
    return (
      <View style={{backgroundColor: '#00bcd4'}}>
        <View style={{flex: 1, flexGrow: 1, flexShrink: 1, flexBasis: 0, backgroundColor: '#689f38'}}>
          <Text >xxxxx</Text>
        </View>
      </View>
    );
  }

  renderTest() {
    return this.render4();
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
