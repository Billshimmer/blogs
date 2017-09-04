module.exports = {
  version: '1.1.0',
  default: {
    baseUrl: 'http://basic2.hz.backustech.com:81',
    packageWhitelist: ['com', 'demo', 'test', 'sub'],
    imageBlacklist: [],
    compBlacklist: [],
    extra: {
      qiniu: {
        tokenUrl: 'http://basic2.hz.backustech.com:81/Content/Index/getQiniuToken?LAB_JSON=1&LAB_NOTRANS=1',
      },
    },
    android: {
      xxx: 'android',
    },
    ios: {
      xxx: 'ios',
    },
    web: {
      xxx: 'web',
    }
  },
  buildTypes: {
    debug: {
    },
    beta: {

    },
    release: {
      debug: true,
    },
  }
};
