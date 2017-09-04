'use strict';

const pluses = /\+/g;

function encode(s) {
  return cookie.raw ? s : encodeURIComponent(s);
}

function decode(s) {
  return cookie.raw ? s : decodeURIComponent(s);
}

function stringifyCookieValue(value) {
  return encode(cookie.json ? JSON.stringify(value) : String(value));
}

function parseCookieValue(s) {
  if (s.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  try {
    // Replace server-side written pluses with spaces.
    // If we can't decode the cookie, ignore it, it's unusable.
    // If we can't parse the cookie, ignore it, it's unusable.
    s = decodeURIComponent(s.replace(pluses, ' '));
    return cookie.json ? JSON.parse(s) : s;
  } catch (e) {}
}

function read(s, converter) {
  var value = cookie.raw ? s : parseCookieValue(s);
  return (typeof converter === 'function') ? converter(value) : value;
}

function cookie(key, value, options) {
  // Write

  if (value !== undefined && !(typeof value === 'function')) {
    options = Object.assign({}, cookie.defaults, options);

    if (typeof options.expires === 'number') {
        var days = options.expires,
            t = options.expires = new Date();
        t.setTime(+t + days * 864e+5);
    }

    return (document.cookie = [
        encode(key), '=', stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
    ].join(''));
  }

  // Read

  var result = key ? undefined : {};

  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all. Also prevents odd result when
  // calling cookie().
  var cookies = document.cookie ? document.cookie.split('; ') : [];

  for (var i = 0, l = cookies.length; i < l; i++) {
    var parts = cookies[i].split('=');
    var name = decode(parts.shift());
    var cookieValue = parts.join('=');

    if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookieValue, value);
        break;
    }

    // Prevent storing a cookie that we couldn't decode.
    if (!key && (cookieValue = read(cookieValue)) !== undefined) {
        result[name] = cookieValue;
    }
  }

  return result;
};

cookie.defaults = {};


/**
 * cookie读写
 * options:
 * {
 *   expires Number | Date Number表示有效天数
 *   path
 *   domain
 *   secure
 * }
 */
const CookieManager = {
  get(key, options, callback) {
    var value = cookie(key);
    callback && callback(null, value);
    return Promise.resolve(value);
  },

  /**
   * 获取同一个options下的多个cookie
   * @param keys: Array
   */
  getAll(keys, options, callback) {
    let values = [];
    for(let key of keys) {
      values.push(cookie(key));
    }
    callback && callback(null, values);
    return Promise.resolve(values);
  },

  set(key, value, options, callback) {
    cookie(key, value, options);
    callback && callback(null, null);
    return Promise.resolve(null);
  },

  remove(key, options, callback) {
    cookie(key, '', Object.assign({}, options, {
      expires: -1
    }));
    callback && callback(null, null);
    return Promise.resolve(null);
  },

  //web下可同步获取
  getSync(key, options) {
    return cookie(key);
  },

  getAllSync(keys, options) {
    let values = [];
    for(let key of keys) {
      values.push(cookie(key));
    }
    return values;
  },

  flush() {

  },
};

export default CookieManager;
