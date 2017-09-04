'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ListView,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

/**
 * 传入data格式：data[索引][{城市名&城市id}]
 * var data = {
 * 'A':[{name:'安徽',id:'AH'},{name:'安吉',id:'AJ'},{name:'安庆',id:'AQ'}],
 * 'B':[{name:'北京',id:'BJ'},{name:'保定',id:'BD'}],
 * 'C':[{name:'重庆',id:'CQ'},{name:'长沙',id:'CS'},{name:'成都',id:'CD'}],
 * 'D':[{name:'东京',id:'DJ'}],
 * 'G':[{name:'广东',id:'GD'},{name:'广西',id:'GX'},{name:'桂林',id:'GL'}],
 * 'H':[{name:'合肥',id:'HF'}],
 * };
 */
export default class IndexList extends LAB.Component {
  static propTypes = {
    data: PropTypes.object,
    onSelect: PropTypes.func,
    allIndex: PropTypes.bool,
  };

  static defaultProps = {
    allIndex: true,
    onSelect: () => {},
  };

  constructor(props, context) {
    super(props, context);
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this.props.data),
      select: {},
      heightSection: undefined,
      heightRow: undefined,
      heightLine: undefined,
      heightWindow: undefined,
      heightText: undefined,
    };
    this.defaultStyles = styles;
    this._renderRow = this._renderRow.bind(this);
    this._renderSeparator = this._renderSeparator.bind(this);
    this._renderSectionHeader = this._renderSectionHeader.bind(this);
    this.getHeightRow = this.getHeightRow.bind(this);
    this.getHeightSection = this.getHeightSection.bind(this);
    this.getHeightLine = this.getHeightLine.bind(this);
    this.getHeightWindow = this.getHeightWindow.bind(this);
    this.getY = this.getY.bind(this);
    this._panResponder = {}; //手势动作初始化
    this.index = ''; //索引项初始化
    //全索引
    this.indexList = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '#',
    ];
    this.indexNode = []; //每个显示的索引对应的实际列表中的索引
    this.list = []; //每个索引应转跳的位置

    //索引项Text内容初始化
    if (this.props.allIndex === true) {
      this.index =
        'A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP\nQ\nR\nS\nT\nU\nV\nW\nX\nY\nZ\n#';
    } else {
      for (let i in this.props.data) {
        this.index += i + '\n';
      }
      this.index = this.index.substring(0, this.index.length - 1); //去掉最后一个换行
    }

    //纪录每一项索引之上列表项之和
    //indexNode[]存放当前索引指向实际第几个索引
    this.temp_i = [];
    let temp_j = 0;
    let node = 0; //伪指针 当前索引指向实际第几个索引
    let j = 0; //计数
    if (this.props.allIndex === true) {
      //显示全部索引
      for (let i in this.props.data) {
        while (this.indexList[j] !== i) {
          this.indexNode.push(node === 0 ? 0 : node - 1);
          j++;
        }
        this.indexNode.push(node);
        node++;
        j++;
        this.temp_i.push(temp_j);
        temp_j += this.props.data[i].length;
      }
      node--;
      for (let i = j; i < this.indexList.length; i++) this.indexNode.push(node);
    } else {
      //显示实际索引
      for (let i in this.props.data) {
        this.indexNode.push(node);
        node++;
        this.temp_i.push(temp_j);
        temp_j += this.props.data[i].length;
      }
    }

    //列表底部索引处理初始化：记录最后一项索引的条目数
    this.heightListWithoutWindow = temp_j - this.temp_i[this.temp_i.length - 1];
  }

  getSelect() {
    return this.state.select;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._returnTrue.bind(this),
      //onStartShouldSetPanResponderCapture: this._returnTrue.bind(this),
      onMoveShouldSetPanResponder: this._returnTrue.bind(this),
      //onMoveShouldSetResponderCapture: this._returnTrue.bind(this),
      onPanResponderTerminationRequest: this._returnFalse.bind(this),
      //手势移动时的处理
      onPanResponderMove: this._onPanResponder.bind(this),
      //手势放开时的处理————如果只点击一下，未出发移动
      onPanResponderRelease: this._onPanResponder.bind(this),

      onPanResponderTerminate: (evt, gestureState) => {
        console.log('GG');
      },
    });
  }
  _onPanResponder(e, gestureState) {
    this._initListIndex();
    //计算移动到了第几个索引 存放在temp
    let temp = Platform.OS == 'ios'
      ? e.nativeEvent.locationY
      : e.nativeEvent.locationY + gestureState.dy;
    temp =
      (temp - (this.state.heightWindow - this.state.heightText) / 2) /
      (this.state.heightText / this.indexNode.length);
    if (temp >= 0 && temp < this.indexNode.length) {
      //temp在索引范围之内，取整
      temp = this.indexNode[temp << 0];
      this.list[temp] >= 0 &&
        this.refs.listView
          .getScrollResponder()
          .scrollTo({ y: this.list[temp], animated: false });
    }
  }

  _initListIndex() {
    //this.list存放每个索引应转跳的位置，如果未加载，则初始化
    if (this.list.length === 0) {
      //保存最后一项的高度(包含头部 & 分割线)
      this.heightListWithoutWindow =
        this.heightListWithoutWindow * this.state.heightRow +
        this.state.heightSection +
        this.state.heightLine * this.heightListWithoutWindow;
      //存放每个索引转跳位置
      for (let i = 0; i < this.temp_i.length; i++) {
        let temp =
          i * this.state.heightSection +
          this.state.heightRow * this.temp_i[i] +
          this.state.heightLine * (this.temp_i[i] - i);
        this.list.push(temp);
      }
      //保存触底时转跳的位置
      this.heightListWithoutWindow =
        this.heightListWithoutWindow +
        this.list[this.list.length - 1] -
        this.state.heightWindow;
      //触底转跳处理
      for (let i in this.list)
        if (this.list[i] > this.heightListWithoutWindow)
          this.list[i] = this.heightListWithoutWindow;
      //console.log(this.list);
    }
  }

  render() {
    return (
      <View onLayout={this.getHeightWindow} style={{ flex: 1 }}>
        <ListView
          ref="listView"
          enableEmptySections={true}
          showsVerticalScrollIndicator={this.props.showsVerticalScrollIndicator}
          style={this.getStyle('container')}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          renderSectionHeader={this._renderSectionHeader}
        />
        <View style={this.getStyle('index')}>
          <View style={this.getStyle('indexTextView')}>
            <Text onLayout={this.getY} style={this.getStyle('indexText')}>
              {this.index}
            </Text>
          </View>
          <View
            style={this.getStyle('onIndex')}
            {...this._panResponder.panHandlers}
          />
        </View>
      </View>
    );
  }

  _returnTrue(e, gestureState) {
    //console.log('true');
    return true;
  }

  _returnFalse(e, gestureState) {
    //console.log('false');
    return false;
  }

  getHeightWindow(e) {
    let temp = e.nativeEvent.layout.height;
    if (temp !== this.state.heightWindow) {
      //console.log('window '+e.nativeEvent.layout.height);
      this.setState({ heightWindow: temp });
    }
  }

  getHeightSection(e) {
    let temp = e.nativeEvent.layout.height;
    if (temp !== this.state.heightRow) {
      //console.log('S '+e.nativeEvent.layout.height);
      this.setState({ heightSection: temp });
    }
  }

  getHeightRow(e) {
    let temp = e.nativeEvent.layout.height;
    if (temp !== this.state.heightRow) {
      //console.log(e.nativeEvent.layout.height);
      this.setState({ heightRow: temp });
    }
  }

  getHeightLine(e) {
    let temp = e.nativeEvent.layout.height;
    if (temp !== this.state.heightLine) {
      //console.log(e.nativeEvent.layout.height);
      this.setState({ heightLine: temp });
    }
  }
  getY(e) {
    let temp = e.nativeEvent.layout.height;
    if (temp !== this.state.heightText) {
      //console.log('text '+e.nativeEvent.layout.height);
      this.setState({ heightText: temp });
    }
  }

  _renderRow(rowData, sectionID, rowID) {
    //console.log(sectionID+' '+rowID);
    var row = this.props.renderRow
      ? this.props.renderRow.apply(this, arguments)
      : <Text style={this.getStyle('rowText')}>{rowData.name}</Text>;
    return (
      <Touchable
        onLayout={this.getHeightRow}
        style={this.getStyle('rowContainer')}
        onPress={() => {
          this.onPress(rowData);
        }}
      >
        {row}
      </Touchable>
    );
  }

  onPress(rowData) {
    this.setState({ select: rowData }); //可以把id去掉返回一个name&id对象
    this.props.onSelect(rowData);
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        onLayout={this.getHeightLine}
        key={sectionID + '_' + rowID}
        style={this.getStyle('line')}
      />
    );
  }

  _renderSectionHeader(data, section) {
    //this.log('renderSectionHeader', data, section);
    return (
      <View
        onLayout={this.getHeightSection}
        style={this.getStyle('sectionHeader')}
      >
        <Text style={this.getStyle('sectionHeaderText')}>{section}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  index: {
    width: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  onIndex: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
    opacity: 0,
  },
  indexTextView: {
    paddingVertical: 5,
    width: 20,
    borderRadius: 10,
    overflow: 'hidden',
    opacity: 0.5,
  },
  indexText: {
    textAlign: 'center',
  },
});
