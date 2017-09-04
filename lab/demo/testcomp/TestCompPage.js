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
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import Test1 from './Test1';
import Test3 from './Test3';
import Wrapper from './Wrapper';

import BabelTest2 from 'lab4/demo/test/BabelTest2';

import TestComp from './TestComp';

class Test extends React.Component {

  shouldComponentUpdate() {
    console.log('Test shouldComponentUpdate');
    return true;
  }

  render() {
    console.log('Test render', this.props);
    return (
      <Text>test {this.props.id}</Text>
    );
  }
}

class XXXP extends React.Component {
}

class XXX extends XXXP {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log('XXX render', this.props);
    if(!this._test) {
      this._test = <Test key={0} id={0}/>
    }
    return (
      <View>
        <Text onPress={() => {
          this.setState({
            aaa: 1,
          });
        }}>test</Text>
        {this._test}
      </View>
    );
  }
}

//TODO 寻找继承自page的组件刷新机制不同的原因
export default class TestCompPage extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showTest1: true,
      test1Pos: true,
      key1: 1
    };

    this._test1RefFunc = this._test1RefFunc.bind(this);
  }

  test1() {
    this.setState({
      showTest1: !this.state.showTest1
    });
  }

  test2() {
    this.setState({
      test1Pos: !this.state.test1Pos
    });
  }

  test3() {
    // key的改变会引起comp重新加载
    this.setState({
      key1: this.state.key1 + 1
    });
  }

  test4() {
    this.forceReload();
  }

  test5() {
    this.forceUpdate();
  }

  test6() {
    this.setState({
      aaa: 1,
    });
  }

  test7() {
    this.setState({
      renderComp1: true,
    }, () => {
      //setState回调在渲染完成并且所有组件都didMount之后
      console.log('setState end callback');
    });
  }

  test8() {
  }

  test9() {
    console.log('refs:', this.refs);
  }

  componentWillMount() {
    this.log('componentWillMount');
    setImmediate(() => {
      console.log('componentWillMount setImmediate');
    });
    setTimeout(() => {
      console.log('componentWillMount setTimeout');
    });
  }

  componentDidMount() {
    this.log('componentDidMount');
  }

  componentWillReceiveProps() {
    this.log('componentWillReceiveProps refs=', this.refs);
    setImmediate(() => {
      console.log('componentWillReceiveProps setImmediate');
    });
    setTimeout(() => {
      console.log('componentWillReceiveProps setTimeout');
    });
  }

  componentWillUpdate() {
    this.log('componentWillUpdate refs=', this.refs);
    setImmediate(() => {
      console.log('componentWillUpdate setImmediate');
    });
    setTimeout(() => {
      console.log('componentWillUpdate setTimeout');
    });
  }

  componentWillFocus() {
    this.log('componentWillFocus');
  }

  componentDidFocus() {
    this.log('componentDidFocus');
  }

  componentWillBlur() {
    this.log('componentWillBlur');
  }

  componentDidBlur() {
    this.log('componentDidBlur');
  }

  componentWillUnmount() {
    //父组件的Unmount早于子组件
    console.log('TestCompPage componentWillUnmount');
  }

  _test1RefFunc(ref) {
    this.log('Test1 reffunc ref=', ref, arguments);
  }

  // <Test1 ref={this._test1RefFunc} aaa={Math.random()}/>
  // <Test3 ref="test1" TAG="1" ele={<Test3 ref="test3_ele" TAG="ele"/>}><Test3 ref="test3_2" TAG="2"/></Test3>
  // <Wrapper ref="wrapper"><Test3 ref="test3_3" TAG="3"/></Wrapper>
  // <BabelTest2/>

  renderContent() {
    let comp1;
    if (this.state.renderComp1) {
      comp1 = <Test1/>
    }
    return (
      <View>
        <TestComp
          abc={{xxx: 2}}
          aaa={undefined}
          bbb={undefined}
          ccc={undefined}/>
        {comp1}
        {this.renderTestBtns()}
      </View>
    );
    //this.log('renderContent ', this.refs.xxx);
    // if(!this.test1Comp) {
    //   this.test1Comp = <Test key={0} id={0}/>;
    // }
    // //key={'' + this.state.key1}
    // return (
    //   <View ref="xxx">
    //     <View style={{marginTop: 10}}>
    //       {this.renderTestBtns()}
    //     </View>
    //     {this.test1Comp}
    //     <XXX />
    //   </View>
    // );
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
