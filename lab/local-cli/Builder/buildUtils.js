'use strict';

let fs = require('fs');
let path = require('path');

let utils = module.exports;

utils.outputSimpleObj = function outputSimpleObj(obj, file) {
  fs.writeFileSync(file, JSON.stringify(obj), 'utf8');
};

utils.repeatStr = function repeatStr(str, n) {
  let ret = '';
  while (n-- > 0) {
    ret += str;
  }
  return ret;
};

/**
 * 构建require代码
 * @param projectName
 * @param path 相对于工程根目录的路径
 * @param def 是否加.default
 */
utils.buildRequireCode = function buildRequireCode(projectName, path, def) {
  let code = 'require(\'' + projectName + '/' + path.replace(/\\/g, '/') + '\')';
  if (def) {
    return code + '.default';
  }
  return code;
};

utils.markObjConfig = function markObjConfig(obj) {
  obj['__$config'] = true;
  return obj;
};

function isConfigObj(obj) {
  return '__$config' in obj;
}

utils.isConfigObj = isConfigObj;

utils.inhert = function inhert(obj, obj1) {
  rInhert(obj, obj1);
  return obj;
};

//递归继承
function rInhert(obj, obj1) {
  let keys = Object.keys(obj1),
    key,
    i = 0,
    objChild,
    obj1Child;
  for (; i < keys.length; ++i) {
    key = keys[i];
    obj1Child = obj1[key];
    if (isConfigObj(obj1Child) || !(key in obj)) {
      obj[key] = obj1Child;
    } else {
      objChild = obj[key];
      if (isConfigObj(objChild)) {
        //一般不会发生
        console.log('buildUtils rInhert isConfigObj(objChild) obj:', obj, ' key:', key);
        obj[key] = obj1Child;
      } else {
        rInhert(objChild, obj1Child);
      }
    }
  }
}

// let emptyDirSync = function(dir) {
//   let files = fs.readdirSync(dir);
//   files.forEach(function(file) {
//     let stats = fs.statSync(dir + '/' + file);
//     if (stats.isDirectory()) {
//       emptyDirSync(dir + '/' + file);
//     } else {
//       fs.unlinkSync(dir + '/' + file);
//     }
//   });
// }
// utils.emptyDirSync = emptyDirSync;

utils.createProjectConfigs = function(projectRoots, mainProjectRoot) {
  return projectRoots.map((projectRoot) => {
    let packageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return {
        projectRoot,
        requireRoot: projectRoot,
        projectName: require(packageJsonPath).name,
      };
    } else {
      console.log('buildUtils createProjectConfigs projectRoot:', projectRoot, 'have no package.json');
      return {
        projectRoot,
        requireRoot: mainProjectRoot,
        projectName: config.projectName,
      };
    }
  });
}
