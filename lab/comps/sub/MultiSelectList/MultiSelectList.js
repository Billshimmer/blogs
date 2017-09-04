'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Platform,
  Navigator,
  ListView,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

export default class MultiSelectList extends LAB.Component {
  static propTypes = {
    data: PropTypes.array,
    onCancel: PropTypes.func,
    onSelect: PropTypes.func,
  };
  // static defaultProps = {

  // };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: [],
    };
    this.defaultStyles = styles;
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    this.setState({ value: value });
  }

  getValue() {
    return this.state.value;
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        {this.props.header
          ? LAB.render(this.props.header)
          : <View style={this.getStyle('headView')}>
              <Touchable
                style={this.getStyle('cancelButton')}
                onPress={this.props.onCancel}
              >
                <Text style={this.getStyle('cancelText')}>取消</Text>
              </Touchable>
            </View>}
        <Navigator
          initialRoute={{
            title: 'List',
            component: List,
            data: this.props.data,
            index: 0,
            select: [],
          }}
          renderScene={(route, navigator) => {
            let Component = route.component;
            return (
              <Component
                {...route.params}
                navigator={navigator}
                data={route.data}
                index={route.index}
                select={route.select}
                onSelect={this.props.onSelect}
                onValueChange={this.onValueChange}
                styles={this.getStyles()}
              />
            );
          }}
        />
      </View>
    );
  }
}

class List extends LAB.Component {
  constructor(props, context) {
    super(props, context);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.data),
    };
    this.defaultStyles = styles;
  }
  
  render() {
    return (
      <ListView
        ref="listView"
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator.bind(this)} //行下渲
      />
    );
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <Touchable
        style={this.getStyle('rowContainer')}
        onPress={() => {
          this.onPress(rowData);
        }}
      >
        <Text style={this.getStyle('rowText')}>{rowData.value}</Text>
      </Touchable>
    );
  }
  onPress(rowData) {
    let temp = {
      ...rowData,
    };
    delete temp.list;

    //重头开始压防止回退导致的选择
    let tempSelect = [];
    for (let i = 0; i < this.props.select.length; i++) {
      tempSelect.push(this.props.select[i]);
    }
    tempSelect.push(temp);

    this.props.onValueChange && this.props.onValueChange(tempSelect);

    if (!rowData.list || (rowData.list && !rowData.list.length)) {
      this.props.onSelect && this.props.onSelect(tempSelect);
    } else {
      this.props.navigator.push({
        title: 'newList',
        component: List,
        data: rowData.list,
        index: this.props.index + 1,
        select: tempSelect,
        onSelect: this.props.onSelect,
        onValueChange: this.props.onValueChange,
      });
    }
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <View key={sectionID + '_' + rowID} style={this.getStyle('line')} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    justifyContent: 'center',
  },
});
