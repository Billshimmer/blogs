'use strict';

/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import CoreManager from '../src/CoreManager';
import isRevocableSession from '../src/isRevocableSession';
import ParseError from '../src/ParseError';
import ParseObject from '../src/ParseObject';
import ParsePromise from '../src/ParsePromise';
import ParseSession from '../src/ParseSession';
import Storage from '../src/Storage';

import CookieManager from 'lab4/apis/CookieManager';
import EventEmitter from 'lab4/core/emitter/EventEmitter';
const AUTH_COOKIE_KEY = 'uid';

import type { AttributeMap } from '../src/ObjectStateMutations';
import type { RequestOptions, FullOptions } from '../src/RESTController';

export type AuthData = ?{ [key: string]: mixed };

var CURRENT_USER_KEY = 'currentUser';
var canUseCurrentUser = !CoreManager.get('IS_NODE');

var currentUserCache = undefined; //当前用户的缓存 undefined表示未与磁盘缓存同步，null表示用户未登录，其他表示用户Parse 对象
var currentUserCacheMatchesDisk = false; //用户内存缓存是否与磁盘缓存匹配(其实可以没有这个变量，未同步用 currentUserCache === undefined 表示)

var authProviders = {};

/**
 * @class LABUser
 * @constructor
 * NOTE 设计成只要用户已登录则currentUserCache一定存在,所以在程序初始化时必须先加载用户数据
 */
export default class LABUser extends ParseObject {
  constructor(attributes: ?AttributeMap) {
    super('_User');
    if (attributes && typeof attributes === 'object'){
      if (!this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Parse User');
      }
    }
  }

  /**
   * Request a revocable session token to replace the older style of token.
   * @method _upgradeToRevocableSession
   * @param {Object} options A Backbone-style options object.
   * @return {Parse.Promise} A promise that is resolved when the replacement
   *   token has been fetched.
   */
  _upgradeToRevocableSession(options: RequestOptions): ParsePromise {
    options = options || {};

    var upgradeOptions = {};
    if (options.hasOwnProperty('useMasterKey')) {
      upgradeOptions.useMasterKey = options.useMasterKey;
    }

    var controller = CoreManager.getUserController();
    return ParsePromise._thenRunCallbacks(controller.upgradeToRevocableSession(
      this,
      upgradeOptions
    ), options);
  }

  /**
   * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
   * call linkWith on the user (even if it doesn't exist yet on the server).
   * @method _linkWith
   */
  _linkWith(provider, options: { authData?: AuthData }): ParsePromise {
    var authType;
    if (typeof provider === 'string') {
      authType = provider;
      provider = authProviders[provider];
    } else {
      authType = provider.getAuthType();
    }
    if (options && options.hasOwnProperty('authData')) {
      var authData = this.get('authData') || {};
      authData[authType] = options.authData;

      var controller = CoreManager.getUserController();
      return ParsePromise._thenRunCallbacks(controller.linkWith(
        this,
        authData
      ), options, this);
    } else {
      var promise = new ParsePromise();
      provider.authenticate({
        success: (provider, result) => {
          var opts = {};
          opts.authData = result;
          if (options.success) {
            opts.success = options.success;
          }
          if (options.error) {
            opts.error = options.error;
          }
          this._linkWith(provider, opts).then(() => {
            promise.resolve(this);
          }, (error) => {
            promise.reject(error);
          });
        },
        error: (provider, error) => {
          if (options.error) {
            options.error(this, error);
          }
          promise.reject(error);
        }
      });
      return promise;
    }
  }

  /**
   * Synchronizes auth data for a provider (e.g. puts the access token in the
   * right place to be used by the Facebook SDK).
   * @method _synchronizeAuthData
   */
  _synchronizeAuthData(provider: string) {
    if (!this.isCurrent() || !provider) {
      return;
    }
    var authType;
    if (typeof provider === 'string') {
      authType = provider;
      provider = authProviders[authType];
    } else {
      authType = provider.getAuthType();
    }
    var authData = this.get('authData');
    if (!provider || typeof authData !== 'object') {
      return;
    }
    var success = provider.restoreAuthentication(authData[authType]);
    if (!success) {
      this._unlinkFrom(provider);
    }
  }

