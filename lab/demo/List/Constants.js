'use strict';

import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';

export default {
  refreshControlProps: { //只能设置样式相关的
    tintColor: '#5B050B',
    // titleColor: '#02619E',
    title: 'refresh',
    colors: ['#C93437', '#375BF1', '#F7D23E', '#34A350'],
    //progressBackgroundColor: '#137A58',
    size: RefreshControl.SIZE.DEFAULT,
    progressViewOffset: null,
  },
};
