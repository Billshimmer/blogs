'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native';

import Link from './Link';

export default class CardItem extends Component {
  static propTypes = {
    ...Link.propTypes,
    itemData: PropTypes.array.isRequired,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    imageHeight: PropTypes.number,
    borderRadius: PropTypes.number,
  };

  static defaultProps = {
    marginRight: 10,
    marginBottom: 10,
    imageHeight: 150,
    borderRadius: 0,
  };

  constructor(props, context) {
    super(props, context);
    this._renderItem = this._renderItem.bind(this);
  }

  _renderItem(data, index) {
    let itemStyle = {
      marginBottom: this.props.marginBottom,
      flex: 1,
    };
    let imageStyle= {
      borderRadius: this.props.borderRadius,
      flex: 1,
      height: this.props.imageHeight,
    }
    if (index != this.props.itemData.length - 1) {
      itemStyle.marginRight = this.props.marginRight;
    }
    return (
      <Link
        {...this.props}
        style={itemStyle}
        key={index}
        url={data.url}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={imageStyle}
              source={{uri: data.image}}/>
            <View style={[styles.layer]}>
              <Text style={styles.fontTitle}>{data.title}</Text>
              <Text style={styles.fontTime}>{data.time}</Text>
            </View>
          </View>
          <View style={[styles.content, {
            borderBottomLeftRadius: this.props.borderRadius,
            borderBottomRightRadius: this.props.borderRadius,
          }]}>
            <View style={styles.user}>
              <Image source={{uri: data.avatar}}
                style={styles.avatar}/>
              <Text style={styles.fontNick}>{data.nickname}</Text>
            </View>
            <View style={styles.other}>
              <Text style={styles.fontLocation}>{data.location}</Text>
              <Text style={styles.fontPrice}>{data.price}</Text>
            </View>
          </View>
        </View>
      </Link>
    );
  }

  render() {
    let items = this.props.itemData.map((data, i) => {
      return this._renderItem(data, i);
    });
    return (
      <View style={styles.container}>
        {items}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  itemContainer: {
    flexDirection: 'column',
  },
  imageContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(62, 74, 92, 0.8)'
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  other: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  fontTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    padding: 5,
  },
  fontTime: {
    color: '#FFFFFF',
    padding: 5,
  },
  fontNick: {},
  fontLocation: {
    color: '#26adf0'
  },
  fontPrice: {
    color: '#d7132b'
  }
});
