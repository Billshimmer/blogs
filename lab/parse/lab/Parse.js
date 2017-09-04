'use strict';

// XXX parse 内部文件有循环引用  必须使用正确的引用顺序
import decode from '../src/decode';
import encode from '../src/encode';
import CoreManager from '../src/CoreManager';
import InstallationController from '../src/InstallationController';
import * as ParseOp from '../src/ParseOp';
import RESTController from '../src/RESTController';
import ParseError from '../src/ParseError';
import ParseObject from '../src/ParseObject';
import LABUser from './LABUser';

/**
 * Contains all Parse API classes and functions.
 * @class Parse
 * @static
 */
const Parse = {
  /**
   * Call this method first to set up your authentication tokens for Parse.
   * You can get your keys from the Data Browser on parse.com.
   * @method initialize
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey (optional) Your Parse JavaScript Key (Not needed for parse-server)
   * @param {String} masterKey (optional) Your Parse Master Key. (Node.js only!)
   * @static
   */
  initialize(applicationId: string, javaScriptKey: string) {
    // if (process.env.PARSE_BUILD === 'browser' && CoreManager.get('IS_NODE')) {
    //   console.log(
    //     'It looks like you\'re using the browser version of the SDK in a ' +
    //     'node.js environment. You should require(\'parse/node\') instead.'
    //   );
    // }
    Parse._initialize(applicationId, javaScriptKey);
  },

  _initialize(applicationId: string, javaScriptKey: string, masterKey: string) {
    CoreManager.set('APPLICATION_ID', applicationId);
    CoreManager.set('JAVASCRIPT_KEY', javaScriptKey);
    CoreManager.set('MASTER_KEY', masterKey);
    CoreManager.set('USE_MASTER_KEY', false);
  },

  // ACL: require('../src/ParseACL').default,
  // Analytics: require('../src/Analytics').default,
  // Cloud: require('../src/Cloud').default,
  CoreManager,
  // Config: require('../src/ParseConfig').default,
  Error: ParseError,
  // Parse.FacebookUtils: require('../src/FacebookUtils').default,
  // Parse.File: require('../src/ParseFile').default,
  // Parse.GeoPoint: require('../src/ParseGeoPoint').default,
  // Parse.Installation: require('../src/ParseInstallation').default,
  Object: ParseObject,
  Op: {
    Set: ParseOp.SetOp,
    Unset: ParseOp.UnsetOp,
    Increment: ParseOp.IncrementOp,
    Add: ParseOp.AddOp,
    Remove: ParseOp.RemoveOp,
    AddUnique: ParseOp.AddUniqueOp,
    Relation: ParseOp.RelationOp
  },
  // get Promise() {return require('../src/ParsePromise').default},
  // Push = require('../src/Push').default,
  // get Query() {return require('../src/ParseQuery').default},
  // get Relation() {return require('../src/ParseRelation').default},
  // Role: require('../src/ParseRole').default,
  // Session: require('../src/ParseSession').default,
  // get Storage() {return require('../src/Storage').default},
  // User: require('../src/ParseUser').default,
  // get LiveQuery() {return require('../src/ParseLiveQuery').default},
  // get LiveQueryClient() {return require('../src/LiveQueryClient').default},

  User: LABUser,
};

// Parse._request = function(...args) {
//   return CoreManager.getRESTController().request.apply(null, args);
// };
// Parse._ajax = function(...args) {
//   return CoreManager.getRESTController().ajax.apply(null, args);
// };
// // We attempt to match the signatures of the legacy versions of these methods
// Parse._decode = function(_, value) {
//   return decode(value);
// }
// Parse._encode = function(value, _, disallowObjects) {
//   return encode(value, disallowObjects);
// }
// Parse._getInstallationId = function() {
//   return CoreManager.getInstallationController().currentInstallationId();
// }

CoreManager.setInstallationController(InstallationController);
CoreManager.setRESTController(RESTController);

export default Parse;
