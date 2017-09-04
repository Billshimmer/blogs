'use strict';

import {
  Platform,
} from 'react-native';

import comps from 'lab-config/comps';
import styles from 'lab-config/styles';
import images from 'lab-config/images';
import tpls from 'lab-config/tpls';
import labConfig from 'lab-config/config';

import './initXHR';
import { configComps } from './lab/requireComp';
import { configStyles } from './lab/StyleManager';
import { configImages } from './lab/requireImage';
import { configTpls, setDefaultTplName } from './lab/TemplateManager';
import { configTheme } from './ThemeManager'
import RouterManager from './RouterManager';
import Parse from '../parse';
import utils from '../utils'
import DI from './DI';
import ExternalLinkManager from './ExternalLinkManager';

// 初始化框架的默认配置
configComps(comps);
configStyles(styles);
configImages(images);
configTpls(tpls);

/**
 * options: {
 *   theme,
 *   routeManifest,
 *   defaultTplName,
 *   config, //lab4 构建系统生成的config
 *   autoWebBaseUrl, //为false 则web使用配置的baseUrl 否则web 不使用baseUrl,直接根据页面地址
 * }
 */
export default function initialize(options) {
  if (options.theme) {
    configTheme(options.theme);
  }
  if (options.routeManifest) {
    RouterManager.configRouteManifest(options.routeManifest);
  }
  if (options.defaultTplName) {
    setDefaultTplName(options.defaultTplName);
  }

  const config = options.config || labConfig;
  let baseUrl = config.baseUrl;
  if (Platform.OS === 'web' && options.autoWebBaseUrl !== false) {
    // 默认web环境不配置baseUrl 使用当前地址，配置autoWebBaseUrl 为 false，关闭此默认行为
    baseUrl = undefined;
    config.baseUrl = undefined;
  }

  Parse.initialize('lab4', 'lab4');
  const parseBaseUrl = options.parseBaseUrl || '/api/1'; //lab4默认parse地址
  Parse.CoreManager.set('SERVER_URL', utils.getAbsoluteUrl(parseBaseUrl, baseUrl));

  // 初始化DI
  DI.setConfig(config);
  DI.set(DI.BASE_URL, baseUrl);
  if (!DI.getExternalLinkManager()) {
    DI.setExternalLinkManager(new ExternalLinkManager());
  }
}
