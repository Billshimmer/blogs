'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
	StyleSheet,
  Text,
	View,
} from 'react-native';

import LAB from 'lab4';

export default class Test extends LAB.Component {

	static propTypes = {
	};

	static defaultProps = {
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
  			<Text style={{padding: 10, fontSize: 18}}>Test</Text>
		);
	}
}
