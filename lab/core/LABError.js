'use strict';

/**
 * @param {String | Object} message 为Object 时代表options
 * @param {String} code
 */
export default function LABError(message, code) {
  this.stack = (new Error()).stack;

  if (typeof message === 'object') {
    const options = message;
    this.name = options.name || 'LABError';
    this.message = options.message;
    this.code = options.code;
    this.cause = options.cause;
  } else {
    this.name = 'LABError';
    this.message = message || 'LABError';
    this.code = code;
  }
}
LABError.prototype = Object.create(Error.prototype);
LABError.prototype.constructor = LABError;