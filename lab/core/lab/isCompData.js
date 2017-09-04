'use strict';

//通过判断是否有ui_type字段来判断是否为LAB comp数据
export default function isCompData(data) {
  return data && data.ui_type;
}