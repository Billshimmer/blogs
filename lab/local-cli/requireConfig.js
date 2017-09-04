var fs = require('fs');
module.exports = function() {
  var module = {
    exports: {},
  };
  try {
    eval(fs.readFileSync(arguments[0], {
      encoding: 'UTF-8',
    }));
  } catch(e) {
    console.error('config file error');
    throw e;
  }
  return module.exports;
};
