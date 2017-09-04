'use strict';

function toDouble(num) {
  if (num >= 10) {
    return num;
  } else {
    return '0' + num;
  }
}

/*时间格式转换 */
export function conversionTime(time, type) {
  let tDate = new Date(time * 1000);
  let year = tDate.getFullYear();
  let month = tDate.getMonth() + 1;
  let day = tDate.getDate();
  let hour = tDate.getHours();
  let mil = tDate.getMinutes();
  if (type == 1) {
    /*2016-06-23 12:24*/
    return year + '-' + toDouble(month) + '-' + toDouble(day) + ' ' +
      toDouble(hour) +
      ':' +
      toDouble(mil);
  }
  if (type == 2) {
    /*2016-06-23*/
    return year + '-' + toDouble(month) + '-' + toDouble(day);
  }
  if (type == 3) {
    /*2016.06.23*/
    return year + '.' + toDouble(month) + '.' + toDouble(day);
  }
  if (type == 4) {
    /*2016.06.23 12:24*/
    return year + '.' + toDouble(month) + '.' + toDouble(day) + ' ' +
      toDouble(hour) +
      ':' +
      toDouble(mil);

  }
  if (type == 5) {
    /*2016/06/23*/
    return year + '/' + toDouble(month) + '/' + toDouble(day);
  }
  return null;
}

// * timeFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// * timeFormat("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export function timeFormat(fmt, date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    date = date ? new Date(date * 1000) : new Date();
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
  return fmt;
}