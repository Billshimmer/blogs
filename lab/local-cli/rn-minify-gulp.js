'use strict';
require('react-native/local-cli/cli');

const through = require('through2');

const defaultConfig = require('react-native/local-cli/default.config');
const Config = require('react-native/local-cli/util/Config');
const Transformer = require('react-native/packager/react-packager/src/JSTransformer');
const minify = require('react-native/packager/react-packager/src/JSTransformer/worker/minify');

function getRNCliConfig() {
  let cwd = __dirname;
  let configPath = Config.findConfigPath(cwd);

  return Config.get(cwd, defaultConfig, configPath);
}

const RNCliConfig = getRNCliConfig();
const transformer = new Transformer({
  transformModulePath: RNCliConfig.getTransformModulePath(),
});

function trycatch(fn, handle) {
  try {
    return fn();
  } catch (err) {
    return handle(err);
  }
}

module.exports = function (opts) {
  function exec(file, encoding, callback) {
    //console.log('xxxxx ', encoding, file);

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new Error('Streaming not supported ' + file.path));
    }

    if (file.path.endsWith('.js')) {
      transformer.transformFile(file.path, String(file.contents), null)
        .then((result) => {
          let code = minify(null, result.code, null).code;
          file.contents = new Buffer(code);
          //console.log('111111 success');
          callback(null, file);
        })
        .catch((err) => {
          //console.log('1111111 error:', err);
          // 在Promise 中直接调用callback(err); 会导致被捕获而使流无法结束
          setTimeout(() => {
            callback(err);
          });
        });
    } else {
      callback(null, file);
    }
  }

  return through.obj(exec);
};
