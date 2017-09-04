'use strict';
//基于 eventemitter3 2.0.3
//没有采纳其 Events() 和 _eventsCount
//https://github.com/primus/eventemitter3
// TODO nodejs EventEmitter具有的功能 https://nodejs.org/api/events.html

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @param {Mixed} tag 事件订阅的tag 可用于取消订阅
 * @constructor
 * @api private
 */
function EE(fn, context, once, tag) {
  this.fn = fn;
  this.context = context;
  this.once = once;
  this.tag = tag || context; //null undefined等值不能作为tag tag默认为context
}

EE.prototype = null;

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  return this._events ? Object.keys(this._events) : [];
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} evt The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(evt, exists) {
  var available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} evt The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(evt, a1, a2, a3, a4, a5) {
  if (__DEV__) {
    if (typeof evt !== 'string') {
      throw new Error('event 不是string event: ', evt);
    }
  }

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @param tag
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(evt, fn, context, tag) {
  if (__DEV__) {
    if (!this._debugCtxWarned && !context && !tag && context !== null) {
      this._debugCtxWarned = true;
      try {
        throw new Error('EventEmitter: 为了方便内存泄漏检查，请在使用事件总线订阅事件时传入context或者tag参数，如果确实不需要可传入null');
      } catch (e) {
        console.warn(e);
      }
    }
  }

  var listener = new EE(fn, context || this, false, tag);

  if (!this._events) this._events = Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @param tag
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(evt, fn, context, tag) {
  var listener = new EE(fn, context || this, true, tag);

  if (!this._events) this._events = Object.create(null);
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(evt, fn, context, once) {

  if (!this._events || !this._events[evt]) return this;

  if (!fn) {
    delete this._events[evt];
    return this;
  }

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[event];
  else this._events = null;

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//扩展

/**
 * 移除tag下的所有订阅
 */
EventEmitter.prototype.removeListenerByTag = function removeListenerByTag(tag) {
  // null undefined 这些不能作为tag
  if (!tag) return this;

  var _events = this._events;

  if (!_events) return this;

  var listeners,
    events,
    keys = Object.keys(_events),
    ki = 0,
    kLen = keys.length,
    li,
    llen,
    evt;

  for (; ki < kLen; ++ki) {
    evt = keys[ki];
    listeners = _events[evt];
    if (listeners.fn) {
      if (listeners.tag === tag) {
        delete _events[evt];
      }
    } else {
      for (li = 0, llen = listeners.length; li < llen; ++li) {
        if (!events) {
          if (listeners[li].tag === tag) {
            events = listeners.slice(0, li);
          }
        } else if (listeners[li].tag !== tag) {
          events.push(listeners[li]);
        }
      }
      if (events) {
        if (events.length) {
          _events[evt] = events.length === 1 ? events[0] : events;
        } else {
          delete _events[evt];
        }
        events = null;
      }
    }
  }
  return this;
};

EventEmitter.prototype.offByTag = EventEmitter.prototype.removeListenerByTag;

EventEmitter.prototype.listenerCount = function(evt) {
  return (this._events && this._events[evt].length) || 0;
};

EventEmitter.prototype.hasListener = function() {
  return !!(this._events && Object.keys(this._events).length);
};

/**
 * 给一个事件加上命名空间
 */
EventEmitter.nsEvent = function nsEvent(ns, event) {
  return ns ? ns + '::' + event : event;
}

if (__DEV__) {
  // 用于测试时检查内存泄漏
  EventEmitter.prototype.debugTraverseAll = function(callback, maxCount = 50) {
    var _events = this._events;
    if (!_events) return;

    var callbackCount = 0;
    var listeners,
    keys = Object.keys(_events),
    ki = 0,
    kLen = keys.length,
    li,
    llen;

    for (; ki < kLen && callbackCount < maxCount; ++ki) {
      listeners = _events[keys[ki]];
      if (listeners.fn) {
        callback(listeners);
        ++callbackCount;
      } else {
        for (li = 0, llen = listeners.length; li < llen && callbackCount < maxCount; ++li) {
          callback(listeners[li]);
          ++callbackCount;
        }
      }
    }
  };
}

export default EventEmitter;
