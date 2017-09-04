'use strict';

let fs = require('fs');
let path = require('path');
let buildUtils = require('./buildUtils');

function getCompFullName(compsFile, compDir) {
  return path.relative(compsFile, compDir).replace(/\\|\//g, '.');
}

function buildCompConfigObj({dirPath, outMap, entryFile, compsFile, isCompDic, requireRoot, projectName, filter}) {
  const relativePath = path.relative(requireRoot, dirPath).replace(/\\/g, '/');
  const fullName = getCompFullName(compsFile, dirPath) + (isCompDic ? '' : '.' + entryFile);

  // 过滤不需要的comp
  if (filter(fullName)) {
    Object.assign(outMap, buildUtils.markObjConfig({
      path: relativePath + '/' + entryFile,
      requirePath: projectName + '/' + relativePath + '/' + entryFile,
      entryFile,
      fullName,
    }));
  }
}

/**
 * 递归获取comps配置对象
 * @param dirPath 目录绝对路径
 * @param dirName 目录名
 * @param outMap 输出对象
 * @param compsFile comps文件的绝对路径
 */
function recursionCompsDir({dirPath, dirName, outMap, compsFile, requireRoot, projectName, filter}) {
  let children,
    i = 0,
    len,
    stats,
    childName,
    childPath,
    entryFile;
  if (fs.existsSync(path.join(dirPath, 'index.js')) && (fs.lstatSync(path.join(dirPath, 'index.js'))).isFile()) {
    entryFile = 'index';
  } else if (dirName && fs.existsSync(path.join(dirPath, dirName + '.js')) && (fs.lstatSync(path.join(dirPath, dirName + '.js'))).isFile()) {
    entryFile = dirName;
  }
  if (entryFile) {
    //当前目录存在入口文件 则该目录就为组件目录
    buildCompConfigObj({dirPath, outMap, entryFile, compsFile, isCompDic: true, requireRoot, projectName, filter});
  } else {
    //不存在入口文件 遍历所有子文件
    children = fs.readdirSync(dirPath);
    len = children.length;
    for (; i < len; ++i) {
      childName = children[i];
      if (childName.charAt(0) == '.') {
        continue;
      }
      childPath = path.join(dirPath, childName);
      stats = fs.lstatSync(childPath);
      if (stats.isDirectory()) {
        outMap[childName] = Object.create(null);
        recursionCompsDir({dirPath: childPath, dirName: childName, outMap: outMap[childName], compsFile, requireRoot, projectName, filter});
      } else if (/^[A-Z][_a-zA-Z0-9]*\.js$/.test(childName)) {
        //以大写字母开头符合类命名标准的文件也认为是组件入口文件
        entryFile = childName.substr(0, childName.length - 3);
        outMap[entryFile] = Object.create(null);
        buildCompConfigObj({dirPath, outMap: outMap[entryFile], entryFile, compsFile, isCompDic: false, requireRoot, projectName, filter});
      }
    }
  }
}

function buildGetter1(requirePath, name, fullName) {
  return `get ${name}() {return x1('${fullName}', this)},`;
}

function buildGetter2(requirePath, fullName) {
  return `get '${fullName}'() {return x('${fullName}', require('${requirePath}'), this)},`;
}

function buildDefine(requirePath, fullName) {
  return `d('${fullName}', () => require('${requirePath}'));`;
}

function recursionBuildCompsOut(obj, output1, output2, depth) {
  let indent = buildUtils.repeatStr('  ', depth),
    keys = Object.keys(obj),
    i = 0,
    key,
    child;
  for (; i < keys.length; ++i) {
    key = keys[i];
    child = obj[key];
    if (buildUtils.isConfigObj(child)) {
      output1.push(indent + buildGetter1(child.requirePath, key, child.fullName));
      // output2.push('  ' + buildGetter2(child.requirePath, child.fullName));
      output2.push(buildDefine(child.requirePath, child.fullName));
    } else {
      output1.push(indent + key + ': {');
      recursionBuildCompsOut(child, output1, output2, depth + 1);
      output1.push(indent + '},');
    }
  }
}

const CODE_X1 = `function x1(fullName, context) {
  const comp = cps2[fullName];
  let lastDotIndex = fullName.lastIndexOf('.') + 1;
  Object.defineProperty(context, fullName.slice(lastDotIndex), {
    value: comp,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  return comp;
}`;

const CODE_X = `function x(fullName, comp) {
  comp = __requireDefault(comp);
  comp.comp_name = fullName;
  if (comp.WrappedComponent) {
    //redux container
    comp.WrappedComponent.comp_name = fullName;
  }
  Object.defineProperty(cps2, fullName, {
    value: comp,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  return comp;
}`;

const CODE_DEFINE_GETTER = `function d(fullName, getter) {
  Object.defineProperty(cps2, fullName, {
    get: function () {
      return x(fullName, getter());
    },
    enumerable: true,
    configurable: true,
  });
}`;


function getStruct(compsFile, requireRoot, projectName, filter) {
  let outMap = Object.create(null);
  if (fs.existsSync(compsFile)) {
    recursionCompsDir({
      dirPath: compsFile,
      outMap,
      compsFile,
      requireRoot,
      projectName,
      filter
    });
  }
  return outMap;
}

/**
 * @param config: {
 *   projectConfigs,
 *   compFilter,
 *   outputDir,
 *   compsDir, //相对于projectRoot
 *   compFilter,
 * }
 */
module.exports = function buildComps(config) {
  if (config.DEBUG) console.log('buildComps begin', config);

  let outMap = config.projectConfigs.reduce((prevMap, projectConfig) => {
    let outMap = getStruct(
      path.join(projectConfig.projectRoot, config.compsDir),
      projectConfig.requireRoot,
      projectConfig.projectName,
      config.compFilter
    );
    if (prevMap) {
      outMap = buildUtils.inhert(outMap, prevMap);
    }
    return outMap;
  }, null);

  //console.log('buildComps outMap:', outMap);

  // 已由compFilter 代替
  // if (config.packageWhiteList) {
  //   outMap = config.packageWhiteList.reduce((prev, value) => {
  //     if (outMap[value]) {
  //       prev[value] = outMap[value];
  //     }
  //     return prev;
  //   }, {});
  // }

  // if (config.DEBUG) {
  //   buildUtils.outputSimpleObj(outMap, path.join(config.projectRoot, config.outputDir, config.COMPS_STRUCT_OUT_FILE_NAME));
  // }
  //输出代码文件
  let output = [];
  output.push('\'use strict\';');

  let output1 = [];
  let output2 = [];
  recursionBuildCompsOut(outMap, output1, output2, 1);

  output.push(CODE_X);
  output.push(CODE_DEFINE_GETTER);
  output.push('const cps2 = {};');
  output = output.concat(output2);

  output.push('const cps1 = function () {');
  output.push(CODE_X1);
  output.push('return {');
  output = output.concat(output1);
  output.push('}};');

  output.push('module.exports = {');
  output.push('  cps1,');
  output.push('  cps2,');
  output.push('};');
  // let compsOutFile = path.join(config.projectRoot, config.outputDir, config.COMPS_OUT_FILE_NAME);
  // if (config.DEBUG) console.log('buildComps writeFile: ' + compsOutFile);
  // fs.writeFileSync(compsOutFile, output.join('\n'), 'utf8');
  if (config.DEBUG) console.log('buildComps end');
  return output.join('\n');
};
