import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
  Platform,
} from 'react-native';
const TOAST_MAX_WIDTH = 0.8;
const TOAST_ANIMATION_DURATION = 200;
const DIMENSION = Dimensions.get('window');
const WINDOW_WIDTH = DIMENSION.width;
const positions = {
  TOP: 20,
  BOTTOM: -20,
  CENTER: 0,
};

const durations = {
  LONG: 3500,
  SHORT: 2000,
};

const defaultStyle = {
  position: 'absolute',
  width: WINDOW_WIDTH,
  justifyContent: 'center',
  alignItems: 'center',
};
if (Platform.OS === 'web') {
  defaultStyle.zIndex = 9999;
}

const styles = StyleSheet.create({
  defaultStyle,
  containerStyle: {
    padding: 10,
    backgroundColor: '#000',
    opacity: 0.8,
    borderRadius: 5,
    marginHorizontal: WINDOW_WIDTH * ((1 - TOAST_MAX_WIDTH) / 2),
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  textStyle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

class ToastContainer extends Component {
  static displayName = 'ToastContainer';

  static propTypes = {
    duration: PropTypes.number,
    visible: PropTypes.bool,
    position: PropTypes.number,
    animation: PropTypes.bool,
    shadow: PropTypes.bool,
    backgroundColor: PropTypes.string,
    shadowColor: PropTypes.string,
    textColor: PropTypes.string,
    delay: PropTypes.number,
    hideOnPress: PropTypes.bool,
    onHide: PropTypes.func,
    onHidden: PropTypes.func,
    onShow: PropTypes.func,
    onShown: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    duration: durations.SHORT,
    animation: true,
    shadow: true,
    position: positions.BOTTOM,
    delay: 0,
    hideOnPress: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: props.visible,
      opacity: new Animated.Value(0),
    };
    this._animating = false;
    this._root = null;
    this._hideTimeout = null;
    this._showTimeout = null;

    this._show = this._show.bind(this);
    this._hide = this._hide.bind(this);
  }

  componentDidMount() {
    if (this.state.visible) {
      this._showTimeout = setTimeout(() => this._show(), this.props.delay);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        this._showTimeout = setTimeout(() => this._show(), this.props.delay);
      } else {
        this._hide();
      }

      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    //this._hide(); // XXX componentWillUnmount中调用_hide动画没有意义
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible;
  }

  _show() {
    clearTimeout(this._showTimeout);
    if (!this._animating) {
      clearTimeout(this._hideTimeout);
      this._animating = true;
      this._root.setNativeProps({
        pointerEvents: 'auto',
      });
      this.props.onShow && this.props.onShow();
      Animated
        .timing(this.state.opacity, {
          toValue: 0.8,
          duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
          easing: Easing.out(Easing.ease),
        })
        .start(({ finished }) => {
          if (finished) {
            this._animating = !finished;
            this.props.onShown && this.props.onShown();
            if (this.props.duration > 0) {
              this._hideTimeout = setTimeout(
                () => this._hide(),
                this.props.duration,
              );
            }
          }
        });
    }
  }

  _hide() {
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    if (!this._animating) {
      this._root.setNativeProps({
        pointerEvents: 'none',
      });
      this.props.onHide && this.props.onHide();
      Animated
        .timing(this.state.opacity, {
          toValue: 0,
          duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
          easing: Easing.in(Easing.ease),
        })
        .start(({ finished }) => {
          if (finished) {
            this._animating = false;
            this.props.onHidden &&
              this.props.onHidden();
          }
        });
    }
  }

  render() {
    if (!this.state.visible || this._animating) {
      return null;
    }
    let props = this.props;
    let offset = props.position;
    let position = offset
      ? {
          [offset < 0 ? 'bottom' : 'top']: Math.abs(offset),
        }
      : {
          top: 0,
          bottom: 0,
        };

    return (
      <View style={[styles.defaultStyle, position]} pointerEvents="box-none">
        <TouchableWithoutFeedback
          onPress={this.props.hideOnPress ? this._hide : null}
        >
          <Animated.View
            style={[
              styles.containerStyle,
              props.backgroundColor &&
                { backgroundColor: props.backgroundColor },
              {
                opacity: this.state.opacity,
              },
              props.shadow && styles.shadowStyle,
              props.shadowColor && { shadowColor: props.shadowColor },
            ]}
            pointerEvents="none"
            ref={ele => this._root = ele}
          >
            <Text
              style={[
                styles.textStyle,
                props.textColor && { color: props.textColor },
              ]}
            >
              {this.props.children}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default ToastContainer;
export { positions, durations };