  /**
   * Synchronizes authData for all providers.
   * @method _synchronizeAllAuthData
   */
  _synchronizeAllAuthData() {
    var authData = this.get('authData');
    if (typeof authData !== 'object') {
      return;
    }

    for (var key in authData) {
      this._synchronizeAuthData(key);
    }
  }

  /**
   * Removes null values from authData (which exist temporarily for
   * unlinking)
   * @method _cleanupAuthData
   */
  _cleanupAuthData() {
    if (!this.isCurrent()) {
      return;
    }
    var authData = this.get('authData');
    if (typeof authData !== 'object') {
      return;
    }

    for (var key in authData) {
      if (!authData[key]) {
        delete authData[key];
      }
    }
  }

  /**
   * Unlinks a user from a service.
   * @method _unlinkFrom
   */
  _unlinkFrom(provider, options?: FullOptions) {
    var authType;
    if (typeof provider === 'string') {
      authType = provider;
      provider = authProviders[provider];
    } else {
      authType = provider.getAuthType();
    }
    return ParsePromise._thenRunCallbacks(this._linkWith(provider, { authData: null }).then(() => {
      this._synchronizeAuthData(provider);
      return ParsePromise.as(this);
    }), options);
  }

  /**
   * Checks whether a user is linked to a service.
   * @method _isLinked
   */
  _isLinked(provider): boolean {
    var authType;
    if (typeof provider === 'string') {
      authType = provider;
    } else {
      authType = provider.getAuthType();
    }
    var authData = this.get('authData') || {};
    return !!authData[authType];
  }

  /**
   * Deauthenticates all providers.
   * @method _logOutWithAll
   */
  _logOutWithAll() {
    var authData = this.get('authData');
    if (typeof authData !== 'object') {
      return;
    }

    for (var key in authData) {
      this._logOutWith(key);
    }
  }

  /**
   * Deauthenticates a single provider (e.g. removing access tokens from the
   * Facebook SDK).
   * @method _logOutWith
   */
  _logOutWith(provider) {
    if (!this.isCurrent()) {
      return;
    }
    if (typeof provider === 'string') {
      provider = authProviders[provider];
    }
    if (provider && provider.deauthenticate) {
      provider.deauthenticate();
    }
  }

  /**
   * Class instance method used to maintain specific keys when a fetch occurs.
   * Used to ensure that the session token is not lost.
   */
  _preserveFieldsOnFetch(): AttributeMap {
    return {
      sessionToken: this.get('sessionToken'),
    };
  }

  /**
   * Returns true if <code>current</code> would return this user.
   * @method isCurrent
   * @return {Boolean}
   */
  isCurrent(): boolean {
    var current = LABUser.current();
    return !!current && current.id === this.id;
  }

  /**
   * Returns get("username").
   * @method getUsername
   * @return {String}
   */
  getUsername(): ?string {
    return this.get('username');
  }

  /**
   * Calls set("username", username, options) and returns the result.
   * @method setUsername
   * @param {String} username
   * @param {Object} options A Backbone-style options object.
   * @return {Boolean}
   */
  setUsername(username: string) {
    // Strip anonymity, even we do not support anonymous user in js SDK, we may
    // encounter anonymous user created by android/iOS in cloud code.
    var authData = this.get('authData');
    if (authData && authData.hasOwnProperty('anonymous')) {
      // We need to set anonymous to null instead of deleting it in order to remove it from Parse.
      authData.anonymous = null;
    }
    this.set('username', username);
  }

  /**
   * Calls set("password", password, options) and returns the result.
   * @method setPassword
   * @param {String} password
   * @param {Object} options A Backbone-style options object.
   * @return {Boolean}
   */
  setPassword(password: string) {
    this.set('password', password);
  }

  /**
   * Returns get("email").
   * @method getEmail
   * @return {String}
   */
  getEmail(): ?string {
    return this.get('email');
  }

