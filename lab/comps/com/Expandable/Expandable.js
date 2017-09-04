'use strict';
import React, { PropTypes } from 'react';
import { View } from 'react-native';
import LAB, { requireComp, isCompData } from 'lab4';
import Collapsible from 'lab4/basiccomps/Collapsible/Collapsible';

const Button = requireComp('com.Button');

/**
 * 伸缩组件
 * 
 * @export
 * @class Expandable
 * @extends {LAB.Component}
 */
export default class Expandable extends LAB.Component {
  static propTypes = {
    // ...Collapsible.propTypes,
    header: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.func,
    ]),
    footer: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.func,
    ]),
    buttonClass: PropTypes.string,
  };

  static defaultProps = {
    collapsed: true,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      collapsed: props.collapsed,
    };
    this._toggleCollapsed = this._toggleCollapsed.bind(this);
  }

  _renderHeader() {
    if (!this.props.header) {
      return null;
    }
    const header = typeof this.props.header === 'object'
      ? LAB.render(this.props.header, { collapsed: this.state.collapsed })
      : LAB.createElement(this.props.header, {
          collapsed: this.state.collapsed,
        });
    return (
      <Button
        style_class={this.props.buttonClass}
        onPress={this._toggleCollapsed}
      >
        {header}
      </Button>
    );
  }

  _renderFooter() {
    if (!this.props.footer) {
      return null;
    }
    const footer = typeof this.props.footer === 'object'
      ? LAB.render(this.props.footer, { collapsed: this.state.collapsed })
      : LAB.createElement(this.props.footer, {
          collapsed: this.state.collapsed,
        });
    return (
      <Button
        style_class={this.props.buttonClass}
        onPress={this._toggleCollapsed}
      >
        {footer}
      </Button>
    );
  }

  _toggleCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <View style={this.getStyle('container')}>
        {this._renderHeader()}
        <Collapsible
          {...this.props}
          collapsed={this.state.collapsed}
          style={this.getStyle('content')}
        >
          {this.props.children}
        </Collapsible>
        {this._renderFooter()}
      </View>
    );
  }
}
