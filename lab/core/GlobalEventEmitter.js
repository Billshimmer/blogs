'use strict';

import EventEmitter from './emitter/EventEmitter';
import EmitterLeakDetection from './emitter/EmitterLeakDetection';

//全局事件总线
const GlobalEventEmitter = new EventEmitter();
export default GlobalEventEmitter;

if (__DEV__) {
  EmitterLeakDetection.add(GlobalEventEmitter);
}
