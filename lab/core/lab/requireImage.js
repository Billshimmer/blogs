'use strict';

import utils from '../../utils'
import ResourceManager from '../ResourceManager';

const { parseDrawableUri, ResTypes } = ResourceManager;

let imageMap;

/**
 * 配置框架build产生的images
 */
export function configImages(images) {
  imageMap = images || {};
}

/**
 * 引用图片
 * @param uri
 *          1.图片绝对uri
 *          2.打包图片(不带扩展名) 相对路径 在某个预先设定的文件夹中查找
 *          3.lab-image:// 打包图片
 *          4.在线图片相对路径 相对于配置的baseUrl 以/ 开头
 * @return Image.propTypes.source
 */
export default function requireImage(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }
  if (!uri) {
    // 空字符串
    return undefined;
  }
  const parsed = parseDrawableUri(uri);
  if (__DEV__ && parsed.type === ResTypes.ICON) {
    console.warn('requireImage 不支持icon', arguments[0]);
  }
  if (parsed.type === ResTypes.IMAGE) {
    return {
      uri: parsed.uri,
    };
  }
  
  //非绝对uri默认使用本地打包的图片
  const ret = imageMap[parsed.uri];
  if (__DEV__) {
    if (!ret) console.warn(`requireImage 本地图片:${arguments[0]} 不存在`);
  }
  return ret;
}