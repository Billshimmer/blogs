'use strict';

import {
  createElement,
  isValidElement,
  cloneElement,
} from 'react';
import requireComp from './requireComp';

function mapLABChildren(data, index) {
  if (!data || !data.ui_type) {
    return data;
  }
  if (!data.key) {
    return render(Object.assign({ key: index }, data));
  }
  return render(data);
}

/**
 * 类似React.createElement React.cloneElement
 * @param data: 平台数据: {ui_type: 'com.xxx', ...} | ReactElement  不能为空
 * @param config: props
 * @param child...: ReactElement
 */
export default function render(data, config) {
  if (!data) {
    throw new Error('appbuilder/render data不能为空');
  }
  if (data.ui_type) {
    const Comp = requireComp(data.ui_type);

    if (config) {
      config = Object.assign({}, data, config);
    } else {
      config = data;
    }

    if (arguments.length < 3) {
      const children = config.children;
      if (children) {
        if (children.ui_type) {
          children = render(children);
        } else if (Array.isArray(children)) {
          children = children.map(mapLABChildren);
        }
        return createElement(Comp, config, children);
      }
      return createElement(Comp, config);
    }

    const args = [Comp, config];
    for (let i = 2; i < arguments.length; ++i) {
      args.push(arguments[i]);
    }
    return createElement.apply(null, args);
  }
  if (isValidElement(data)) {
    if (arguments.length == 1) {
      return data;
    }
    return cloneElement.apply(null, arguments);
  }
  if (__DEV__) {
    throw new Error(
      `appbuilder/render data不合法,data可以为平台数据类型或者ReactElement data: ${JSON.stringify(data)}`
    );
  }
  return null;
}