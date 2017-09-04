'use strict';

import React from 'react';
import requireComp, {
  getComp,
} from './requireComp';

/**
 * 类似React.createElement 支持type为 ‘com.Comp’ 的字符串
 * @param type: Component class | comp str
 */
export default function createElement(type, config) {
  if (typeof type === 'string') {
    const Comp = requireComp(type);
    if (Comp) {
      const args = Array.from(arguments);
      args[0] = Comp;
      return React.createElement.apply(null, args);
    }
    return null;
  }
  return React.createElement.apply(null, arguments);
}