  /**
   * Calls set("email", email, options) and returns the result.
   * @method setEmail
   * @param {String} email
   * @param {Object} options A Backbone-style options object.
   * @return {Boolean}
   */
  setEmail(email: string) {
    this.set('email', email);
  }

  /**
   * Returns the session token for this user, if the user has been logged in,
   * or if it is the result of a query with the master key. Otherwise, returns
   * undefined.
   * @method getSessionToken
   * @return {String} the session token, or undefined
   */
  getSessionToken(): ?string {
    return this.get('sessionToken');
  }

  /**
   * Checks whether this user is the current user and has been authenticated.
   * @method authenticated
   * @return (Boolean) whether this user is the current user and is logged in.
   */
  authenticated(): boolean {
    var current = LABUser.current();
    return (
      !!this.get('sessionToken') &&
      !!current &&
      current.id === this.id
    );
  }

  /**
   * Signs up a new user. You should call this instead of save for
   * new Parse.Users. This will create a new Parse.User on the server, and
   * also persist the session on disk so that you can access the user using
   * <code>current</code>.
   *
   * <p>A username and password must be set before calling signUp.</p>
   *
   * <p>Calls options.success or options.error on completion.</p>
   *
   * @method signUp
   * @param {Object} attrs Extra fields to set on the new user, or null.
   * @param {Object} options A Backbone-style options object.
   * @return {Parse.Promise} A promise that is fulfilled when the signup
   *     finishes.
   */
  signUp(attrs: AttributeMap, options: FullOptions): ParsePromise {
    options = options || {};

    var signupOptions = {};
    if (options.hasOwnProperty('useMasterKey')) {
      signupOptions.useMasterKey = options.useMasterKey;
    }
    if (options.hasOwnProperty('installationId')) {
      signupOptions.installationId = options.installationId;
    }

    var controller = CoreManager.getUserController();
    return ParsePromise._thenRunCallbacks(controller.signUp(
      this,
      attrs,
      signupOptions
    ), options, this);
  }

  /**
   * Logs in a Parse.User. On success, this saves the session to disk,
   * so you can retrieve the currently logged in user using
   * <code>current</code>.
   *
   * <p>A username and password must be set before calling logIn.</p>
   *
   * <p>Calls options.success or options.error on completion.</p>
   *
   * @method logIn
   * @param {Object} options A Backbone-style options object.
   * @return {Parse.Promise} A promise that is fulfilled with the user when
   *     the login is complete.
   */
  logIn(attrs: AttributeMap, options: FullOptions): ParsePromise {
    options = options || {};

    var loginOptions = {};
    if (options.hasOwnProperty('useMasterKey')) {
      loginOptions.useMasterKey = options.useMasterKey;
    }
    if (options.hasOwnProperty('installationId')) {
      loginOptions.installationId = options.installationId;
    }

    var controller = CoreManager.getUserController();
    return ParsePromise._thenRunCallbacks(controller.logIn(this, attrs, loginOptions), options, this);
  }

  /**
   * Wrap the default save behavior with functionality to save to local
   * storage if this is current user.
   */
  save(...args: Array<any>): ParsePromise {
    return super.save.apply(this, args).then(() => {
      if (this.isCurrent()) {
        return CoreManager.getUserController().updateUserOnDisk(this);
      }
      return this;
    });
  }

  /**
   * Wrap the default destroy behavior with functionality that logs out
   * the current user when it is destroyed
   */
  destroy(...args: Array<any>): ParsePromise {
    return super.destroy.apply(this, args).then(() => {
      if (this.isCurrent()) {
        return CoreManager.getUserController().removeUserFromDisk();
      }
      return this;
    });
  }

  /**
   * Wrap the default fetch behavior with functionality to save to local
   * storage if this is current user.
   */
  fetch(...args: Array<any>): ParsePromise {
    return super.fetch.apply(this, args).then(() => {
      if (this.isCurrent()) {
        return CoreManager.getUserController().updateUserOnDisk(this);
      }
      return this;
    });
  }

  static readOnlyAttributes() {
    return ['sessionToken'];
  }

