'use strict';

import React from 'react';

export default class BabelTest1 extends React.Component {

  static staticMember1 = 1;

  menber1 = 1;

  constructor(a, b) {
    super();
    this.menber2 = 2;
  }

  func1() {

  }

  // componentDidMount = function() {
  //   console.log('BabelTest1 componentDidMount');
  // }

  get getter1() {

  }
}

Object.defineProperty(BabelTest1.prototype, 'defineGetter1', {
    get: function() {
        return undefined;
    }
});

// BabelTest1.prototype.componentDidMount = function() {
//   console.log('BabelTest1 componentDidMount');
// };
