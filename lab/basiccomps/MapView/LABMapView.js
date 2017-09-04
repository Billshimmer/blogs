'use strict';

const ColorPropType = require('react-native/Libraries/StyleSheet/ColorPropType.js');
const EdgeInsetsPropType = require('react-native/Libraries/StyleSheet/EdgeInsetsPropType.js');

const React = require('react');
const {
  PropTypes,
} = React;
const ReactNative = require('react-native');
const {
  Platform,
  StyleSheet,
  requireNativeComponent,
  View,
  Image,
  UIManager,
  findNodeHandle,
} = ReactNative;

const processColor = require('react-native/Libraries/StyleSheet/processColor.js');

let guidCount = 1; //用于给每个annotation分配唯一的id

function setGuid(obj) {
  obj['__$id'] = String(guidCount++);
}

function getGuid(obj) {
  return obj['__$id'];
}

const MapView = React.createClass({

  propTypes: {
    ...View.propTypes,
    /**
     * Used to style and layout the `MapView`.
     */
    style: View.propTypes.style,

    /**
     * If `true` the app will ask for the user's location and display it on
     * the map. Default value is `false`.
     *
     * **NOTE**: You'll need to add the `NSLocationWhenInUseUsageDescription`
     * key in Info.plist to enable geolocation, otherwise it will fail silently.
     */
    showsUserLocation: React.PropTypes.bool,

    /**
     * If `true` the map will follow the user's location whenever it changes.
     * Note that this has no effect unless `showsUserLocation` is enabled.
     * Default value is `true`.
     */
    followUserLocation: React.PropTypes.bool,

    /**
     * If `false` points of interest won't be displayed on the map.
     * Default value is `true`.
     */
    showsPointsOfInterest: React.PropTypes.bool,

    /**
     * If `false`, compass won't be displayed on the map.
     * Default value is `true`.
     */
    showsCompass: React.PropTypes.bool,

    /**
     * If `false` the user won't be able to pinch/zoom the map.
     * Default value is `true`.
     */
    zoomEnabled: React.PropTypes.bool,

    /**
     * When this property is set to `true` and a valid camera is associated with
     * the map, the camera's heading angle is used to rotate the plane of the
     * map around its center point.
     *
     * When this property is set to `false`, the
     * camera's heading angle is ignored and the map is always oriented so
     * that true north is situated at the top of the map view
     */
    rotateEnabled: React.PropTypes.bool,

    /**
     * When this property is set to `true` and a valid camera is associated
     * with the map, the camera's pitch angle is used to tilt the plane
     * of the map.
     *
     * When this property is set to `false`, the camera's pitch
     * angle is ignored and the map is always displayed as if the user
     * is looking straight down onto it.
     */
    pitchEnabled: React.PropTypes.bool,

    /**
     * If `false` the user won't be able to change the map region being displayed.
     * Default value is `true`.
     */
    scrollEnabled: React.PropTypes.bool,

    /**
     * The map type to be displayed.
     *
     * - `standard`: Standard road map (default).
     * - `satellite`: Satellite view.
     * - `hybrid`: Satellite view with roads and points of interest overlaid.
     */
    mapType: React.PropTypes.oneOf([
      'standard',
      'satellite',
      'hybrid', //不支持
    ]),

    /**
     * The region to be displayed by the map.
     *
     * The region is defined by the center coordinates and the span of
     * coordinates to display.
     */
    region: React.PropTypes.shape({
      /**
       * Coordinates for the center of the map.
       */
      latitude: React.PropTypes.number.isRequired,
      longitude: React.PropTypes.number.isRequired,

      /**
       * Distance between the minimum and the maximum latitude/longitude
       * to be displayed.
       */
      latitudeDelta: React.PropTypes.number,
      longitudeDelta: React.PropTypes.number,
    }),

    /**
     * Map annotations with title and subtitle.
     */
    annotations: React.PropTypes.arrayOf(React.PropTypes.shape({
      /**
       * The location of the annotation.
       */
      latitude: React.PropTypes.number.isRequired,
      longitude: React.PropTypes.number.isRequired,

      /**
       * Whether the pin drop should be animated or not
       */
      animateDrop: React.PropTypes.bool,

      /**
       * Whether the pin should be draggable or not
       */
      draggable: React.PropTypes.bool,

      /**
       * Event that fires when the annotation drag state changes.
       */
      onDragStateChange: React.PropTypes.func,

      /**
       * Event that fires when the annotation gets was tapped by the user
       * and the callout view was displayed.
       */
      onFocus: React.PropTypes.func,

      /**
       * Event that fires when another annotation or the mapview itself
       * was tapped and a previously shown annotation will be closed.
       */
      onBlur: React.PropTypes.func,

      /**
       * Annotation title and subtile.
       */
      title: React.PropTypes.string,
      subtitle: React.PropTypes.string,

      /**
       * Callout views.
       */
      leftCalloutView: React.PropTypes.element,
      rightCalloutView: React.PropTypes.element,
      detailCalloutView: React.PropTypes.element,

      /**
       * The pin color. This can be any valid color string, or you can use one
       * of the predefined PinColors constants. Applies to both standard pins
       * and custom pin images.
       *
       * Note that on iOS 8 and earlier, only the standard PinColor constants
       * are supported for regular pins. For custom pin images, any tintColor
       * value is supported on all iOS versions.
       */
      tintColor: ColorPropType,

      /**
       * Custom pin image. This must be a static image resource inside the app.
       */
      image: Image.propTypes.source,

      /**
       * Custom pin view. If set, this replaces the pin or custom pin image.
       * {
       *   type: String, 指定view 的类型
       *   title: String, 标题
       *   ... 其他数据
       * }
       */
      view: React.PropTypes.object,

      /**
       * annotation id
       */
      id: React.PropTypes.string,
    })),

    /**
     * Map overlays  TODO
     */
    // overlays: React.PropTypes.arrayOf(React.PropTypes.shape({
    //   /**
    //    * Polyline coordinates
    //    */
    //   coordinates: React.PropTypes.arrayOf(React.PropTypes.shape({
    //     latitude: React.PropTypes.number.isRequired,
    //     longitude: React.PropTypes.number.isRequired
    //   })),
    //
    //   /**
    //    * Line attributes
    //    */
    //   lineWidth: React.PropTypes.number,
    //   strokeColor: ColorPropType,
    //   fillColor: ColorPropType,
    //
    //   /**
    //    * Overlay id
    //    */
    //   id: React.PropTypes.string
    // })),

    /**
     * Maximum size of the area that can be displayed.
     */
    maxDelta: React.PropTypes.number,

    /**
     * Minimum size of the area that can be displayed.
     */
    minDelta: React.PropTypes.number,

    /**
     * Insets for the map's legal label, originally at bottom left of the map.
     */
    legalLabelInsets: EdgeInsetsPropType,

    /**
     * Callback that is called continuously when the user is dragging the map.
     */
    onRegionChange: React.PropTypes.func,

    /**
     * Callback that is called once, when the user is done moving the map.
     */
    onRegionChangeComplete: React.PropTypes.func,

    onAnnotationPress: React.PropTypes.func,

    /**
     * @platform android
     */
    active: React.PropTypes.bool,

    //LAB 扩展

    // 初始显示区域
    initialRegion: PropTypes.shape({

      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,

      latitudeDelta: PropTypes.number.isRequired,
      longitudeDelta: PropTypes.number.isRequired,
    }),

    /**
     * bd09 gcj02 wgs84 默认bd09
     */
    coorType: PropTypes.string,

    /**
     * 是否在地图初始化之后定位到用户所在位置
     */
    locateInitialRegion: PropTypes.bool,

    /**
     * 是否显示定位按钮
     */
    showsLocateButton: PropTypes.bool,

    /**
     * 是否显示放大缩小按钮
     */
    showZoomControls: PropTypes.bool,

  },

  getDefaultProps() {
    return {
      coorType: 'bd09',
    };
  },

  statics: {
    /**
     * Standard iOS MapView pin color constants, to be used with the
     * `annotation.tintColor` property. On iOS 8 and earlier these are the
     * only supported values when using regular pins. On iOS 9 and later
     * you are not obliged to use these, but they are useful for matching
     * the standard iOS look and feel.
     */
    PinColors: {
      RED: '#ff3b30',
      GREEN: '#4cd964',
      PURPLE: '#c969e0',
    },
  },

  _mapAnnotations: function(annotations) {
    return annotations && annotations.map((annotation) => {
      if (annotation.view && React.isValidElement(annotation.view)) {
        let view = {
          ...annotation.view.props,
        };
        delete view.children;
        annotation = {
          ...annotation,
          view,
        };
      }
      if (!getGuid(annotation)) {
        setGuid(annotation);
      }
      return annotation;
    });
  },

  getInitialState: function() {
    return {
      annotations: this._mapAnnotations(this.props.annotations),
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.annotations !== nextProps.annotations) {
      this.state.annotations = this._mapAnnotations(nextProps.annotations);
    }
  },

  render: function() {
    return (
      <LABMapView
        {...this.props}
        ref="map"
        annotations={this.state.annotations}
        onAnnotationPress={this._onAnnotationPress}
        onRegionChangeComplete={this._onRegionChangeComplete}
        sendRegionChangeCompleteEvent={!!this.props.onRegionChangeComplete}
      />
    );
  },

  /**
   * 定位
   */
  locate: function() {
    if (this.refs.map) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.map),
        UIManager.LABMapView.Commands.locate,
        null,
      );
    }
  },

  _onRegionChangeComplete: function(event) {
    this.props.onRegionChangeComplete && this.props.onRegionChangeComplete(event.nativeEvent);
  },

  _onAnnotationPress: function(event) {
    if (__DEV__) console.log('onAnnotationPress ', event.nativeEvent);
    let annotationId = event.nativeEvent.annotationId;
    let annotations = this.state.annotations;
    if (!annotationId || !annotations) {
      return;
    }
    let annotation;
    for (let i = 0; i < annotations.length; ++i) {
      if (getGuid(annotations[i]) === annotationId) {
        annotation = annotations[i];
        break;
      }
    }
    if (annotation) {
      this.props.onAnnotationPress && this.props.onAnnotationPress(annotation);
      annotation.onFocus && annotation.onFocus(event.nativeEvent);
    }
  },
});

// const styles = StyleSheet.create({
//
// });

const LABMapView = requireNativeComponent('LABMapView', MapView, {
  nativeOnly: {
    sendRegionChangeCompleteEvent: true,
  }
});

module.exports = MapView;
