'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
	StyleSheet,
	View,
	Text,
} from 'react-native';

import LAB, {
	Page,
} from 'lab4';

export default class VPTestPage extends Page {

	constructor(props, context) {
		super(props, context);
		this.autoLoad = !props.hasData;
	}

	static propTypes = {
	};

	static defaultProps = {

  };

	onLoadResponse(response) {
		if(__DEV__ && !this.props.pageContainer) {
			throw new Error('!this.props.pageContainer');
		}
		this.props.pageContainer.changeData(response);
	}

	renderHeader() {
		return this.props.header && LAB.render(this.props.header);
	}

	renderContent() {
    return (
      <View style={{flex: 1}}>
        {LAB.render(this.props.viewpager, {style: {flex: 1}})}
        {LAB.render(this.props.tabBar, {style: {marginTop: 10}})}
      </View>
    );
	}
}

const styles = StyleSheet.create({
	header: {

	},
	content: {
		flex: 1
	},
	footer: {
	}
});
