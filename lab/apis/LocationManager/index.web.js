/**
 * Created by zhouzeyong on 2017/5/8.
 */

module.exports = {
  /**
   * options: {
   *   coordType, //返回的坐标类型 'bd09' 'gcj02' 默认bd09
   * }
   */
  getCurrentPosition(options) {
    function timeoutPromise(timeout) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve();
        }, timeout);
      });

    }

    function waitUntil(props) {
      return new Promise(function (resolve, reject) {
        const map = new BMap.Map("test");
        resolve(map);
      }).catch(err => {
        console.log("there's no BMap yet. Waitting ...", err);
        return timeoutPromise(300).then(() => {
          return waitUntil(props);
        });
      });
    }

    return new Promise((resolve, reject) => {
      let bmapSrc = `http://api.map.baidu.com/api?v=2.0&ak=${options.ak}&callback=init`;
      if (typeof BMap != 'undefined') {
        waitUntil(this.props).then(map => {
          console.log(`[+] bmap loaded`, map);
          this.props.callback(map);
        });
      } else {
        let script = document.querySelector(`script[src='${bmapSrc}']`);
        if (!script) {
          script = document.createElement("script");
          script.src = bmapSrc;
          document.body.appendChild(script);
          waitUntil(this.props).then(map => {
            console.log(`[+] bmap loaded`, map);
            let geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener("locationSuccess", function (result, addressComponent) {
              console.log('locationSuccess result=', result, ' addressComponent=', addressComponent);
              let data = {
                longitude: result.point.lng,
                latitude: result.point.lat
              }
              resolve(data);
            });
            geolocationControl.addEventListener("locationError", function (stateCode) {
              console.log("location error, code:" + stateCode);
              reject("location error, code:" + stateCode);
            });

            geolocationControl.location();
          });
        }
      }
    });
  },
};