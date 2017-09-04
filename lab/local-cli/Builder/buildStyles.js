'use strict';

let fs = require('fs');
let path = require('path');
let buildUtils = require('./buildUtils');

//递归获取style配置对象
// TODO 判断目录 文件命名规范
function recursionStyleDir({
  dirPath,
  outMap,
  styleFile,
  requireRoot,
  projectName,
  filter,
}) {
  let children = fs.readdirSync(dirPath),
    i = 0,
    len = children.length,
    childPath,
    childName,
    stats,
    //isCompStylesDir,
    compStyles,
    relativePath = path.relative(requireRoot, dirPath).replace(/\\/g, '/');
  const compName = path.relative(styleFile, dirPath).replace(/\\|\//g, '.');
  for (; i < len; ++i) {
    childName = children[i];
    if (childName.charAt(0) == '.') {
      continue;
    }
    childPath = path.join(dirPath, childName);
    stats = fs.lstatSync(childPath);
    if (stats.isDirectory()) {
      recursionStyleDir({
        dirPath: childPath,
        outMap,
        styleFile,
        requireRoot,
        projectName,
        filter,
      });
    } else if (childName.indexOf('.js') == childName.length - 3 && filter(compName)) {
      compStyles = compStyles || Object.create(null);
      let styleClass = childName.slice(0, -3);
      compStyles[styleClass] = buildUtils.markObjConfig({
        path: relativePath + '/' + styleClass,
        requirePath: projectName + '/' + relativePath + '/' + styleClass
      });
    }
  }
  if (compStyles) {
    outMap[compName] = compStyles;
  }
}

function createCompStyleGetter(output, rdn, compStyles) {
  let stylesName,
    keys = Object.keys(compStyles),
    configObj;
  for (let i = 0; i < keys.length; ++i) {
    stylesName = keys[i];
    configObj = compStyles[stylesName];
    output.push('  ' + 'get \'' + rdn + ':' + stylesName + '\'() {return x(require(\'' + configObj.requirePath + '\'))},');
  }
}

function getStruct(styleFile, requireRoot, projectName, filter) {
  let stylesMap = Object.create(null);
  if (fs.existsSync(styleFile)) {
    recursionStyleDir({
      dirPath: styleFile,
      outMap: stylesMap,
      styleFile: styleFile,
      requireRoot,
      projectName,
      filter,
    });
  }
  return stylesMap;
}

/**
 * config: {
 *   projectConfigs,
 *   compFilter,
 * }
 */
module.exports = function buildStyles(config) {
  if (config.DEBUG) console.log('buildStyles begin');

  let outMap = config.projectConfigs.reduce((prevMap, projectConfig) => {
    let outMap = getStruct(path.join(projectConfig.projectRoot, config.styleDir), projectConfig.requireRoot, projectConfig.projectName, config.compFilter);
    if (prevMap) {
      outMap = buildUtils.inhert(outMap, prevMap);
    }
    return outMap;
  }, null);

  // 已由compFilter代替
  // if (config.packageWhiteList) {
  //   let newOutMap = {};
  //   let whiteMap = config.packageWhiteList.reduce((prev, value) => {
  //     prev[value] = true;
  //     return prev;
  //   }, {});
  //   let i = 0;
  //   let keys = Object.keys(outMap);
  //   let key;
  //   let key1;
  //   for (; i < keys.length; ++i) {
  //     key1 = key = keys[i];
  //     let end = key.indexOf('.');
  //     if (end > 0) {
  //       key1 = key.slice(0, end);
  //     }
  //     if (whiteMap[key1]) {
  //       newOutMap[key] = outMap[key];
  //     }
  //   }
  //   outMap = newOutMap;
  // }

  //console.log('buildStyles outMap=', outMap);
  //输出结构文件
  // if (config.DEBUG) {
  //   buildUtils.outputSimpleObj(outMap, path.join(config.projectRoot, config.outputDir, config.STYLES_STRUCT_OUT_FILE_NAME));
  // }
  //输出代码文件
  let rdn;
  let relativePath;
  let output = [];
  output.push('\'use strict\';');
  output.push('const x = __requireDefault;');
  output.push('module.exports = {');
  for (rdn in outMap) {
    createCompStyleGetter(output, rdn, outMap[rdn]);
  }
  output.push('};');
  // let stylesOutFile = path.join(config.projectRoot, config.outputDir, config.STYLES_OUT_FILE_NAME);
  // if (config.DEBUG) console.log('buildStyles writeFile: ' + stylesOutFile);
  // fs.writeFileSync(stylesOutFile, output.join('\n'), 'utf8');
  if (config.DEBUG) console.log('buildStyles end');
  return output.join('\n');
};