  /**
   * Adds functionality to the existing Parse.User class
   * @method extend
   * @param {Object} protoProps A set of properties to add to the prototype
   * @param {Object} classProps A set of static properties to add to the class
   * @static
   * @return {Class} The newly extended Parse.User class
   */
  static extend(protoProps, classProps) {
    if (protoProps) {
      for (var prop in protoProps) {
        if (prop !== 'className') {
          Object.defineProperty(LABUser.prototype, prop, {
            value: protoProps[prop],
            enumerable: false,
            writable: true,
            configurable: true
          });
        }
      }
    }

    if (classProps) {
      for (var prop in classProps) {
        if (prop !== 'className') {
          Object.defineProperty(LABUser, prop, {
            value: classProps[prop],
            enumerable: false,
            writable: true,
            configurable: true
          });
        }
      }
    }

    return LABUser;
  }

  /**
   * Retrieves the currently logged in LABUser with a valid session,
   * either from memory or localStorage, if necessary.
   * @method current
   * @static
   * @return {Parse.Object} The currently logged in Parse.User.
   */
  static current(): ?LABUser {
    if (!canUseCurrentUser) {
      return null;
    }
    var controller = CoreManager.getUserController();
    return controller.currentUser();
  }

  /**
   * Retrieves the currently logged in LABUser from asynchronous Storage.
   * @method currentAsync
   * @static
   * @return {Parse.Promise} A Promise that is resolved with the currently
   *   logged in Parse User
   */
  static currentAsync(): ParsePromise {
    if (!canUseCurrentUser) {
      return ParsePromise.as(null);
    }
    var controller = CoreManager.getUserController();
    return controller.currentUserAsync();
  }

  /**
   * Signs up a new user with a username (or email) and password.
   * This will create a new Parse.User on the server, and also persist the
   * session in localStorage so that you can access the user using
   * {@link #current}.
   *
   * <p>Calls options.success or options.error on completion.</p>
   *
   * @method signUp
   * @param {String} username The username (or email) to sign up with.
   * @param {String} password The password to sign up with.
   * @param {Object} attrs Extra fields to set on the new user.
   * @param {Object} options A Backbone-style options object.
   * @static
   * @return {Parse.Promise} A promise that is fulfilled with the user when
   *     the signup completes.
   */
  static signUp(username, password, attrs, options) {
    attrs = attrs || {};
    attrs.username = username;
    attrs.password = password;
    var user = new LABUser(attrs);
    return user.signUp({}, options);
  }

  /**
   * Logs in a user with a username (or email) and password. On success, this
   * saves the session to disk, so you can retrieve the currently logged in
   * user using <code>current</code>.
   *
   * <p>Calls options.success or options.error on completion.</p>
   *
   * @method logIn
   * @param {String} username The username (or email) to log in with.
   * @param {String} password The password to log in with.
   * @param {Object} options A Backbone-style options object.
   * @static
   * @return {Parse.Promise} A promise that is fulfilled with the user when
   *     the login completes.
   */
  static logIn(username, password, attrs, options) {
    if (typeof username !== 'string') {
      return ParsePromise.error(
        new ParseError(
          ParseError.OTHER_CAUSE,
          'Username must be a string.'
        )
      );
    } else if (typeof password !== 'string') {
      return ParsePromise.error(
        new ParseError(
          ParseError.OTHER_CAUSE,
          'Password must be a string.'
        )
      );
    }
    var user = new LABUser();
    user._finishFetch({ username: username, password: password });
    return user.logIn(attrs, options);
  }

  /**
   * Logs in a user with a session token. On success, this saves the session
   * to disk, so you can retrieve the currently logged in user using
   * <code>current</code>.
   *
   * <p>Calls options.success or options.error on completion.</p>
   *
   * @method become
   * @param {String} sessionToken The sessionToken to log in with.
   * @param {Object} options A Backbone-style options object.
   * @static
   * @return {Parse.Promise} A promise that is fulfilled with the user when
   *     the login completes.
   */
  static become(sessionToken, options) {
    if (!canUseCurrentUser) {
      throw new Error(
        'It is not memory-safe to become a user in a server environment'
      );
    }
    options = options || {};

    var becomeOptions: RequestOptions = {
      sessionToken: sessionToken
    };
    if (options.hasOwnProperty('useMasterKey')) {
      becomeOptions.useMasterKey = options.useMasterKey;
    }

    var controller = CoreManager.getUserController();
    return ParsePromise._thenRunCallbacks(controller.become(becomeOptions), options);
  }

