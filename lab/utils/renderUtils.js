'use strict';

import React, {
  isValidElement,
} from 'react';
import render from 'lab4/core/lab/render';
import requireComp from 'lab4/core/lab/requireComp';

const Image = requireComp('com.Image');
const Icon = requireComp('com.Icon');

/**
 * 渲染Image组件
 * @param {any} image
 * String uri
 * RN Image source
 * 平台数据 ui_type: com.Image
 * Image 组件
 */
export function renderImage(image, config) {
  if (!image || typeof image === 'string') {
    return (
      <Image
        {...config}
        uri={image} />
    );
  }
  if (isValidElement(image) || image.ui_type) {
    return render(image, config);
  }

  // TODO 判断是否为source
  return (
    <Image
      {...config}
      source={image} />
  );
}

/**
 * 渲染Icon组件
 * @param {any} icon
 * String name
 * 平台数据 ui_type: com.Icon
 * Icon 组件
 */
export function renderIcon(icon, config) {
  if (!icon || typeof icon === 'string') {
    return (
      <Icon
        {...config}
        name={icon} />
    );
  }
  return render(icon, config);
}

