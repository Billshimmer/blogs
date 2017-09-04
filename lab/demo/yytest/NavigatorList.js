'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative,{
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  PropTypes,
  ScrollView,
  Navigator,
  StatusBar,
} from 'react-native';
import LAB from 'lab4';

var data = []
var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableOpacity
          onPress={() => navigator.pop()}
          style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      );
    }
  },
  RightButton(route, navigator, index, navState) {
    if(index > 0 && route.rightButton) {
      return (
        <TouchableOpacity
          onPress={() => navigator.pop()}
          style={styles.button}>
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
      );
    } else {
      return null
    }

  },
  Title(route, navigator, index, navState) {
    console.log(route);
    return (
      <View style={styles.title}>
        <Text style={styles.buttonText}>{route.title ? route.title : 'not find'}</Text>
      </View>
    );
  }
}

for(let i=0; i<10; i++)
  data.push({header:'header '+i,text:'hello i am '+i+' !'});


export default class NavigatorList extends LAB.Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props, context) {
    super(props, context);
  }
  render(){
    return(
      <Navigator
        style={{paddingTop:64}}
        initialRoute={{title:'List',component:List}}
        renderScene={(route, navigator) => {
            let Component = route.component;
            return <Component {...route.params} navigator={navigator} />
          }}
        navigationBar={
          <Navigator.NavigationBar
            style={{backgroundColor:'black',alignItems: 'center',}}
            routeMapper={ NavigationBarRouteMapper }
          />
        }
      />
    );
  }
  _navigationBar(){

  }
}

class List extends Component {
  constructor(props){
    super(props, context);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(data),
    }
  }
  render(){
    return(
      <View>
        <ListView
          ref="listView"
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)} //行下渲
        />
      </View>
    );
  }

  _renderRow(rowData, sectionID, rowID){
    return(
        <TouchableOpacity onPress={()=>{this.onPress()}}>
          <Text>{rowData.header}</Text>
          <Text>{rowData.text}</Text>
        </TouchableOpacity>
    );
  }
  onPress(){
    const { navigator } = this.props;
    if(navigator) {
        navigator.push({
              title: 'NothingPage',
              component: NothingPage,
          })
      }
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={sectionID + '_' + rowID} style={{height: 1, backgroundColor: 'gray'}}></View>
    );
  }

}

class NothingPage extends Component{
  constructor(props){
    super(props, context);
  }
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:1,backgroundColor:'blue'}}>
            <Text style={{fontSize:30,color:'white'}}>Nothing</Text>
        </View>
      </View>
    );
  }
  onPress(){
    const { navigator } = this.props;
      if(navigator) {
          navigator.pop();
      }
  }


}
class MainHeader extends Component{
  constructor(props){
    super(props, context);
  }
  render(){
    return(
      <View style={{backgroundColor:'black',height:40,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:20,color:'white',width:50,textAlign:'center'}}>MAIN</Text>
      </View>
    );
  }
}
class Header extends Component{
  constructor(props){
    super(props, context);
  }
  render(){
    return(
      <View style={{backgroundColor:'black',height:40,justifyContent:'center'}}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={{fontSize:20,color:'white',borderWidth:2,borderColor:'white',width:50,textAlign:'center'}}>POP</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'red',
  },
  button: {
    flex: 1,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'green',
  },
  buttonText:{
    fontSize:20,
    color:'white',
    textAlign:'center',
  },
})
