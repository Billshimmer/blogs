import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';

const Touchable = requireComp('com.Touchable');

function renderBtn(text, onPress, key) {
  return (
    <Touchable
      key={key}
      style={styles.btn}
      onPress={onPress}>
      <Text style={styles.btnText}>{text}</Text>
    </Touchable>
  );
}

function renderTestBtns1(count = 9) {
  var btns = [];
  for(var i = 0; i < count; ++i) {
    btns.push(renderBtn.call(this, 'test' + (i + 1), function(i) {
      this['test' + (i + 1)]();
    }.bind(this, i), 'k' + i));
  }
  return (
    <View style={styles.btnContainer}>
      {btns}
    </View>
  );
}

function renderTestBtns(context = this) {
  var key,
    btns = [];
    //console.log('xxxx111', Object.keys(Object.getPrototypeOf(context)), Object.getOwnPropertyNames(Object.getPrototypeOf(context)));
  for(key of Object.getOwnPropertyNames(Object.getPrototypeOf(context))) {
    if(key.indexOf('test') == 0) {
      btns.push(renderBtn.call(context, key.length > 8 ? key.slice(4) : key, function(key) {
        this[key]();
      }.bind(context, key), key));
    }
  }
  return (
    <View style={styles.btnContainer}>
      {btns}
    </View>
  );
}

function logTag() {
  var tag = this.TAG || this.props.TAG;
  return tag ? this.constructor.name + '_' + tag : this.constructor.name;
}

function log() {
  var tag = this.logTag();
  if(!arguments.length) {
    console.log(tag);
  } else {
    arguments[0] = tag + ' ' + arguments[0]
    console.log.apply(console, arguments);
  }
}

var styles = StyleSheet.create({
  btnContainer: {
    padding: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  btn: {
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#EEEEEE',
    marginBottom: 5,
  },
  btnText: {
    fontSize: 16,
    color: '#4576B0',
  },
});

export default {
  renderTestBtns: function(context) {
    return renderTestBtns.call(context);
  },
  renderTestBtns1: function(context, count) {
    return renderTestBtns1.call(context, count);
  },
  renderBtn,
  assignHelpers: function(obj) {
    Object.assign(obj, {
      renderTestBtns,
      renderTestBtns1,
      renderBtn,
      log,
      logTag,
    });
  }
};
