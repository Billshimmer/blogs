'use strict';

let fs = require('fs');
let path = require('path');
let buildUtils = require('./buildUtils');

//获取图片名 去除@像素密度标记
// 去除扩展名
function getImgName(name) {
  return name.replace(/(@\dx)*\.[A-Za-z]+$/, '');
}

function rBuildImgs(dirPath, relativeDirPath, outSet, imageBlackMap, depth) {
  let children = fs.readdirSync(dirPath),
    i = 0,
    len = children.length,
    childPath,
    childName,
    stats,
    extName,
    imageKey;
  for (; i < len; ++i) {
    childName = children[i];
    if (childName.charAt(0) == '.') {
      continue;
    }
    childPath = path.join(dirPath, childName);
    stats = fs.lstatSync(childPath);
    if (stats.isDirectory()) {
      if (depth === 1 && !imageBlackMap[childName]) {
        // 简单处理 黑名单只对第一层的目录有效
        rBuildImgs(childPath, relativeDirPath + childName + '/', outSet);
      }

    } else {
      extName = path.extname(childName);
      imageKey = relativeDirPath + getImgName(childName);
      if (outSet[imageKey] && (outSet[imageKey] !== extName)) {
        console.warn(`目录:${relativeDirPath} 下，发现名字相同但扩展名不同的图片！${outSet[imageKey]} ${extName}`);
      }
      outSet[imageKey] = extName;
    }
  }
}

/**
 * config: {
 *   imageBlacklist,
 *   imgDir,
 *   projectName,
 * }
 */
module.exports = function buildImages(config) {
  if (config.DEBUG) console.log('buildImages begin');
  let imageBlackMap = config.imageBlacklist.reduce((prev, value) => {
    prev[value] = true;
    return prev;
  }, {});
  let imgSet = Object.create(null);
  if (fs.existsSync(config.imgDir)) {
    rBuildImgs(config.imgDir, '', imgSet, imageBlackMap, 1);
  }
  let output = [];
  output.push('\'use strict\';');
  output.push('module.exports = {');
  let keys = Object.keys(imgSet);
  let imageKey;
  for (let i = 0; i < keys.length; ++i) {
    imageKey = keys[i];
    output.push('  get \'' + imageKey + '\'() {return ' + buildUtils.buildRequireCode(config.projectName, path.relative(config.projectRoot, config.imgDir) + '/' + imageKey + imgSet[imageKey]) + '},');
  }
  output.push('};');
  // let imgOutFile = path.join(config.projectRoot, config.outputDir, config.IMG_OUT_FILE_NAME);
  // if (config.DEBUG) console.log('buildImages writeFile: ' + imgOutFile);
  // fs.writeFileSync(imgOutFile, output.join('\n'), 'utf8');
  if (config.DEBUG) console.log('buildImages end');
  return output.join('\n');
};
