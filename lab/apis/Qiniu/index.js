'use strict';

import { Platform } from 'react-native';
import { axios, DI, utils } from 'lab4';
import PromiseQueue from 'promise-queue';

const DEF_QINIU_UPLOAD_URL = 'http://upload.qiniu.com';

class Qiniu {
  constructor() {
    const config = DI.getConfig();
    if (config.extra.qiniu) {
      this._tokenUrl = config.extra.qiniu.tokenUrl;
      this._uploadUrl = config.extra.uploadUrl || DEF_QINIU_UPLOAD_URL;
    }
    if (!this._tokenUrl) {
      throw new Error('未配置七牛tokenUrl');
    }

    this._taskQueue = new PromiseQueue(2);
  }

  /**
   * 初始化
   * @param options
   * {
   *   tokenConifg: {
   *     token,
   *     baseUrl,
   *   },
   *   tokenUrl: String, //上传token获取地址
   *   uploadUrl: String, //上传url
   * }
   */
  // init(options) {

  // }

  /**
   * 上传文件
   * @param  options
   * file: 文件对象
   *   react native:
   *   {
   *     uri: string;
   *     headers: Headers;
   *     name?: string;
   *     type?: string;
   *   }
   *   web:
   *   File 对象 https://developer.mozilla.org/zh-CN/docs/Web/API/File https://developer.mozilla.org/zh-CN/docs/Web/Guide/Using_FormData_Objects
   *   document.getElementById('file').files[0]
   * key: http://developer.qiniu.com/code/v6/api/kodo-api/up/upload.html
   * TODO 1.自动重试 2.token 过期处理
   * @return Promise
   */
  upload(options) {
    let file = options.file;
    if (!file || (Platform.OS !== 'web' && !file.uri)) {
      return Promise.reject(new Error('invalid file'));
    }
    return this._getToken().then(tokenConfig => {
      const task = () => {
        const fd = new FormData();
        if (options.key) {
          fd.append('key', options.key);
        }
        fd.append('token', tokenConfig.token);
        if (Platform.OS === 'web') {
          fd.append('file', file);
        } else {
          fd.append('file', {
            type: 'application/octet-stream',
            ...options.file,
          });
        }
        return axios(this._uploadUrl, {
          method: 'POST',
          data: fd,
          fullResponse: true,
          LAB_JSON: false,
        });
      };
      // 七牛上传队列执行
      return this._taskQueue.add(task).then(
        response => {
          return this._getUrl(tokenConfig.baseUrl, response.data.key);
        },
        error => {
          // if (response.states === 401) {
          //   //token 过期处理
          //   this._tokenPromise = null;
          // }
          // 上传失败删除token(最好根据失败原因判断)
          this._tokenPromise = null;
          return Promise.reject(error);
        }
      );
    });
  }

  _getToken(refresh) {
    if (refresh) {
      this._tokenPromise = null;
    }
    if (this._tokenPromise) {
      return this._tokenPromise;
    }
    if (this._tokenConfig) {
      this._tokenPromise = Promise.resolve(this._tokenConfig);
    } else {
      this._tokenPromise = axios(this._tokenUrl)
        .then(response => {
          const data = response.DATA || response;
          if (data.token && (data.domain || data.base_url)) {
            if (data.upload_url) {
              this._uploadUrl = data.upload_url;
            }
            return {
              token: data.token,
              baseUrl: data.base_url || `http://${data.domain}`,
            };
          }
          const error = new Error(JSON.stringify(response));
          error.code = 'get-token-error';
          return Promise.reject(error);
        })
        .catch(e => {
          this._tokenPromise = null;
          e.code = 'get-token-error';
          return Promise.reject(e);
        });
    }
    return this._tokenPromise;
  }

  _getUrl(baseUrl, key) {
    if (!key) {
      return false;
    }
    key = encodeURI(key);
    if (baseUrl[baseUrl.length - 1] !== '/') {
      baseUrl = baseUrl + '/';
    }
    return baseUrl + key;
  }

  /**
    * invoke the imageView2 api of Qiniu
    * http://developer.qiniu.com/code/v6/api/kodo-api/image/imageview2.html
    * https://github.com/qiniu/js-sdk/
    * @param  {Object} api params
    * {
    * 	mode, //裁剪模式
    * 	w, //真实宽度
    * 	h, //真实高度
    * 	wdp, //虚拟宽度
    * 	hdp, //虚拟高度
    * 	q, //图片质量 一般不用配置
    * 	format, //图片格式 一般不用配置
    * 	url, //url 和key二选一
    * 	key,
    * }
    * @return {String} url of processed image
    */
  imageView2(op) {
    var mode = op.mode, w = op.w, h = op.h, q = op.q, format = op.format;
    if (!w && op.wdp) {
      w = utils.dp2px(op.wdp);
    }
    if (!h && op.hdp) {
      h = utils.dp2px(op.hdp);
    }
    if (!mode) {
      return false;
    }
    if (!w && !h) {
      return false;
    }

    var imageUrl = 'imageView2/' + mode;
    imageUrl += w ? '/w/' + w : '';
    imageUrl += h ? '/h/' + h : '';
    imageUrl += q ? '/q/' + q : '';
    imageUrl += format ? '/format/' + format : '';
    if (op.url) {
      imageUrl = op.url + (op.url.indexOf('?') > 0 ? '|' : '?') + imageUrl;
    } else if (op.key) {
      imageUrl = this.getUrl(op.key) + '?' + imageUrl;
    }
    return imageUrl;
  }

  isQiniuUrl(url) {
    return (
      url && (url.indexOf('clouddn.com') > 0 || url.indexOf('qiniucdn.com') > 0)
    );
  }
}

export default new Qiniu();
