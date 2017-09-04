'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
} from 'react-native';

import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const List = requireComp('com.List');

export default class ListViewSelect extends LAB.Component{

  static propTypes = {
    ...ListView.propTypes,
    isRadio:PropTypes.bool,

  };

  static defaultProps = {
    ...ListView.defaultProps,
    isRadio:false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      select:{
        section:null,
        row:null,
      },
      choices:Object.create(null),
    };
    this._renderRow = this._renderRow.bind(this);
    this.rows = {}; //二维数组，储存每一行的ref，可用于直接操作
    this.choices = Object.create(null);
  }
  getSelect(){
    if(this.props.isRadio)
      return this.state.select;
    else {
      return this.state.choices;
    }
  }

  render(){
    return(
      <List
        {...this.props}
        renderRow={this._renderRow}
      />
    );

  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <Touchable onPress={() => {this.onPress(sectionID,rowID)}}>
        <RowSelect
          ref={(row) => {
            if(!this.rows[sectionID]) {
              this.rows[sectionID] = {};
            }
            //每行独有一个标记ref
            this.rows[sectionID][rowID] = row;
          }}
          render={this.props.renderRow.bind(null, rowData, sectionID, rowID)}/>
      </Touchable>
    );
  }

  onPress(sectionID,rowID){
    if(this.props.isRadio) { //单选情况
      if(!this.rows[sectionID][rowID].state.isSelect){
        this.state.select.row&&this.rows[this.state.select.section][this.state.select.row].setState(
          {isSelect:!this.rows[this.state.select.section][this.state.select.row].state.isSelect});
        this.setState({select:{section:sectionID,row:rowID}});
        this.rows[sectionID][rowID].setState({isSelect:!this.rows[sectionID][rowID].state.isSelect});
      }
      this.props.onPress&&this.props.onPress(this.state.select);
    } else { //多选情况
      let temp = this.choices[sectionID];  //多选情况（优化）
      if (!temp) {temp = this.choices[sectionID] = {}; }

      if(this.rows[sectionID][rowID].state.isSelect){
        delete temp[rowID]; //删除选中项
      } else {
        temp[rowID] = true; //增加选中项
      }
      //改变对外输出的state && 更换存在改动row样式
      this.setState({choices:this.choices});
      this.rows[sectionID][rowID].setState({isSelect:!this.rows[sectionID][rowID].state.isSelect});
    }
  }

}

class RowSelect extends Component {

  constructor(props, context){
    super(props, context);;
    this.state = {
      isSelect:false,
    }
  }

  render(){
    //为原来的renderRow增加一个isSelect属性
    let row = this.props.render(this.state.isSelect);
    if(!row) {
      return;
    }
    return row;//React.cloneElement(row, {isSelect:this.state.isSelect});
  }
}
