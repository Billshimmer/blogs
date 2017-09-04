'use strict';

import React from 'react';
import ReactNative from 'react-native';
import initialize from './core/initialize';
import Application from './core/Application';
import PageContainer from './core/PageContainer';
import Page from './core/Page';
import LoadingView from './basiccomps/LoadingView';
import StatusView from './core/StatusView';
import Link from './basiccomps/Link';
import LinkEmitAble from './basiccomps/LinkEmitAble';
import Toast from './basiccomps/Toast/Toast';
import Component from './core/BaseComponent';
import PureComponent from './core/BasePureComponent';
import EventEmitter from './core/emitter/EventEmitter';
import EventConstants from './core/EventConstants';
import CommonStyle from './core/CommonStyle';
import axios from './core/axios';
import globalEmitter from './core/GlobalEventEmitter';
import Storage from './utils/Storage';
import utils from './utils';
import DI from './core/DI';
import Parse from './parse';
import requireComp from './core/lab/requireComp';
import createElement from './core/lab/createElement';
import isCompData from './core/lab/isCompData';
import TemplateManager from './core/lab/TemplateManager';
import render from './core/lab/render';
import requireImage from './core/lab/requireImage';
import bootstrap from './core/bootstrap';


const User = Parse.User;
const http = axios;

export {
  Application,
  PageContainer,
  Page,
  LoadingView,
  StatusView,
  Link,
  LinkEmitAble,
  Toast,
  Component,
  PureComponent,
  EventEmitter,
  EventConstants,
  CommonStyle,
  axios,
  globalEmitter,
  Storage,
  utils,
  DI,
  Parse,
  User,
  http,

  isCompData,
  requireComp,
  requireImage,
  TemplateManager,
  render,
  createElement,
  bootstrap,
  initialize,
}

const LAB = {
  Application,
  PageContainer,
  Page,
  LoadingView,
  StatusView,
  Link,
  LinkEmitAble,
  Toast,
  Component,
  PureComponent,
  EventEmitter,
  EventConstants,
  CommonStyle,
  axios,
  globalEmitter,
  Storage,
  utils,
  DI,
  Parse,
  User,
  http,

  isCompData,
  requireComp,
  requireImage,
  TemplateManager,
  render,
  createElement,
  bootstrap,
  initialize,
};

export default LAB;

import EmitterLeakDetection from './core/emitter/EmitterLeakDetection';

if (__DEV__) {
  if (global.navigator.userAgent) {
    // 为浏览器调试环境设置方便的全局变量
    global.ReactNative = ReactNative;
    global.React = React;
    global.LAB = LAB;
    global.__BROWSER__ = true;
  } else {
    global.__BROWSER__ = false;
  }

  EmitterLeakDetection.add(User.emitter);
}