  static logInWith(provider, options) {
    return LABUser._logInWith(provider, options);
  }

  /**
   * Logs out the currently logged in user session. This will remove the
   * session from disk, log out of linked services, and future calls to
   * <code>current</code> will return <code>null</code>.
   * @method logOut
   * @static
   * @return {Parse.Promise} A promise that is resolved when the session is
   *   destroyed on the server.
   */
  static logOut() {
    if (!canUseCurrentUser) {
      throw new Error(
        'There is no current user user on a node.js server environment.'
      );
    }

    var controller = CoreManager.getUserController();
    return controller.logOut();
  }

  /**
   * Requests a password reset email to be sent to the specified email address
   * associated with the user account. This email allows the user to securely
   * reset their password on the Parse site.
   *
   * <p>Calls options.success or options.error on completion.</p>
   *
   * @method requestPasswordReset
   * @param {String} email The email address associated with the user that
   *     forgot their password.
   * @param {Object} options A Backbone-style options object.
   * @static
   */
  static requestPasswordReset(email, options) {
    options = options || {};

    var requestOptions = {};
    if (options.hasOwnProperty('useMasterKey')) {
      requestOptions.useMasterKey = options.useMasterKey;
    }

    var controller = CoreManager.getUserController();
    return ParsePromise._thenRunCallbacks(controller.requestPasswordReset(
      email, requestOptions
    ), options);
  }

  /**
   * Allow someone to define a custom User class without className
   * being rewritten to _User. The default behavior is to rewrite
   * User to _User for legacy reasons. This allows developers to
   * override that behavior.
   *
   * @method allowCustomUserClass
   * @param {Boolean} isAllowed Whether or not to allow custom User class
   * @static
   */
  static allowCustomUserClass(isAllowed: boolean) {
    CoreManager.set('PERFORM_USER_REWRITE', !isAllowed);
  }

  /**
   * Allows a legacy application to start using revocable sessions. If the
   * current session token is not revocable, a request will be made for a new,
   * revocable session.
   * It is not necessary to call this method from cloud code unless you are
   * handling user signup or login from the server side. In a cloud code call,
   * this function will not attempt to upgrade the current token.
   * @method enableRevocableSession
   * @param {Object} options A Backbone-style options object.
   * @static
   * @return {Parse.Promise} A promise that is resolved when the process has
   *   completed. If a replacement session token is requested, the promise
   *   will be resolved after a new token has been fetched.
   */
  static enableRevocableSession(options) {
    options = options || {};
    CoreManager.set('FORCE_REVOCABLE_SESSION', true);
    if (canUseCurrentUser) {
      var current = LABUser.current();
      if (current) {
        return current._upgradeToRevocableSession(options);
      }
    }
    return ParsePromise.as()._thenRunCallbacks(options);
  }

  /**
   * Enables the use of become or the current user in a server
   * environment. These features are disabled by default, since they depend on
   * global objects that are not memory-safe for most servers.
   * @method enableUnsafeCurrentUser
   * @static
   */
  static enableUnsafeCurrentUser() {
    canUseCurrentUser = true;
  }

  /**
   * Disables the use of become or the current user in any environment.
   * These features are disabled on servers by default, since they depend on
   * global objects that are not memory-safe for most servers.
   * @method disableUnsafeCurrentUser
   * @static
   */
  static disableUnsafeCurrentUser() {
    canUseCurrentUser = false;
  }

  static _registerAuthenticationProvider(provider) {
    authProviders[provider.getAuthType()] = provider;
    // Synchronize the current user with the auth provider.
    LABUser.currentAsync().then((current) => {
      if (current) {
        current._synchronizeAuthData(provider.getAuthType());
      }
    });
  }

