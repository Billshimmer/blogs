'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
} from 'react-native';
import { requireComp } from 'lab4';

let Touchable;

export default class Link extends Component {

  constructor(props, context) {
    super(props, context);
    // this._handlePress = this._handlePress.bind(this);

    if (!Touchable) {
      Touchable = requireComp('com.Touchable');
    }
  }

  static contextTypes = {
    router: React.PropTypes.object,
    page: React.PropTypes.object, //TODO baseUrl问题
  };

  // static propTypes = {
  //   ...TouchableHighlight.props,
  //   ...LinkEmitAble.linkPropTypes,
  //   preload: PropTypes.any, //TODO 预加载链接数据
  // };

  // static defaultProps = {
  //   ...TouchableHighlight.defaultProps,
  //   type: 'push',
  // };

  // _handlePress() {
  //   if(this.props.onPress && this.props.onPress.call(this) === false) {
  //     return;
  //   }
  //   this._handleLink(this.props);
  //   this._handleEmit();
  // }

  render() {
    const {
      type,
      id,
      url,
      comp,
      compData,
      tpl,
      data,
      config,
      ...other,
    } = this.props;
    return (
      <Touchable
        {...other}
        link={{
          type,
          id,
          url,
          comp,
          compData,
          tpl,
          data,
          config,
        }}>
        {this.props.children}
      </Touchable>
    );
  }
}

// LinkEmitAble.enhance(Link, false);
