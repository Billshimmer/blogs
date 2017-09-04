module.exports = {
  version: '1.0.0',
  default: {
    baseUrl: 'http://<%= moduleName %>.hz.backustech.com:81',
    //packageWhiteList: ['com',],
    //imageBlackList: [],
    extra: {
      qiniu: {
        tokenUrl: 'http://<%= moduleName %>.hz.backustech.com:81/Content/Index/getQiniuToken?LAB_JSON=1&LAB_NOTRANS=1',
      },
    },
    android: {
    },
    ios: {
    },
    web: {
    }
  },
  buildTypes: {
    debug: {
    },
    beta: {
    },
    release: {
    },
  }
};