  static _logInWith(provider, options) {
    var user = new LABUser();
    return user._linkWith(provider, options);
  }

  static _clearCache() {
    currentUserCache = undefined;
    currentUserCacheMatchesDisk = false;
  }

  //内部使用 不要传入undefined 因为 undefined代表初始状态
  static _setCurrentUserCache(user, emitEvent) {
    var oldUserCache = currentUserCache;
    currentUserCache = user;
    if (emitEvent === false) {
      return;
    }
    //在此判断用户登录状态的改变
    if (oldUserCache === undefined) {
      if (user) {
        //程序打开时第一次同步缓存数据，且缓存数据已登录
        LABUser.emitter.emit('init_login', user); //一般外部不关心，因为用户数据初始化早于界面渲染
      }
    } else if (oldUserCache) {
      if (user) {
        if (user.id !== oldUserCache.id) {
          //切换登录用户
          LABUser.emitter.emit('login', user, oldUserCache);
        }
      } else {
        //用户退出登录
        LABUser.emitter.emit('logout', oldUserCache);
      }
    } else if (user) {
      //用户登录
      LABUser.emitter.emit('login', user);
    }
  }

  // 用户事件总线
  static emitter = new EventEmitter();


  //
  // LAB扩展
  //

  /**
   * 是否已登录
   * 状态是当前缓存，也许cookie已过期
   */
  static isLoggedIn() {
    return !!currentUserCache;
  }

  /**
   * 从服务器获取新的当前用户数据，在当前用户存在的情况下调用，如app刚打开且有缓存的用户登陆状态
   */
  static updateCurrentUser() {
    var user = new LABUser();
    var RESTController = CoreManager.getRESTController();
    return RESTController.request(
      'GET', 'users/me', {}
    ).then(({ response, status }) => {
      user._finishFetch(response);
      user._setExisted(true);
      return DefaultController.setCurrentUser(user);
    })
    .catch((error) => {
      if ((error instanceof ParseError) && (error.code !== ParseError.CONNECTION_FAILED)) {
        //error.code XXX 约定未登录状态码
        //目前服务端返回错误直接算未登录
        DefaultController.removeUserFromDisk();
        error.isLoggedIn = false;
      }
      //网络错误，需要当成未登录么?
      return ParsePromise.reject(error);
    });
  }

  /**
   * 更新当前用户数据(不安全)，一般需要调用login save 更新和同步服务器数据，
   * 但如果是自己通过http请求获取了新的用户数据，则可以通过这个接口更新用户
   * @param attrs 登录用户的完整数据 TODO 应该可以更新当前用户而不是setCurrentUser
   */
  static unsafeUpdateCurrentUser(attrs) {
    var user = new LABUser();
    user._finishFetch(attrs);
    user._setExisted(true);
    return DefaultController.setCurrentUser(user);
  }

  /**
   * 退出当前用户，不调用服务器，直接本地删除
   * 同unsafeUpdateCurrentUser 不安全
   */
  static unsafeLogOut() {
    DefaultController.logOut(true);
  }
}

ParseObject.registerSubclass('_User', LABUser);

