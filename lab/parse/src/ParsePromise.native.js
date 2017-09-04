'use strict';

function ParsePromise(cbk) {
  if (cbk) {
    return new Promise(cbk);
  }
  let res;
  let rej;
  const p = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  p.resolve = res;
  p.reject = rej;
  return p;
}

ParsePromise._thenRunCallbacks = function(promise, optionsOrCallback, model) {
  var options = {};
  if (typeof optionsOrCallback === 'function') {
    options.success = function(result) {
      optionsOrCallback(result, null);
    };
    options.error = function(error) {
      optionsOrCallback(null, error);
    };
  } else if (typeof optionsOrCallback === 'object') {
    if (typeof optionsOrCallback.success === 'function') {
      options.success = optionsOrCallback.success;
    }
    if (typeof optionsOrCallback.error === 'function') {
      options.error = optionsOrCallback.error;
    }
  }

  if (!options.success && !options.error) {
    return promise;
  }

  return promise.then(
    function(result) {
      if (options.success) {
        options.success(result);
      }
      return result;
    },
    function(error) {
      if (options.error) {
        if (typeof model !== 'undefined') {
          options.error(model, error);
        } else {
          options.error(error);
        }
      }
      return Promise.reject(error);
    },
  );
};

if (__DEV__) {
  ParsePromise._continueWith = function() {
    throw new Error('ParsePromise._continueWith unsupported');
  };
  ParsePromise.is = function() {
    throw new Error('ParsePromise.is unsupported');
  };
  ParsePromise.as = ParsePromise.resolve = function(value) {
    if (arguments.length > 1) {
      throw new Error('ParsePromise.resolve arguments.length must <= 1');
    }
    return Promise.resolve(value);
  };
  ParsePromise.reject = ParsePromise.error = function(error) {
    if (__DEV__) {
      if (arguments.length > 1) {
        throw new Error('ParsePromise.reject arguments.length must <= 1');
      }
    }
    return Promise.reject(error);
  };
} else {
  ParsePromise.as = ParsePromise.resolve = Promise.resolve.bind(Promise);
  ParsePromise.error = ParsePromise.reject = Promise.reject.bind(Promise);
}

// XXX when
ParsePromise.when = ParsePromise.all = Promise.all.bind(Promise);

ParsePromise.race = Promise.race.bind(Promise);

ParsePromise._continueWhile = function(predicate, asyncFunction) {
  if (predicate()) {
    return asyncFunction().then(function() {
      return ParsePromise._continueWhile(predicate, asyncFunction);
    });
  }
  return Promise.resolve();
};

export default ParsePromise;
