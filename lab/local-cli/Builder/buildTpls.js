'use strict';

let fs = require('fs');
let path = require('path');
let buildUtils = require('./buildUtils');

const blockCommentRe = /\/\*[^]*?\*\//g;
const lineCommentRe = /\/\/.*/g;
const tplRe = /\btpl\s*:\s*['"`]([^'"`]+)['"`]/g;

function getRequireTpls(routeManifestFile) {
  if (!fs.existsSync(routeManifestFile)) {
    return [];
  }
  let code = fs.readFileSync(routeManifestFile, {
    encoding: 'UTF-8',
  });
  let tpls = [];
  const cache = Object.create(null);

  const addDependency = (dep) => {
    if (!cache[dep]) {
      cache[dep] = true;
      tpls.push(dep);
    }
  };

  code
    .replace(blockCommentRe, '')
    .replace(lineCommentRe, '')
    .replace(tplRe, (match, dep) => {
      addDependency(dep);
      return match;
    });

  return tpls;
}

/**
 * config: {
 *   projectName,
 *   routeManifestFile,
 *   tplsDir,
 * }
 */
module.exports = function(config) {
  if (config.DEBUG) console.log('buildTpls begin');
  let tpls = getRequireTpls(config.routeManifestFile);
  let output = [];
  output.push('\'use strict\';');
  output.push('module.exports = {');
  let dataName;
  for (let i = 0; i < tpls.length; ++i) {
    dataName = tpls[i];
    output.push('  get \'' + dataName + '\'() {return ' + buildUtils.buildRequireCode(config.projectName, path.relative(config.projectRoot, config.tplsDir) + '/' + dataName) + '},');
  }
  output.push('};');
  // let tplsOutFile = path.join(config.projectRoot, config.outputDir, config.TPLS_OUT_FILE_NAME);
  // if (config.DEBUG) console.log('buildTpls writeFile: ' + tplsOutFile);
  // fs.writeFileSync(tplsOutFile, output.join('\n'), 'utf8');
  if (config.DEBUG) console.log('buildTpls end');
  return output.join('\n');
};