var DefaultController = {
  updateUserOnDisk(user) {
    var path = Storage.generatePath(CURRENT_USER_KEY);
    var json = user.toJSON();
    json.className = '_User';
    return Storage.setItemAsync(
      path, JSON.stringify(json)
    ).then(() => {
      return user;
    });
  },

  removeUserFromDisk() {
    let path = Storage.generatePath(CURRENT_USER_KEY);
    currentUserCacheMatchesDisk = true;
    LABUser._setCurrentUserCache(null);
    //删除cookie
    CookieManager.remove(AUTH_COOKIE_KEY, {
      path: '/',
    }).catch(() => {});
    return Storage.removeItemAsync(path);
  },

  setCurrentUser(user) {
    LABUser._setCurrentUserCache(user);
    user._cleanupAuthData();
    user._synchronizeAllAuthData();
    // 使用基于cookie的token机制，不使用sessionToken,设置一个假的.
    user._finishFetch({sessionToken: 'fake'});
    // 在android 上强制将cookie写入磁盘，防止进程被杀死之后登录状态无法保存
    CookieManager.flush();
    return DefaultController.updateUserOnDisk(user);
  },

  currentUser(): ?LABUser {
    if (currentUserCache) {
      return currentUserCache;
    }
    if (currentUserCacheMatchesDisk) {
      return null;
    }
    if (Storage.async()) {
      throw new Error(
        'Cannot call currentUser() when using a platform with an async ' +
        'storage system. Call currentUserAsync() instead.'
      );
    }
    var path = Storage.generatePath(CURRENT_USER_KEY);
    var userData = Storage.getItem(path);
    currentUserCacheMatchesDisk = true;
    if (!userData) {
      LABUser._setCurrentUserCache(null);
      return null;
    }
    userData = JSON.parse(userData);
    if (!userData.className) {
      userData.className = '_User';
    }
    if (userData._id) {
      if (userData.objectId !== userData._id) {
        userData.objectId = userData._id;
      }
      delete userData._id;
    }
    if (userData._sessionToken) {
      userData.sessionToken = userData._sessionToken;
      delete userData._sessionToken;
    }
    var current = ParseObject.fromJSON(userData);
    LABUser._setCurrentUserCache(current);
    current._synchronizeAllAuthData();
    return current;
  },

  currentUserAsync(): ParsePromise {
    if (currentUserCache) {
      return ParsePromise.as(currentUserCache)
    }
    if (currentUserCacheMatchesDisk) {
      return ParsePromise.as(null);
    }
    var path = Storage.generatePath(CURRENT_USER_KEY);
    //先检查登陆cookie有效性
    return CookieManager.get(AUTH_COOKIE_KEY)
      .then((auth) => {
        if (auth) {
          return Storage.getItemAsync(path);
        }
        return 0;
      }).then((userData) => {
        currentUserCacheMatchesDisk = true;
        if (!userData) {
          LABUser._setCurrentUserCache(null);
          return ParsePromise.as(userData === 0 ? null : false); // XXX 用false 表示 cookie处于登录状态但用户数据为空
        }
        userData = JSON.parse(userData);
        if (!userData.className) {
          userData.className = '_User';
        }
        if (userData._id) {
          if (userData.objectId !== userData._id) {
            userData.objectId = userData._id;
          }
          delete userData._id;
        }
        if (userData._sessionToken) {
          userData.sessionToken = userData._sessionToken;
          delete userData._sessionToken;
        }
        var current = ParseObject.fromJSON(userData);
        LABUser._setCurrentUserCache(current);
        current._synchronizeAllAuthData();
        return ParsePromise.as(current);
      }).catch((error) => {
        // 在出错的情况下 也保证用户数据被正确设置初始状态null
        currentUserCacheMatchesDisk = true;
        if (currentUserCache === undefined) {
          LABUser._setCurrentUserCache(null);
        }
        return ParsePromise.reject(error);
      });
  },

  signUp(user: LABUser, attrs: AttributeMap, options: RequestOptions): ParsePromise {
    // var username = (attrs && attrs.username) || user.get('username');
    // var password = (attrs && attrs.password) || user.get('password');
    //
    // if (!username || !username.length) {
    //   return ParsePromise.error(
    //     new ParseError(
    //       ParseError.OTHER_CAUSE,
    //       'Cannot sign up user with an empty name.'
    //     )
    //   );
    // }
    // if (!password || !password.length) {
    //   return ParsePromise.error(
    //     new ParseError(
    //       ParseError.OTHER_CAUSE,
    //       'Cannot sign up user with an empty password.'
    //     )
    //   );
    // }

    //不限制注册需要的信息

    return user.save(attrs, options).then(() => {
      // Clear the password field
      user._finishFetch({ password: undefined });

      if (canUseCurrentUser) {
        return DefaultController.setCurrentUser(user);
      }
      return user;
    });
  },

  logIn(user: LABUser, attrs: AttributeMap, options: RequestOptions): ParsePromise {
    var RESTController = CoreManager.getRESTController();
    var stateController = CoreManager.getObjectStateController();
    // var auth = {
    //   username: user.get('username'),
    //   password: user.get('password')
    // };
    // 扩展不限定登录需要提交的数据
    var auth = Object.assign({}, user.attributes, attrs);
    //XXX 原parse为GET
    return RESTController.request(
      'POST', 'login', auth, options
    ).then(({ response, status }) => {
      user._migrateId(response.objectId);
      user._setExisted(true);

      // LAB modify 由于修改了User的默认行为，调用logIn时会传入其它数据
      // 所以登录应该像save()一样最后调用_handleSaveResponse 将之前的pendingState 与服务器返回的数据合并
      // 但作为登录接口服务器应返回所有数据，所以这里简单处理，废弃原来的pendingState
      stateController.popPendingState(user._getStateIdentifier());

      // stateController.setPendingOp(
      //   user._getStateIdentifier(), 'username', undefined
      // );
      stateController.setPendingOp(
        user._getStateIdentifier(), 'password', undefined
      );
      response.password = undefined;
      user._finishFetch(response);
      if (!canUseCurrentUser) {
        // We can't set the current user, so just return the one we logged in
        return ParsePromise.as(user);
      }
      return DefaultController.setCurrentUser(user);
    });
  },

  become(options: RequestOptions): ParsePromise {
    var user = new LABUser();
    var RESTController = CoreManager.getRESTController();
    return RESTController.request(
      'GET', 'users/me', {}, options
    ).then(({ response, status }) => {
      user._finishFetch(response);
      user._setExisted(true);
      return DefaultController.setCurrentUser(user);
    });
  },

  /**
   * @param noSync 为true 则不与服务器同步 只删除本地
   */
  logOut(noSync): ParsePromise {
    return DefaultController.currentUserAsync().then((currentUser) => {
      var path = Storage.generatePath(CURRENT_USER_KEY);
      var promise = Storage.removeItemAsync(path);
      //删除cookie 不关心成功与失败
      CookieManager.remove(AUTH_COOKIE_KEY, {
        path: '/',
      }).catch(() => {});
      var RESTController = CoreManager.getRESTController();
      if (!noSync && currentUser !== null) {
        var currentSession = currentUser.getSessionToken();
        if (currentSession && isRevocableSession(currentSession)) {
          promise = promise.then(() => {
            return RESTController.request(
              'POST', 'logout', {}, { sessionToken: currentSession }
            );
          });
        }
        currentUser._logOutWithAll();
        currentUser._finishFetch({ sessionToken: undefined });
      }
      currentUserCacheMatchesDisk = true;
      LABUser._setCurrentUserCache(null);

      return promise;
    });
  },

  requestPasswordReset(email: string, options: RequestOptions) {
    var RESTController = CoreManager.getRESTController();
    return RESTController.request(
      'POST',
      'requestPasswordReset',
      { email: email },
      options
    );
  },

  upgradeToRevocableSession(user: LABUser, options: RequestOptions) {
    var token = user.getSessionToken();
    if (!token) {
      return ParsePromise.error(
        new ParseError(
          ParseError.SESSION_MISSING,
          'Cannot upgrade a user with no session token'
        )
      );
    }

    options.sessionToken = token;

    var RESTController = CoreManager.getRESTController();
    return RESTController.request(
      'POST',
      'upgradeToRevocableSession',
      {},
      options
    ).then(({response}) => {
      var session = new ParseSession();
      session._finishFetch(response);
      user._finishFetch({ sessionToken: session.getSessionToken() });
      if (user.isCurrent()) {
        return DefaultController.setCurrentUser(user);
      }
      return ParsePromise.as(user);
    });
  },

  linkWith(user: LABUser, authData: AuthData) {
    return user.save({ authData }).then(() => {
      if (canUseCurrentUser) {
        return DefaultController.setCurrentUser(user);
      }
      return user;
    });
  }
};

CoreManager.setUserController(DefaultController);
