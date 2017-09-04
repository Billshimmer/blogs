import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import {
  Page,
} from 'lab4';

import ListViewSelect from 'lab4/basiccomps/ListView/ListViewSelect';
import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

var data2 = {
  'A':[{name:'安徽',id:'AH'},{name:'安吉',id:'AJ'},{name:'安庆',id:'AQ'}],
  'B':[{name:'北京',id:'BJ'},{name:'保定',id:'BD'}],
  'C':[{name:'重庆',id:'CQ'},{name:'长沙',id:'CS'},{name:'成都',id:'CD'}],
};

var data = {};
for(let i = 0; i < 5; ++i) {
  data['section' + i] = [];
  for(let j = 0; j < 10; ++j) {
    data['section' + i].push('item' + j);
  }
}


var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;


export default class ListViewTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(data2),
      isRefreshing: false,
      refreshable: true,
    };
    this._renderRow = this._renderRow.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._renderHeader=this._renderHeader.bind(this);
  }

  renderContent() {
    var refreshControl;
    if(this.state.refreshable) {
      refreshControl = (
        <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          tintColor="#ff0000"
          title="Loading..."
          colors={['#ff0000', '#00ff00', '#0000ff']}
          progressBackgroundColor="#ffff00"
          enabled={true}
          size={RefreshControl.SIZE.DEFAULT}/>
      );
    }

    return (
      <View style={styles.container}>
        <ListViewSelect
          ref="listView"
          isRadio={true}
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          removeClippedSubviews={true}  //用于提升大列表的滚动性能。需要给行容器添加样式overflow:'hidden'。
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          renderSeparator={this._renderSeparator} //行下渲染
          pageSize={DEFAULT_PAGE_SIZE}
          initialListSize={DEFAULT_INITIAL_ROWS + 20}
          scrollRenderAheadDistance={DEFAULT_SCROLL_RENDER_AHEAD}
          refreshControl={refreshControl} //下拉刷新
        />
      </View>
    );
  }

  _renderHeader() {
    let theChoices = [];
    let select = this.refs.listView&&this.refs.listView.getSelect();
    //select&&(select.row!==null)&&console.log(data2[select.section][select.row].id);
  //   for(let i in select){
  //     for(let j in select[i])
  //      theChoices.push(<Text key={i+'_'+j}>{i+' '+j}</Text>)
  //  }

    return (
      <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
        {/*<Text>{this.state.select+': '+data[this.state.select]}</Text>
        <Text>{theChoices}</Text>*/}
        <Text>
        {
          select&&(select.row!==null)&&data2[select.section][select.row].id
          //JSON.stringify(select)
          //theChoices
        }
        </Text>
      </View>
    );
  }

  _renderFooter() {
    return (
      <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Footer</Text>
      </View>
    );
  }



  _renderRow(rowData, sectionID, rowID ,isSelect) {
    //console.log(this.props.isSelect);
    return (
      <View style={{flex:1,flexDirection:'row',backgroundColor:'yellow',height: 30, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{!isSelect?rowData.name:rowData.id}</Text>
      </View>
    );
  }


  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={sectionID + '_' + rowID} style={{height: 1, backgroundColor: 'blue'}}></View>
    );
  }


  _onRefresh() {
    this.log('onRefresh');
    this.setState({
      isRefreshing: true
    });
    setTimeout(() => {
      this.log('onRefresh timeout');
      this.setState({
        isRefreshing: false
      });
    }, 2000);
  }

  _onScroll(e) {
    this.log('onScroll', e);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
  },
});
