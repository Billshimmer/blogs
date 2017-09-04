/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Animation,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  NativeModules,
  Image,
} from 'react-native';
import LAB, { Page } from 'lab4';
import SimplePage from 'lab4/demo/SimplePage';
import { AudioRecorder, AudioPlayer } from 'lab4/apis/AudioKit/index';
import Icon from 'react-native-vector-icons/FontAwesome';

//const AudioRecorderManager = NativeModules.AudioRecorderManager;

export default class AudioKitDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.startRecording = this.startRecording.bind(this);
    this.finishRecording = this.finishRecording.bind(this);
    this.renderVoiceButtonContainer = this.renderVoiceButtonContainer.bind(
      this
    );
    this.renderVoiceContainer = this.renderVoiceContainer.bind(this);
    this.audioRecorder = new AudioRecorder();
    this.audioPlayer = new AudioPlayer();
    this.audioPlayer
      .prepareWithUrl(
        'http://image-public.touhaozhubo.com/FqwyvDowUEJxRVp2BU18qx5Ja4S9'
      )
      .then(
        info => {
          this.setState({
            recordFinish: true,
            duration: info.formattedDuration,
          });
        },
        error => {
          console.log(error);
        }
      );
    this.audioPlayer.playerDidFinish = this.playerDidFinish.bind(this);
    this.audioPlayer.playProgress = this.playProgress.bind(this);
    this.state = {
      textColor: { color: '#248DE4' },
      buttonBackgroundColor: { backgroundColor: 'white' },
      text: 'Press to Speak',
      recordFinish: false,
      duration: '0.00',
    };
  }

  startRecording() {
    this.setState({
      textColor: { color: 'white' },
      buttonBackgroundColor: { backgroundColor: '#248DE4' },
      text: 'Release to Finish',
    });
    this.audioRecorder.prepareRecording('temp.m4a');
    this.audioRecorder.startRecording();
  }

  finishRecording() {
    this.audioRecorder
      .finishRecording()
      .then(filePath => {
        return this.audioPlayer.prepareWithPath(filePath);
      })
      .then(
        info => {
          this.setState({
            textColor: { color: '#248DE4' },
            buttonBackgroundColor: { backgroundColor: 'white' },
            text: 'Press to Speak',
            recordFinish: true,
            duration: info.formattedDuration,
          });
        },
        error => {
          this.setState({
            textColor: { color: '#248DE4' },
            buttonBackgroundColor: { backgroundColor: 'white' },
            text: 'Press to Speak',
            recordFinish: false,
          });
        }
      );
  }

  startPlaying() {
    if (this.audioPlayer.playing) {
      this.audioPlayer.stopPlaying();
    } else {
      this.audioPlayer.startPlaying();
    }
  }

  playProgress(progress) {
    if (this.audioPlayer.playing) {
      this.setState({
        duration: progress.formattedCurrentTime,
      });
    } else {
      this.setState({
        duration: this.audioPlayer.formattedDuration,
      });
    }
  }

  removeAudio() {
    //AudioRecorder.showRecorderView(true);
    //AudioRecorderManager.showRecorderView(true);
    this.setState({
      recordFinish: false,
    });
  }

  playerDidFinish() {
    console.log('playerDidFinish');
    this.setState({
      duration: this.audioPlayer.formattedDuration,
    });
  }

  render() {
    let voiceButtonContainer = null;
    let voiceContainer = null;
    if (!this.state.recordFinish) {
      voiceButtonContainer = this.renderVoiceButtonContainer();
    } else {
      voiceContainer = this.renderVoiceContainer();
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>

        <View style={styles.content}>
          {voiceContainer}
          {voiceButtonContainer}
        </View>
      </View>
    );
  }

  renderVoiceContainer() {
    return (
      <View style={styles.voiceContainer}>
        <TouchableOpacity
          style={styles.playButtonContainer}
          onPress={this.startPlaying.bind(this)}
        >
          <Image
            source={require('../img/icon_sound.png')}
            style={{ width: 13, height: 19 }}
          />
          <Text style={styles.playButtonText}>{this.state.duration}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButtonConatainer}
          onPress={this.removeAudio.bind(this)}
        >
          <Icon name="trash" size={20} color="#FF675A" />
          <Text style={styles.deleteButtonText}>删除</Text>
        </TouchableOpacity>

      </View>
    );
  }

  renderVoiceButtonContainer() {
    return (
      <View style={styles.bottomContainer}>
        <TouchableHighlight
          activeOpacity={1}
          onPressIn={this.startRecording}
          onPressOut={this.finishRecording}
          style={[styles.button, this.state.buttonBackgroundColor]}
        >
          <Text style={[styles.buttonText, this.state.textColor]}>
            {this.state.text}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: 'white',
    height: 49,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  button: {
    marginRight: 20,
    marginLeft: 20,
    height: 37,
    backgroundColor: 'white',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#248DE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#248DE4',
    fontSize: 17,
  },
  content: {
    height: 154,
    backgroundColor: '#F7F7F7',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  voiceContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButtonContainer: {
    backgroundColor: '#248DE4',
    borderRadius: 4,
    borderColor: '#E4E5E6',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    width: 105,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  playButtonText: {
    color: 'white',
    fontSize: 12,
  },
  deleteButtonText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  deleteButtonConatainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
