'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import LAB, { Toast, globalEmitter, requireComp } from 'lab4';

const Select = requireComp('com.Select');
const Dropdown = requireComp('com.Dropdown');
const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');
const PageContainer = requireComp('com.PageContainer');
const Form = requireComp('com.form.Form');
const DatePickField = requireComp('com.form.DatePickField');

const width = Dimensions.get('window').width;

/**
 * 筛选块 通过平台数据驱动，提供一个页面层级的列表筛选功能，(可接受其他参数，添加 url 拼接规则)
 * 用于洄图的搜索筛选
 * 
 * @export
 * @class FilterBlock
 * @extends {LAB.Component}
 */
export default class FilterBlock extends LAB.Component {
  static propTypes = {
    data: PropTypes.array,
    baseUrl: PropTypes.string,
    defaultUrl: PropTypes.string,
    searchEmit: PropTypes.string,
    selectClass: PropTypes.string,
    defaultSearch: PropTypes.string,
  };
  static defaultProps = {
    data: [],
    baseUrl: 'baidu.com',
    selectClass: 'filter-default',
    selectRightIcon: 'arrow-drop-down',
  };

  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  constructor(props, context) {
    super(props, context);
    this.state = {
      select: [],
      url: this.props.defaultUrl || this.props.baseUrl,
      search: this.props.defaultSearch || '',
    };
    this.defaultStyles = styles;
    this._newSearch = this._newSearch.bind(this);
    this._newSuggest = this._newSuggest.bind(this);
    this._select = [];
  }

  componentWillReceiveProps(newProps) {
    if (newProps.baseUrl != this.props.baseUrl) {
      let temp = [];
      for (let i in newProps.data) {
        if (newProps.data[i].type != 'date') {
          temp.push(newProps.data[i].value_list[0]);
        } else {
          temp.push(undefined);
        }
      }
      this.setState({
        select: temp,
        url: newProps.baseUrl,
        search: newProps.defaultSearch || '',
      });
    }
  }

  componentWillUnmount() {
    globalEmitter.offByTag(this);
  }

  componentDidMount() {
    this.props.searchEmit &&
      globalEmitter.on(this.props.searchEmit, this._newSearch, this, null);
    this.props.suggestEmit &&
      globalEmitter.on(this.props.suggestEmit, this._newSuggest, this, null);
    let temp = [];
    for (let i in this.props.data) {
      if (this.props.data[i].type != 'date') {
        temp.push(this.props.data[i].value_list[0]);
      } else {
        temp.push(undefined);
      }
    }
    this.setState({ select: temp });
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        {this.props.data.length
          ? <View style={this.getStyle('selectView')}>
              {this.props.data &&
                this.props.data.map((item, i) => {
                  if (item.type == 'date') {
                    return (
                      <Form
                        key={i}
                        onValueChange={x => {
                          this.onChange(i, {
                            key: x.date,
                          });
                        }}
                        style={{ flex: 1 }}
                      >
                        <DatePickField
                          mode="date"
                          format="yyyy/MM/dd"
                          name="date"
                        />
                      </Form>
                    );
                  } else {
                    // return(
                    //   <Select
                    //     key={i}
                    //     data={item.value_list}
                    //     defaultText={item.title}
                    //     defaultValue={0}
                    //     text={this.state.select[i] && this.state.select[i].value}
                    //     icon="arrow-drop-down"
                    //     onChange={(x) => {
                    //       console.log(item.value_list[x]);
                    //       this.onChange(i, item.value_list[x])
                    //     }}
                    //     style_class={this.props.selectClass}/>
                    // )
                    return (
                      <Dropdown
                        key={i}
                        ref={ref => {
                          this._select[i] = ref;
                        }}
                        type="none"
                        text={
                          this.state.select[i]
                            ? this.state.select[i].value
                            : item.title
                        }
                        iconRight={this.props.selectRightIcon}
                        style_class={this.props.selectClass}
                      >
                        {item.value_list.map((item, j) => {
                          return (
                            <Touchable
                              key={j}
                              onPress={() => {
                                this.onChange(i, item);
                              }}
                              activeOpacity={0.7}
                              style={this.getStyle('selectItemContainer')}
                            >
                              <Text
                                style={[
                                  this.getStyle('selectItemText'),
                                  this.state.select[i] &&
                                  item.key == this.state.select[i].key && {
                                    color: 'white',
                                  },
                                ]}
                              >
                                {item.value}
                              </Text>
                            </Touchable>
                          );
                        })}
                      </Dropdown>
                    );
                  }
                })}
            </View>
          : null}
        {/*<Text>{this.state.url}</Text>*/}
        <PageContainer
          route={{ ui_type: 'com.LinkAble', url: this.state.url }}
        />
      </View>
    );
  }

  onChange(i, value) {
    let temp = this.state.select;
    temp[i] = value;
    let url = this.props.baseUrl + '?';
    temp.map((item, i) => {
      if (item) {
        url += this.props.data[i].keyword + '=' + item.key + '&';
      }
    });
    if (this.state.search) {
      url += this.state.search;
    } else {
      url = url.substring(0, url.length - 1);
    }
    this.setState({
      select: temp,
      url: url,
    });
    this._select[i] && this._select[i].hide && this._select[i].hide();
  }

  _newSuggest(value) {
    this.setState({
      url: value || this.props.defaultUrl || this.props.baseUrl,
    });
  }

  _newSearch(value) {
    let url = this.props.baseUrl + '?';
    this.state.select.map((item, i) => {
      if (item) {
        url += this.props.data[i].keyword + '=' + item.key + '&';
      }
    });
    if (value) {
      url += value;
    }
    this.setState({
      search: value,
      url: url,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectView: {},
  selectItemContainer: {},
  selectItemText: {},
});
