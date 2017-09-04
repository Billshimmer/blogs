'use strict';

import { NativeModules } from 'react-native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';

const LABLoggerModule = NativeModules.LABLoggerModule;

function errorStackToString(e) {
  const stack = parseErrorStack(e);
  const arr = [];
  for (let i = 0; i < stack.length; ++i) {
    let frame = stack[i];
    arr.push(frame.methodName);
    arr.push('@');
    arr.push(frame.file);
    arr.push(frame.lineNumber);
    if (frame.column != null) {
      arr.push(':');
      arr.push(frame.column);
    }
    arr.push('\n');
  }
  return arr.join('');
}

function parseError(e, isFatal) {
  return {
    message: e.message || '',
    stack: errorStackToString(e),
    isFatal: !!isFatal,
  };
}

export default {
  reportError(e, isFatal) {
    LABLoggerModule.reportError(parseError(e, isFatal));
  },
};
