'use strict';

import React, { PropTypes, Component } from 'react';
import ReactNative, {
  Platform,
  StyleSheet,
  requireNativeComponent,
  View,
} from 'react-native';

import LABMapView from './LABMapView';

/**
 * 动态加载数据的MapView
 * 数据请求接口规范:
 * url: url + query + '&bounds=minX,minY;maxX,maxY'
 * 请求范围(bounds)规范: minX <= x < maxX; minY <= y < maxY
 * response: {
 *   CODE, //成功 'ok'
 *   MESSAGE,
 *   DATA: {
 *     list: [ //点的数组
 *       {
 *       id, //唯一标记一个点
 *       x, //经度
 *       y, //维度
 *       ...其他数据
 *       }
 *     ]
 *   }  
 * }
 */
export default class LABDynamicMapView extends Component {
  static propTypes = {
    ...LABMapView.propTypes,
    /**
     * 查询图层
     * 图层的zIndex 由先后顺序决定
     * 图层以url 作为唯一key 如果url不变，则会忽略其它字段的改变
     */
    layers: PropTypes.arrayOf(
      PropTypes.shape({
        /**
       * 图层数据url
       */
        url: PropTypes.string.isRequired,
        /**
       * 图层显示的最小层级 默认不限定
       * 一般需要设置该值防止图层缩小时显示的点过多
       */
        minZoom: PropTypes.number,
        /**
       * 图层显示的最大层级 默认不限定
       */
        maxZoom: PropTypes.number,
        /**
       * 图层显示范围 默认为中国范围
       */
        minLongitude: PropTypes.number,
        minLatitude: PropTypes.number,
        maxLongitude: PropTypes.number,
        maxLatitude: PropTypes.number,
        /**
       * 图层中每一个渲染单元(方块)的大小，单位为经纬度差值
       * 一般需要设为图层处于最佳缩放层级时手机屏幕(竖屏)经度跨度的 [1/4, 1]
       */
        blockSize: PropTypes.number.isRequired,
        /**
       * 对图层中marker的统一配置
       */
        marker: PropTypes.shape({
          type: PropTypes.string, //marker 类型 需要native配置
        }).isRequired,
      })
    ),
    /**
     * 查询条件 会拼接到图层url之后
     */
    query: PropTypes.string,
    // /**
    //  * 查询结束结果回调
    //  * Function(event)
    //  * event.nativeEvent: {
    //  *   code, // 成功 'success' 取消 'cancel' 失败 ...
    //  *   message,
    //  *   data: [
    //  *     {
    //  *       title,
    //  *       longitude,
    //  *       latitude,
    //  *       ...
    //  *     }
    //  *   ]
    //  * }  */ onQueryComplete: PropTypes.func,
  };

  // static defaultProps = { };

  constructor(props, context) {
    super(props, context);
    this.state = {
      layers: this._prapareLayers(props.layers),
    };
    this._onAnnotationPress = this._onAnnotationPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.layers !== nextProps.layers) {
      this.state.layers = this._prapareLayers(nextProps.layers);
    }
  }

  _prapareLayers(layers) {
    return (
      layers &&
      layers.map(layer => {
        if (layer.minLongitude == null) {
          layer = {
            ...layer,
          };
          layer.minLongitude = 73;
          layer.minLatitude = 3;
          layer.maxLongitude = 136;
          layer.maxLatitude = 54;
        }
        return layer;
      })
    );
  }

  /**
   * onAnnotationPress直接返回从服务器获取的点的原始数据
   */
  _onAnnotationPress(event) {
    if (!this.props.onAnnotationPress) {
      return;
    }
    let annId = event.nativeEvent.annotationId;
    if (annId) {
      try {
        this.props.onAnnotationPress(JSON.parse(annId));
      } catch (e) {}
    }
  }

  render() {
    return (
      <NativeMapView
        {...this.props}
        layers={this.state.layers}
        onAnnotationPress={this._onAnnotationPress}
        sendRegionChangeCompleteEvent={!!this.props.onRegionChangeComplete}
      />
    );
  }
}

const NativeMapView = requireNativeComponent(
  'LABDynamicMapView',
  LABDynamicMapView,
  {
    nativeOnly: {
      sendRegionChangeCompleteEvent: true,
    },
  }
);
