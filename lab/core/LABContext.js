'use strict';

import React, { Component } from 'react';

import utils from '../utils';

export default class LABContext extends Component {
  /**
   * 获取相对于当前上下文 baseUrl 的绝对url
   */
  getAbsoluteUrl(url) {
    return utils.getAbsoluteUrl(url); //, this.url); //TODO
  }
}
